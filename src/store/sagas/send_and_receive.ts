import { put, call, select } from 'redux-saga/effects';
import {
  CalculateCustomFeeAction,
  CalculateSendMaxFeeAction,
  CALCULATE_CUSTOM_FEE,
  CALCULATE_SEND_MAX_FEE,
  customFeeCalculated,
  customSendMaxUpdated,
  SendPhaseOneAction,
  SendPhaseTwoAction,
  SEND_PHASE_ONE,
  SEND_PHASE_TWO,
  feeIntelMissing,
  sendMaxFeeCalculated,
  SEND_TX_NOTIFICATION,
  CROSS_TRANSFER,
  CrossTransferAction,
  FETCH_FEE_AND_EXCHANGE_RATES,
} from '../sagaActions/send_and_receive';
import RecipientKind from '../../common/data/enums/RecipientKind';
import idx from 'idx';
import dbManager from '../../storage/realm/dbManager';
import WalletOperations from 'src/core/wallets/WalletOperations';
import { createWatcher } from '../utilities';
import WalletUtilities from 'src/core/wallets/WalletUtilities';
import { RealmSchema } from 'src/storage/realm/enum';
import {
  AverageTxFeesByNetwork,
  MultiSigWallet,
  Wallet,
} from 'src/core/wallets/interfaces/interface';
import { NetworkType, TxPriority } from 'src/core/wallets/interfaces/enum';
import Relay from 'src/core/services/Relay';
import {
  sendPhaseOneExecuted,
  SendPhaseOneExecutedPayload,
  sendPhaseTwoExecuted,
  setAverageTxFee,
  setExchangeRates,
} from '../reducers/send_and_receive';

export function getNextFreeAddress(wallet: Wallet | MultiSigWallet) {
  // to be used by react components(w/ dispatch)
  if (!wallet.isUsable) return '';

  const { updatedWallet, receivingAddress } = WalletOperations.getNextFreeExternalAddress(wallet);
  dbManager.updateObjectById(RealmSchema.Wallet, wallet.id, { specs: updatedWallet.specs });
  return receivingAddress;
}

function* feeAndExchangeRatesWorker() {
  try {
    const { exchangeRates, averageTxFees } = yield call(Relay.fetchFeeAndExchangeRates);
    if (!exchangeRates) console.log('Failed to fetch exchange rates');
    else yield put(setExchangeRates(exchangeRates));

    if (!averageTxFees) console.log('Failed to fetch fee rates');
    else yield put(setAverageTxFee(averageTxFees));
  } catch (err) {
    console.log('Failed to fetch fee and exchange rates', { err });
  }
}

export const feeAndExchangeRatesWatcher = createWatcher(
  feeAndExchangeRatesWorker,
  FETCH_FEE_AND_EXCHANGE_RATES
);

function* sendPhaseOneWorker({ payload }: SendPhaseOneAction) {
  const { wallet, recipients } = payload;
  const averageTxFees: AverageTxFeesByNetwork = yield select(
    (state) => state.sendAndReceive.averageTxFees
  );
  if (!averageTxFees) {
    yield put(
      feeIntelMissing({
        intelMissing: true,
      })
    );
    return;
  }

  const averageTxFeeByNetwork = averageTxFees[wallet.derivationDetails.networkType];

  try {
    const { txPrerequisites } = yield call(
      WalletOperations.transferST1,
      wallet,
      recipients,
      averageTxFeeByNetwork
    );

    if (!txPrerequisites) throw new Error('Send failed: unable to generate tx pre-requisite');
    yield put(
      sendPhaseOneExecuted({
        successful: true,
        outputs: {
          txPrerequisites,
          recipients,
        },
      })
    );
  } catch (err) {
    yield put(
      sendPhaseOneExecuted({
        successful: false,
        err,
      })
    );
    return;
  }
}

export const sendPhaseOneWatcher = createWatcher(sendPhaseOneWorker, SEND_PHASE_ONE);

