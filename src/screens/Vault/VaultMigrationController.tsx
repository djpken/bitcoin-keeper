import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { TxPriority, VaultType } from 'src/core/wallets/enums';
import { VaultScheme, VaultSigner } from 'src/core/wallets/interfaces/vault';
import { addNewVault, finaliseVaultMigration, migrateVault } from 'src/store/sagaActions/vaults';
import { useAppSelector } from 'src/store/hooks';
import { clearSigningDevice } from 'src/store/reducers/vaults';
import { TransferType } from 'src/models/enums/TransferType';
import ToastErrorIcon from 'src/assets/images/toast_error.svg';
import { NewVaultInfo } from 'src/store/sagas/wallets';
import { useDispatch } from 'react-redux';
import { captureError } from 'src/services/sentry';
import useVault from 'src/hooks/useVault';
import WalletOperations from 'src/core/wallets/operations';
import { UNVERIFYING_SIGNERS } from 'src/hardware';
import { resetRealyVaultState } from 'src/store/reducers/bhr';
import useToastMessage from 'src/hooks/useToastMessage';
import { AverageTxFeesByNetwork } from 'src/core/wallets/interfaces';
import WalletUtilities from 'src/core/wallets/operations/utils';
import { sendPhasesReset } from 'src/store/reducers/send_and_receive';
import { sendPhaseOne } from 'src/store/sagaActions/send_and_receive';

function VaultMigrationController({
  vaultCreating,
  signersState,
  scheme,
  setCreating,
  name,
  description,
}: any) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { showToast } = useToastMessage();
  const { activeVault } = useVault();
  const temporaryVault = useAppSelector((state) => state.vault.intrimVault);
  const averageTxFees: AverageTxFeesByNetwork = useAppSelector(
    (state) => state.network.averageTxFees
  );
  const { confirmed, unconfirmed } = activeVault?.specs?.balances ?? {
    confirmed: 0,
    unconfirmed: 0,
  };
  const sendPhaseOneState = useAppSelector((state) => state.sendAndReceive.sendPhaseOne);
  const { relayVaultUpdate, relayVaultError, realyVaultErrorMessage } = useAppSelector(
    (state) => state.bhr
  );

  const [recipients, setRecepients] = useState<any[]>();

  useEffect(() => {
    if (vaultCreating) {
      initiateNewVault();
    }
  }, [vaultCreating]);

  useEffect(() => {
    if (relayVaultUpdate && activeVault) {
      const navigationState = {
        index: 1,
        routes: [
          { name: 'Home' },
          { name: 'VaultDetails', params: { vaultTransferSuccessful: true } },
        ],
      };
      navigation.dispatch(CommonActions.reset(navigationState));
      dispatch(resetRealyVaultState());
      dispatch(clearSigningDevice());
      setCreating(false);
    }

    if (relayVaultError) {
      showToast(`Vault Creation Failed ${realyVaultErrorMessage}`, <ToastErrorIcon />);
      dispatch(resetRealyVaultState());
      setCreating(false);
    }
  }, [relayVaultUpdate, relayVaultError]);

  useEffect(() => {
    if (temporaryVault) {
      createNewVault();
    }
    return () => {
      dispatch(sendPhasesReset());
    };
  }, [temporaryVault]);

  useEffect(() => {
    if (sendPhaseOneState.isSuccessful && temporaryVault) {
      navigation.dispatch(
        CommonActions.navigate('SendConfirmation', {
          sender: activeVault,
          recipients,
          transferType: TransferType.VAULT_TO_VAULT,
        })
      );
    } else if (sendPhaseOneState.hasFailed) {
      if (sendPhaseOneState.failedErrorMessage === 'Insufficient balance')
        showToast('You have insufficient balance at this time.', <ToastErrorIcon />);
      else showToast(sendPhaseOneState.failedErrorMessage, <ToastErrorIcon />);
    }
  }, [sendPhaseOneState]);

  const initiateSweep = () => {
    if (!unconfirmed) {
      const averageTxFeeByNetwork = averageTxFees[activeVault.networkType];
      const { feePerByte } = averageTxFeeByNetwork[TxPriority.LOW];
      const network = WalletUtilities.getNetworkByType(activeVault.networkType);
      const { fee: sendMaxFee } = WalletOperations.calculateSendMaxFee(
        activeVault,
        1,
        feePerByte,
        network
      );
      if (sendMaxFee && temporaryVault) {
        const maxBalance = confirmed - sendMaxFee;

        const receivingAddress = WalletOperations.getNextFreeAddress(temporaryVault);
        setRecepients([{ address: receivingAddress, amount: maxBalance }]);
        dispatch(
          sendPhaseOne({
            wallet: activeVault,
            recipients: [{ address: receivingAddress, amount: maxBalance }],
          })
        );
      }
    } else {
      showToast('You have unconfirmed balance, please try again in some time', <ToastErrorIcon />);
    }
  };

  const createNewVault = () => {
    const netBanalce = confirmed + unconfirmed;
    if (netBanalce === 0) {
      dispatch(finaliseVaultMigration(activeVault.id));
    } else {
      initiateSweep();
    }
  };

  const createVault = useCallback((signers: VaultSigner[], scheme: VaultScheme) => {
    try {
      const vaultInfo: NewVaultInfo = {
        vaultType: VaultType.DEFAULT,
        vaultScheme: scheme,
        vaultSigners: signers,
        vaultDetails: {
          name,
          description,
        },
      };
      dispatch(addNewVault({ newVaultInfo: vaultInfo }));
      return vaultInfo;
    } catch (err) {
      captureError(err);
      return false;
    }
  }, []);

  const sanitizeSigners = () =>
    signersState.map((signer: VaultSigner) => {
      if (
        !signer.isMock &&
        scheme.n !== 1 &&
        !UNVERIFYING_SIGNERS.includes(signer.type) &&
        signer.registered
      ) {
        return { ...signer, registered: false };
      }
      return signer;
    });

  const initiateNewVault = () => {
    if (activeVault) {
      if (unconfirmed) {
        showToast(
          'You have unconfirmed balance, please try again in some time',
          <ToastErrorIcon />,
          4000
        );
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'Home' },
              {
                name: 'VaultDetails',
                params: { autoRefresh: true },
              },
            ],
          })
        );
        return;
      }
      const freshSignersState = sanitizeSigners();
      const vaultInfo: NewVaultInfo = {
        vaultType: VaultType.DEFAULT,
        vaultScheme: scheme,
        vaultSigners: freshSignersState,
        vaultDetails: {
          name: 'Vault',
          description: 'Secure your sats',
        },
      };
      dispatch(migrateVault(vaultInfo, activeVault.shellId));
    } else {
      createVault(signersState, scheme);
    }
  };
  return null;
}

export default VaultMigrationController;
