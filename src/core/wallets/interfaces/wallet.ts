import { DerivationConfig } from 'src/store/sagas/wallets';
import { Balances, BIP85Config, UTXO, Transaction } from '.';
import { NetworkType, WalletType, VisibilityType, EntityKind, ScriptTypes } from '../enums';

export interface WalletImportDetails {
  // importing via mnemonic
  mnemonic?: string;

  // importing via xpriv/xpub
  // extendedKey?: string;

  derivationConfig: DerivationConfig;
}

export interface WalletDerivationDetails {
  instanceNum: number; // instance number of this particular walletType
  mnemonic: string; // mnemonic of the wallet
  bip85Config?: BIP85Config; // bip85 configuration leading to the derivation path for the corresponding entropy
  xDerivationPath: string; // derivation path of the extended keys belonging to this wallet
}

export interface WalletPresentationData {
  name: string; // name of the wallet
  description: string; // description of the wallet
  visibility: VisibilityType; // visibility of the wallet
  shell: number; // shell id
}

export interface TransferPolicy {
  id: string;
  threshold: number;
}

export interface WhirlpoolWalletDetails {
  walletId: string; // wallet id for the premix|postmix|badbank
  walletType: WalletType;
}
export interface WhirlpoolConfig {
  whirlpoolWalletDetails: WhirlpoolWalletDetails[]; // deatils for whirlpool wallets
}

export interface AddressCache {
  external: {};
  internal: {};
}

export interface WalletSpecs {
  xpub: string | null; // wallet's xpub
  xpriv?: string | null; // wallet's xpriv(not available for read-only wallets)
  nextFreeAddressIndex: number; // external-chain free address marker
  nextFreeChangeAddressIndex: number; // internal-chain free address marker
  receivingAddress?: string; // current receiving address(external chain)
  addresses?: AddressCache; // cached addresses
  confirmedUTXOs: UTXO[]; // utxo set available for use
  unconfirmedUTXOs: UTXO[]; // utxos to arrive
  balances: Balances; // confirmed/unconfirmed balances
  transactions: Transaction[]; // transactions belonging to this wallet
  txNote: { [txId: string]: string }; // transaction note
  hasNewUpdates: boolean; // spec vars have a new update?
  lastSynched: number; // wallet's last sync timestamp
}

export interface CollaborativeWalletDetails {
  descriptor: string; // descriptor for the collaborative wallet
}

export interface Wallet {
  id: string; // wallet identifier(derived from xpub)
  entityKind: EntityKind; // Wallet vs Vault identifier
  type: WalletType; // type of wallet
  networkType: NetworkType; // testnet/mainnet
  isUsable: boolean; // true if wallet is usable
  derivationDetails?: WalletDerivationDetails;
  presentationData: WalletPresentationData;
  specs: WalletSpecs;
  scriptType: ScriptTypes;
  transferPolicy?: TransferPolicy;
  whirlpoolConfig?: WhirlpoolConfig;
  depositWalletId?: string; // this for pre-mix,post-mix,bad-bank to point to the deposit wallet.
  collaborativeWalletDetails: CollaborativeWalletDetails;
}

export interface TriggerPolicy {
  id: string;
  date: string;
  specifications: {};
  version: string;
}
