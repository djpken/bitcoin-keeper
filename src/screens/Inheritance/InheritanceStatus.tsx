import React, { useEffect, useState } from 'react';
import { Box, ScrollView, useColorMode } from 'native-base';
import { StyleSheet } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Share from 'react-native-share';
import ScreenWrapper from 'src/components/ScreenWrapper';
import {
  setInheritance,
  // setKeySecurityTipsPath,
  // setLetterToAttornyPath,
  // setRecoveryInstructionPath,
} from 'src/store/reducers/settings';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import SafeguardingTips from 'src/assets/images/SafeguardingTips.svg';
import SetupIK from 'src/assets/images/SetupIK.svg';
import Letter from 'src/assets/images/LETTER.svg';
import Recovery from 'src/assets/images/recovery.svg';
import ToastErrorIcon from 'src/assets/images/toast_error.svg';
import TickIcon from 'src/assets/images/icon_tick.svg';
import Text from 'src/components/KeeperText';
// import Note from 'src/components/Note/Note';
import { hp, windowHeight, wp } from 'src/constants/responsive';
import useToastMessage from 'src/hooks/useToastMessage';
import useVault from 'src/hooks/useVault';
import { SignerType } from 'src/core/wallets/enums';
import GenerateRecoveryInstrPDF from 'src/utils/GenerateRecoveryInstrPDF';
import { genrateOutputDescriptors } from 'src/core/utils';
import GenerateSecurityTipsPDF from 'src/utils/GenerateSecurityTipsPDF';
import GenerateLetterToAtternyPDF from 'src/utils/GenerateLetterToAtternyPDF';
import IKSetupSuccessModal from './components/IKSetupSuccessModal';
import InheritanceDownloadView from './components/InheritanceDownloadView';
import InheritanceSupportView from './components/InheritanceSupportView';
import KeeperHeader from 'src/components/KeeperHeader';

function InheritanceStatus() {
  const { colorMode } = useColorMode();
  const { showToast } = useToastMessage();
  const navigtaion = useNavigation();
  const dispatch = useAppDispatch();
  // const { keySecurityTips, letterToAttorny, recoveryInstruction } = useAppSelector(
  //   (state) => state.settings
  // );
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleErrorView] = useState(false);

  const { activeVault } = useVault();
  const fingerPrints = activeVault.signers.map((signer) => signer.masterFingerprint);

  const descriptorString = genrateOutputDescriptors(activeVault);
  const [isSetupDone, setIsSetupDone] = useState(false);

  useEffect(() => {
    if (activeVault && activeVault.signers) {
      const [ikSigner] = activeVault.signers.filter(
        (signer) => signer.type === SignerType.INHERITANCEKEY
      );
      if (ikSigner) setIsSetupDone(true);
      else setIsSetupDone(false);
    }
  }, [activeVault]);

  return (
    <ScreenWrapper backgroundcolor={`${colorMode}.primaryBackground`}>
      <KeeperHeader
        learnMore
        learnMorePressed={() => {
          dispatch(setInheritance(true));
        }}
      />
      <InheritanceSupportView
        title="Inheritance Support"
        subtitle="Keeper provides you with the tips and tools you need to include the Vault in your estate planning"
      />
      <ScrollView style={styles.scrollViewWrapper} showsVerticalScrollIndicator={false}>
        <Box style={styles.sectionTitleWrapper}>
          <Text style={styles.sectionTitle}>Tools</Text>
        </Box>
        <InheritanceDownloadView
          icon={<SetupIK />}
          title="Setup Inheritance Key"
          subTitle="Add an assisted key to create a 3 of 6 Vault"
          isSetupDone={isSetupDone}
          onPress={() => {
            if (isSetupDone) {
              showToast('You have successfully added the Inheritance Key.', <TickIcon />);
              return;
            }
            navigtaion.dispatch(
              CommonActions.navigate({
                name: 'AddSigningDevice',
                merge: true,
                params: { isInheritance: true },
              })
            );
          }}
        />
        <Box style={styles.sectionTitleWrapper}>
          <Text style={styles.sectionTitle}>Tips</Text>
        </Box>
        <InheritanceDownloadView
          icon={<SafeguardingTips />}
          title="Key Security Tips"
          subTitle="How to store your keys securely"
          previewPDF={() => {
            GenerateSecurityTipsPDF().then((res) => {
              if (res) {
                navigtaion.navigate('PreviewPDF', { source: res });
              }
            });
          }}
          isDownload
        />
        {/* Error view - Need to add condition for this */}
        {visibleErrorView && (
          <Box style={styles.signingDevicesView}>
            <Text style={styles.signingDevicesText}>Signing Devices have been changed&nbsp;</Text>
            <ToastErrorIcon />
          </Box>
        )}
        <Box style={styles.sectionTitleWrapper}>
          <Text style={styles.sectionTitle}>Documents</Text>
        </Box>
        <InheritanceDownloadView
          icon={<Letter />}
          title="Letter to the Attorney"
          subTitle="A partly filled pdf template"
          previewPDF={() => {
            GenerateLetterToAtternyPDF(fingerPrints).then((res) => {
              if (res) {
                navigtaion.navigate('PreviewPDF', { source: res });
              }
            });
          }}
          isDownload
        />
        <InheritanceDownloadView
          icon={<Recovery />}
          title="Recovery Instructions"
          subTitle="A document for the heir only"
          previewPDF={() => {
            GenerateRecoveryInstrPDF(activeVault.signers, descriptorString).then((res) => {
              if (res) {
                navigtaion.navigate('PreviewPDF', { source: res });
              }
            });
          }}
          isDownload
        />
      </ScrollView>
      {/* <Note
        title="Note"
        subtitle="Consult your estate planning company to ensure the documents provided here are suitable for your needs and are as per your jurisdiction"
        subtitleColor="GreyText"
      /> */}
      <IKSetupSuccessModal visible={visibleModal} closeModal={() => setVisibleModal(false)} />
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  signingDevicesView: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginTop: hp(20),
    right: 3,
  },
  scrollViewWrapper: {
    height: windowHeight > 800 ? '50%' : '40%',
  },
  sectionTitleWrapper: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    letterSpacing: 0.96,
  },
  signingDevicesText: {
    color: '#E07962',
    fontSize: 14,
  },
  note: {
    bottom: hp(5),
    justifyContent: 'center',
    width: wp(320),
  },
});
export default InheritanceStatus;
