/* eslint-disable react/no-unstable-nested-components */
import React, { useContext } from 'react';
import Text from 'src/components/KeeperText';
import { Box, useColorMode } from 'native-base';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { wp, hp, windowHeight } from 'src/constants/responsive';
import KeeperHeader from 'src/components/KeeperHeader';
import Note from 'src/components/Note/Note';
import KeeperModal from 'src/components/KeeperModal';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { setInheritance } from 'src/store/reducers/settings';
import Assert from 'src/assets/images/InheritanceSupportIllustration.svg';
import Vault from 'src/assets/images/vault.svg';
import Letter from 'src/assets/images/LETTER.svg';
import LetterIKS from 'src/assets/images/LETTER_IKS.svg';
import Recovery from 'src/assets/images/recovery.svg';
import Inheritance from 'src/assets/images/icon_inheritance.svg';
import ScreenWrapper from 'src/components/ScreenWrapper';
import openLink from 'src/utils/OpenLink';
import { SubscriptionTier } from 'src/models/enums/SubscriptionTier';
import usePlan from 'src/hooks/usePlan';
import { StyleSheet, TouchableOpacity } from 'react-native';
import useVault from 'src/hooks/useVault';
import GradientIcon from 'src/screens/WalletDetails/components/GradientIcon';
import { KEEPER_KNOWLEDGEBASE } from 'src/core/config';
import { LocalizationContext } from 'src/context/Localization/LocContext';

