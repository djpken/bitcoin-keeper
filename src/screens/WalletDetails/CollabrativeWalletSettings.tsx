import React from 'react';
import { Box, ScrollView } from 'native-base';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import KeeperHeader from 'src/components/KeeperHeader';
import { wp, hp } from 'src/constants/responsive';
import Note from 'src/components/Note/Note';
import { SignerType } from 'src/core/wallets/enums';
import { signCosignerPSBT } from 'src/core/wallets/factories/WalletFactory';
import useWallets from 'src/hooks/useWallets';
import { Vault } from 'src/core/wallets/interfaces/vault';
import { genrateOutputDescriptors } from 'src/core/utils';
import { StyleSheet } from 'react-native';
import useToastMessage from 'src/hooks/useToastMessage';
import OptionCard from 'src/components/OptionCard';
import ScreenWrapper from 'src/components/ScreenWrapper';

function CollabrativeWalletSettings() {
  const route = useRoute();
  const { wallet: collaborativeWallet } = route.params as { wallet: Vault };
  const navigation = useNavigation();
  const wallet = useWallets({ walletIds: [collaborativeWallet.collaborativeWalletId] }).wallets[0];
  const descriptorString = genrateOutputDescriptors(collaborativeWallet);
  const { showToast } = useToastMessage();

  const signPSBT = (serializedPSBT, resetQR) => {
    try {
      const signedSerialisedPSBT = signCosignerPSBT(wallet, serializedPSBT);
      navigation.dispatch(
        CommonActions.navigate({
          name: 'ShowQR',
          params: {
            data: signedSerialisedPSBT,
            encodeToBytes: false,
            title: 'Signed PSBT',
            subtitle: 'Please scan until all the QR data has been retrieved',
            type: SignerType.KEEPER,
          },
        })
      );
    } catch (e) {
      resetQR();
      showToast('Please scan a valid PSBT', null, 3000, true);
    }
  };

  return (
    <ScreenWrapper>
      <KeeperHeader
        title="Collaborative Wallet Settings"
        subtitle={collaborativeWallet.presentationData.description}
      />

      <ScrollView
        contentContainerStyle={styles.optionsListContainer}
        showsVerticalScrollIndicator={false}
      >
        <OptionCard
          title="View co-signer Details"
          description="View co-signer Details"
          callback={() => {
            navigation.dispatch(CommonActions.navigate('CosignerDetails', { wallet }));
          }}
        />
        <OptionCard
          title="Sign a PSBT"
          description="Sign a transaction"
          callback={() => {
            navigation.dispatch(
              CommonActions.navigate({
                name: 'ScanQR',
                params: {
                  title: `Scan PSBT to Sign`,
                  subtitle: 'Please scan until all the QR data has been retrieved',
                  onQrScan: signPSBT,
                  type: SignerType.KEEPER,
                },
              })
            );
          }}
        />
        <OptionCard
          title="Exporting Output Descriptor/ BSMS"
          description="To recreate collaborative wallet"
          callback={() => {
            navigation.dispatch(
              CommonActions.navigate('GenerateVaultDescriptor', { descriptorString })
            );
          }}
        />
      </ScrollView>
      <Box style={styles.note} backgroundColor="light.secondaryBackground">
        <Note
          title="Note"
          subtitle="Keeper supports ONE collaborative wallet per hot wallet only. So if you import another Output Descriptor, you will see a new Collaborative Wallet"
          subtitleColor="GreyText"
        />
      </Box>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  note: {
    marginHorizontal: '5%',
  },
  walletCardContainer: {
    borderRadius: hp(20),
    width: wp(320),
    paddingHorizontal: 5,
    paddingVertical: 20,
    position: 'relative',
    marginLeft: -wp(20),
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp(10),
  },
  walletDetailsWrapper: {
    width: wp(155),
  },
  walletName: {
    letterSpacing: 0.28,
    fontSize: 15,
  },
  walletDescription: {
    letterSpacing: 0.24,
    fontSize: 13,
  },
  walletBalance: {
    letterSpacing: 1.2,
    fontSize: 23,
    padding: 5,
  },
  optionsListContainer: {
    alignItems: 'center',
    marginTop: hp(35),
    height: hp(425),
  },
  optionContainer: {
    marginTop: hp(20),
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  optionTitle: {
    fontSize: 14,
    letterSpacing: 1.12,
  },
  optionSubtitle: {
    fontSize: 12,
    letterSpacing: 0.6,
    width: '90%',
  },
});
export default CollabrativeWalletSettings;
