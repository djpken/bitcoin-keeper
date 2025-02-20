import { RealmSchema } from 'src/storage/realm/enum';
import { Vault } from 'src/core/wallets/interfaces/vault';
import { getJSONFromRealmObject } from 'src/storage/realm/utils';
import { VaultType } from 'src/core/wallets/enums';
import { useQuery } from '@realm/react';

const useCollaborativeWallet = (walletId?: string) => {
  const queryFilter = walletId
    ? `type == "${VaultType.COLLABORATIVE}" && collaborativeWalletId == "${walletId}"`
    : `type == "${VaultType.COLLABORATIVE}"`;

  const collaborativeWallets: Vault[] = useQuery(RealmSchema.Vault).filtered(queryFilter);

  if (!collaborativeWallets || !collaborativeWallets.length) {
    if (!walletId) {
      return { collaborativeWallets: [] };
    }
    return { collaborativeWallet: null };
  }

  if (!walletId) {
    return {
      collaborativeWallets: collaborativeWallets.map(getJSONFromRealmObject) as Vault[],
    };
  }

  return {
    collaborativeWallet: collaborativeWallets.map(getJSONFromRealmObject)[0] as Vault,
  };
};

export default useCollaborativeWallet;