function* sendPhaseTwoWorker({ payload }: SendPhaseTwoAction) {
  const sendPhaseOneResults: SendPhaseOneExecutedPayload = yield select(
    (state) => state.sendAndReceive.sendPhaseOne
  );
  const { wallet, txnPriority, token, note } = payload;

  const txPrerequisites = idx(sendPhaseOneResults, (_) => _.outputs.txPrerequisites);
  const recipients = idx(sendPhaseOneResults, (_) => _.outputs.recipients);
  // const customTxPrerequisites = idx(sendPhaseOneResults, (_) => _.outputs.customTxPrerequisites);
  const network = WalletUtilities.getNetworkByType(wallet.derivationDetails.networkType);

  try {
    const { txid } = yield call(
      WalletOperations.transferST2,
      wallet,
      wallet.id,
      txPrerequisites,
      txnPriority,
      network,
      recipients,
      token
      // customTxPrerequisites
    );

    if (!txid) throw new Error('Send failed: unable to generate txid');
    yield put(
      sendPhaseTwoExecuted({
        successful: true,
        txid,
      })
    );
    if (note) wallet.specs.transactionsNote[txid] = note;
    yield call(dbManager.updateObjectById, RealmSchema.Wallet, wallet.id, {
      specs: wallet.specs,
    });
  } catch (err) {
    yield put(
      sendPhaseTwoExecuted({
        successful: false,
        err,
      })
    );
  }
}

export const sendPhaseTwoWatcher = createWatcher(sendPhaseTwoWorker, SEND_PHASE_TWO);

function* corssTransferWorker({ payload }: CrossTransferAction) {
  const { sender, recipient, amount } = payload;
  const averageTxFees: AverageTxFeesByNetwork = yield select(
    (state) => state.sendAndReceive.averageTxFees
  );
  if (!averageTxFees) {
    yield put(
      feeIntelMissing({
        intelMissing: true,
      })
    );
    return;
  }

  const averageTxFeeByNetwork = averageTxFees[sender.derivationDetails.networkType];
  try {
    // const recipients = yield call(processRecipients);
    const recipients = [
      {
        address: yield call(getNextFreeAddress, recipient),
        amount,
      },
    ];
    const { txPrerequisites } = yield call(
      WalletOperations.transferST1,
      sender,
      recipients,
      averageTxFeeByNetwork
    );

    if (txPrerequisites) {
      const network = WalletUtilities.getNetworkByType(sender.derivationDetails.networkType);
      const { txid } = yield call(
        WalletOperations.transferST2,
        sender,
        sender.id,
        txPrerequisites,
        TxPriority.LOW,
        network,
        recipients
      );

      if (txid)
        yield call(dbManager.updateObjectById, RealmSchema.Wallet, sender.id, {
          specs: sender.specs,
        });
      else throw new Error('Failed to execute cross transfer; txid missing');
    } else throw new Error('Failed to generate txPrerequisites for cross transfer');
  } catch (err) {
    console.log({ err });
    return;
  }
}

export const corssTransferWatcher = createWatcher(corssTransferWorker, CROSS_TRANSFER);

function* calculateSendMaxFee({ payload }: CalculateSendMaxFeeAction) {
  const { numberOfRecipients, wallet } = payload;
  const averageTxFees: AverageTxFeesByNetwork = yield select(
    (state) => state.sendAndReceive.averageTxFees
  );
  const averageTxFeeByNetwork = averageTxFees[wallet.derivationDetails.networkType];
  const feePerByte = averageTxFeeByNetwork[TxPriority.LOW].feePerByte;
  const network = WalletUtilities.getNetworkByType(wallet.derivationDetails.networkType);

  const { fee } = WalletOperations.calculateSendMaxFee(
    wallet,
    numberOfRecipients,
    feePerByte,
    network
  );

  yield put(sendMaxFeeCalculated(fee));
}

export const calculateSendMaxFeeWatcher = createWatcher(
  calculateSendMaxFee,
  CALCULATE_SEND_MAX_FEE
);