function SetupInheritance() {
  const { colorMode } = useColorMode();
  const navigtaion = useNavigation();
  const { translations } = useContext(LocalizationContext);
  const { inheritence, vault: vaultTranslation, common } = translations;
  const dispatch = useAppDispatch();
  const introModal = useAppSelector((state) => state.settings.inheritanceModal);
  const { plan } = usePlan();
  const { activeVault } = useVault();

  const shouldActivateInheritance = () =>
    plan === SubscriptionTier.L3.toUpperCase() &&
    activeVault &&
    activeVault.scheme.m === 3 &&
    (activeVault.scheme.n === 5 || activeVault.scheme.n === 6);

  const inheritanceData = [
    {
      title: 'Safeguarding Tips',
      subTitle: 'For yourself',
      description:
        'Consists of tips on things to consider while storing your signing devices for the purpose of inheritance (when it will be needed by someone else)',
      Icon: Vault,
    },
    {
      title: 'Setup Inheritance Key',
      subTitle: 'Keeper will have one of your Keys',
      description:
        'This would transform your 3-of-5 Vault to a 3-of-6 with Keeper custodying one key.',
      Icon: LetterIKS,
    },
    {
      title: 'Letter to the Attorney',
      subTitle: 'For the estate management company',
      description:
        'A partly pre-filled pdf template uniquely identifying the Vault and ability to add the beneficiary details',
      Icon: Letter,
    },
    {
      title: 'Recovery Instructions',
      subTitle: 'For the heir or beneficiary',
      description:
        'A document that will help the beneficiary recover the Vault with or without the Keeper app',
      Icon: Recovery,
    },
  ];

  function InheritancePoint({ title, subTitle, description, Icon }) {
    return (
      <Box style={styles.modalContainer}>
        <Box style={styles.modalTopContainer}>
          <Icon />
          <Box style={{ marginLeft: wp(15) }}>
            <Text
              color={`${colorMode}.modalGreenContent`}
              numberOfLines={2}
              style={styles.modalTitle}
            >
              {title}
            </Text>
            <Text
              color={`${colorMode}.modalGreenContent`}
              numberOfLines={2}
              style={styles.modalSubtitle}
            >
              {subTitle}
            </Text>
          </Box>
        </Box>
        <Text color={`${colorMode}.modalGreenContent`} style={styles.modalDesc}>
          {description}
        </Text>
      </Box>
    );
  }

  function InheritanceContent() {
    return (
      <Box
        style={{
          width: wp(280),
        }}
      >
        {inheritanceData.map((item) => (
          <InheritancePoint
            key={item.title}
            title={item.title}
            description={item.description}
            subTitle={item.subTitle}
            Icon={item.Icon}
          />
        ))}
      </Box>
    );
  }

  const proceedCallback = () => {
    dispatch(setInheritance(false));
    if (shouldActivateInheritance()) navigtaion.navigate('InheritanceStatus');
  };

  const toSetupInheritance = () => {
    if (shouldActivateInheritance()) navigtaion.navigate('InheritanceStatus');
    else if (plan !== SubscriptionTier.L3.toUpperCase()) navigtaion.navigate('ChoosePlan');
    else if (!activeVault)
      navigtaion.dispatch(
        CommonActions.navigate({
          name: 'AddSigningDevice',
          merge: true,
          params: { scheme: { m: 3, n: 5 } },
        })
      );
    else if (activeVault.scheme.m !== 3 || activeVault.scheme.n !== 5)
      navigtaion.dispatch(CommonActions.navigate({ name: 'VaultSetup' }));
  };

  return (
    <ScreenWrapper backgroundcolor={`${colorMode}.primaryBackground`}>
      <KeeperHeader
        learnMore
        learnMorePressed={() => {
          dispatch(setInheritance(true));
        }}
      />
      <Box style={styles.topContainer}>
        <GradientIcon Icon={Inheritance} height={windowHeight > 600 ? 50 : 20} />
        <Text
          color={`${colorMode}.primaryText`}
          style={styles.title}
          testID="text_InheritanceSupport"
        >
          {inheritence.inheritanceSupport}
        </Text>
        <Text
          color={`${colorMode}.textColor2`}
          style={styles.subtitle}
          testID="text_InheritanceSupportSubtitle"
        >
          {inheritence.inheritanceSupportSubTitle}
        </Text>
      </Box>
      <Box style={styles.bottomContainer} testID="view_InheritanceSupportAssert">
        <Assert />
        <Text numberOfLines={2} light style={styles.message} color={`${colorMode}.textColor2`}>
          {shouldActivateInheritance()
            ? vaultTranslation.manageInheritance
            : `This can be activated once you are on ${SubscriptionTier.L3} and create a 3 of 5 Vault to add this key`}
        </Text>
        <Box style={{ marginTop: windowHeight > 700 ? hp(50) : hp(20) }} testID="btn_ISContinue">
          <TouchableOpacity testID="btn_inheritanceBtn" onPress={() => toSetupInheritance()}>
            <Box
              borderColor={`${colorMode}.learnMoreBorder`}
              backgroundColor={`${colorMode}.lightAccent`}
              style={styles.upgradeNowContainer}
            >
              <Text color="light.learnMoreBorder" style={styles.upgradeNowText}>
                {shouldActivateInheritance() ? common.proceed : common.upgradeNow}
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
      <Note title={common.note} subtitle={inheritence.consultYourEstate} subtitleColor="GreyText" />
      <KeeperModal
        visible={introModal}
        close={() => {
          dispatch(setInheritance(false));
        }}
        title={vaultTranslation.Inheritance}
        subTitle={inheritence.secureBequeathBitcoin}
        modalBackground={`${colorMode}.modalGreenBackground`}
        textColor={`${colorMode}.modalGreenContent`}
        buttonText="Proceed"
        buttonTextColor={colorMode === 'light' ? `${colorMode}.greenText2` : `${colorMode}.white`}
        buttonBackground={`${colorMode}.modalWhiteButton`}
        buttonCallback={() => proceedCallback()}
        Content={InheritanceContent}
        DarkCloseIcon
        learnMore
        learnMoreCallback={() =>
          openLink(`${KEEPER_KNOWLEDGEBASE}knowledge-base/how-to-setup-inheritance-in-keeper-app/`)
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  note: {
    position: 'absolute',
    bottom: hp(20),
    paddingHorizontal: 25,
    justifyContent: 'center',
    width: wp(340),
  },
  message: {
    opacity: 0.85,
    fontSize: 12,
    letterSpacing: 0.6,
    marginTop: windowHeight > 600 ? hp(36) : 0,
    width: windowHeight > 600 ? '95%' : '100%',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: windowHeight > 600 ? hp(30) : hp(5),
    alignItems: 'center',
    flex: 1,
  },
  topContainer: {
    marginTop: windowHeight > 600 ? hp(25) : 0,
    alignItems: 'center',
    paddingHorizontal: 1,
  },
  title: {
    fontSize: 16,
    letterSpacing: 0.96,
    marginTop: windowHeight > 600 ? hp(10) : hp(20),
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    width: windowHeight > 600 ? wp(270) : wp(300),
    marginTop: windowHeight > 600 ? hp(4) : 0,
    fontSize: 12,
    letterSpacing: 0.8,
  },

  modalContainer: {
    // marginBottom: hp(25),
  },
  modalTitle: {
    fontSize: windowHeight > 600 ? 15 : 10,
  },
  modalSubtitle: {
    fontSize: windowHeight > 600 ? 12 : 10,
    opacity: 0.7,
  },
  modalDesc: {
    marginVertical: windowHeight > 600 ? hp(8) : hp(2),
    letterSpacing: 0.65,
    width: windowHeight > 600 ? wp(280) : wp(300),
    alignItems: 'center',
    fontSize: windowHeight > 600 ? 14 : 10,
  },
  modalTopContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradientIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeNowContainer: {
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeNowText: {
    fontSize: 12,
    letterSpacing: 0.6,
    alignSelf: 'center',
  },
});
export default SetupInheritance;