function* calculateCustomFee({ payload }: CalculateCustomFeeAction) {
  // feerate should be > minimum relay feerate(default: 1000 satoshis per kB or 1 sat/byte).
  if (parseInt(payload.feePerByte) < 1) {
    yield put(
      customFeeCalculated({
        successful: false,
        carryOver: {
          customTxPrerequisites: null,
        },
        err: 'Custom fee minimum: 1 sat/byte',
      })
    );
    return;
  }

  const { wallet, recipients, feePerByte, customEstimatedBlocks } = payload;
  // const network = WalletUtilities.getNetworkByType(wallet.derivationDetails.networkType);

  // const sendingState: SendingState = yield select((state) => state.sending);
  // const selectedRecipients: Recipient[] = [...sendingState.selectedRecipients];
  // TODO: Wire up the send&receive reducer
  const sending: any = {};

  // const numberOfRecipients = selectedRecipients.length;
  const txPrerequisites = idx(sending, (_) => _.sendST1.carryOver.txPrerequisites);

  let outputs;
  if (sending.feeIntelMissing) {
    // process recipients & generate outputs(normally handled by transfer ST1 saga)
    // const recipients = yield call(processRecipients, accountShell);
    const outputsArray = [];
    for (const recipient of recipients) {
      outputsArray.push({
        address: recipient.address,
        value: Math.round(recipient.amount),
      });
    }
    outputs = outputsArray;
  } else {
    if (!txPrerequisites) throw new Error('ST1 carry-over missing');
    outputs = txPrerequisites[TxPriority.LOW].outputs.filter((output) => output.address);
  }

  // if (!sending.feeIntelMissing && sending.sendMaxFee) {
  //   // custom fee w/ send max
  //   const { fee } = WalletOperations.calculateSendMaxFee(
  //     wallet,
  //     numberOfRecipients,
  //     parseInt(feePerByte),
  //     network
  //   );

  //   // upper bound: default low
  //   if (fee > txPrerequisites[TxPriority.LOW].fee) {
  //     yield put(
  //       customFeeCalculated({
  //         successful: false,
  //         carryOver: {
  //           customTxPrerequisites: null,
  //         },
  //         err: 'Custom fee cannot be greater than the default low priority fee',
  //       })
  //     );
  //     return;
  //   }

  //   const recipients: [
  //     {
  //       address: string;
  //       amount: number;
  //     }
  //   ] = yield call(processRecipients, accountShell);
  //   const recipientToBeModified = recipients[recipients.length - 1];

  //   // deduct the previous(default low) fee and add the custom fee
  //   const customFee = idx(
  //     sendingState,
  //     (_) => _.customPriorityST1.carryOver.customTxPrerequisites.fee
  //   );
  //   if (customFee) recipientToBeModified.amount += customFee; // reusing custom-fee feature
  //   else recipientToBeModified.amount += txPrerequisites[TxPriority.LOW].fee;
  //   recipientToBeModified.amount -= fee;
  //   recipients[recipients.length - 1] = recipientToBeModified;

  //   outputs.forEach((output) => {
  //     if (output.address === recipientToBeModified.address)
  //       output.value = recipientToBeModified.amount;
  //   });

  //   selectedRecipients[selectedRecipients.length - 1].amount = recipientToBeModified.amount;
  //   yield put(
  //     customSendMaxUpdated({
  //       recipients: selectedRecipients,
  //     })
  //   );
  // }

  const customTxPrerequisites = WalletOperations.prepareCustomTransactionPrerequisites(
    wallet,
    outputs,
    parseInt(feePerByte)
  );

  if (customTxPrerequisites.inputs) {
    customTxPrerequisites.estimatedBlocks = parseInt(customEstimatedBlocks);
    yield put(
      customFeeCalculated({
        successful: true,
        carryOver: {
          customTxPrerequisites,
        },
        err: null,
      })
    );
  } else {
    let totalAmount = 0;
    outputs.forEach((output) => {
      totalAmount += output.value;
    });
    yield put(
      customFeeCalculated({
        successful: false,
        carryOver: {
          customTxPrerequisites: null,
        },
        err: `Insufficient balance to pay: amount ${totalAmount} + fee(${customTxPrerequisites.fee}) at ${feePerByte} sats/byte`,
      })
    );
  }
}

export const calculateCustomFeeWatcher = createWatcher(calculateCustomFee, CALCULATE_CUSTOM_FEE);
