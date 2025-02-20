/* eslint-disable react-hooks/rules-of-hooks */
import { Alert } from 'react-native';
import Text from 'src/components/KeeperText';
import { Box } from 'native-base';
import DeleteIcon from 'src/assets/images/deleteBlack.svg';
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { hp, wp } from 'src/constants/responsive';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import CVVInputsView from 'src/components/HealthCheck/CVVInputsView';
import ColdCardSVG from 'src/assets/images/ColdCardSetup.svg';
import CustomGreenButton from 'src/components/CustomButton/CustomGreenButton';
import JadeSetup from 'src/assets/images/illustration_jade.svg';
import KeeperSetup from 'src/assets/images/illustration_ksd.svg';
import KeeperModal from 'src/components/KeeperModal';
import KeyPadView from 'src/components/AppNumPad/KeyPadView';
import KeystoneSetup from 'src/assets/images/keystone_illustration.svg';
import LoginMethod from 'src/models/enums/LoginMethod';
import PassportSVG from 'src/assets/images/illustration_passport.svg';
import ReactNativeBiometrics from 'react-native-biometrics';
import SeedSignerSetup from 'src/assets/images/seedsigner_setup.svg';
import { SignerType } from 'src/core/wallets/enums';
import TapsignerSetupSVG from 'src/assets/images/TapsignerSetup.svg';
import { credsAuthenticated } from 'src/store/reducers/login';
import { hash512 } from 'src/services/operations/encryption';
import config from 'src/core/config';
import BitoxImage from 'src/assets/images/bitboxSetup.svg';
import OtherSDImage from 'src/assets/images/illustration_othersd.svg';
import TrezorSetup from 'src/assets/images/trezor_setup.svg';
import LedgerImage from 'src/assets/images/ledger_image.svg';
import { VaultSigner } from 'src/core/wallets/interfaces/vault';
import { BulletPoint } from '../Vault/HardwareModalMap';
import * as SecureStore from 'src/storage/secure-store';
import Buttons from 'src/components/Buttons';
import useAsync from 'src/hooks/useAsync';

const RNBiometrics = new ReactNativeBiometrics();

function ColdCardContent({ register, isMultisig }: { register: boolean; isMultisig: boolean }) {
  let message = '';

  if (register) {
    message = `\u2022 Since this is the first time you are signing with this device, the Mk4 requires for us to register the multisig wallet data before it can sign transactions.`;
  } else if (isMultisig) {
    message = `\u2022 Make sure the multisig wallet is registered with the Mk4 before signing the transaction`;
  }

  return (
    <Box alignItems="center">
      <ColdCardSVG />
      <Box marginTop={2}>
        <Text color="light.greenText" fontSize={13} letterSpacing={0.65}>
          {message}
        </Text>
        <Text color="light.greenText" fontSize={13} letterSpacing={0.65}>
          {register
            ? ``
            : `\u2022 On the Mk4 main menu, choose the 'Ready to sign' option and choose the nfc option.`}
        </Text>
      </Box>
    </Box>
  );
}

function PassportContent({ isMultisig }: { isMultisig: boolean }) {
  return (
    <Box alignItems="center">
      <PassportSVG />
      <Box marginTop={2}>
        <Text color="light.greenText" fontSize={13} letterSpacing={0.65}>
          {`\u2022 Make sure ${isMultisig ? 'the multisig wallet is registered with the Passport and ' : ''
            }the right bitcoin network is set before signing the transaction`}
        </Text>
        <Text color="light.greenText" fontSize={13} letterSpacing={0.65}>
          {`\u2022 On the Passport main menu, choose the 'Sign with QR Code' option.`}
        </Text>
      </Box>
    </Box>
  );
}

function SeedSignerContent({ isMultisig }: { isMultisig: boolean }) {
  return (
    <Box alignItems="center">
      <SeedSignerSetup />
      <Box marginTop={2}>
        {isMultisig ? (
          <Text color="light.greenText" fontSize={13} letterSpacing={0.65}>
            {`\u2022 The change address verification step (wallet registration) with SeedSigner shows up at the time of PSBT verification.`}
          </Text>
        ) : null}
        <Text color="light.greenText" fontSize={13} letterSpacing={0.65}>
          {`\u2022 On the SeedSigner main menu, choose the 'Scan' option and wait for the QR to be scanned.`}
        </Text>
      </Box>
    </Box>
  );
}

function KeystoneContent({ isMultisig }: { isMultisig: boolean }) {
  return (
    <Box alignItems="center">
      <KeystoneSetup />
      <Box marginTop={2}>
        <Text color="light.greenText" fontSize={13} letterSpacing={0.65}>
          {`\u2022 Make sure ${isMultisig ? 'the multisig wallet is registered with the Keystone and ' : ''
            }the right bitcoin network is set before signing the transaction`}
        </Text>
        <Text color="light.greenText" fontSize={13} letterSpacing={0.65}>
          {`\u2022 On the Keystone ${isMultisig ? 'multisig menu' : 'Generic Wallet section'
            }, press the scan icon on the top bar and wait for the QR to be scanned.`}
        </Text>
      </Box>
    </Box>
  );
}

function JadeContent() {
  return (
    <Box alignItems="center">
      <JadeSetup />
      <Box marginTop={2}>
        <Text color="light.greenText" fontSize={13} letterSpacing={0.65}>
          {`\u2022 On the Jade main menu, choose the 'Scan' option and wait for the QR to be scanned.`}
        </Text>
      </Box>
    </Box>
  );
}

function TrezorContent() {
  return (
    <Box alignItems="center">
      <TrezorSetup />
      <Box marginTop={2}>
        <Text color="light.greenText" fontSize={13} letterSpacing={0.65}>
          {`\u2022 The Keeper Harware Interface will exchange the signed/unsigned PSBT from/to the Keeper app and the signing device.`}
        </Text>
      </Box>
    </Box>
  );
}

function BitBox02Content() {
  return (
    <Box alignItems="center">
      <BitoxImage />
      <Box marginTop={2}>
        <Text color="light.greenText" fontSize={13} letterSpacing={0.65}>
          {`\u2022 The Keeper Harware Interface will exchange the signed/unsigned PSBT from/to the Keeper app and the signing device.`}
        </Text>
      </Box>
    </Box>
  );
}

function LedgerContent() {
  return (
    <Box alignItems="center">
      <LedgerImage />
      <Box marginTop={2}>
        <Text color="light.greenText" fontSize={13} letterSpacing={0.65}>
          {`\u2022 The Keeper Harware Interface will exchange the signed/unsigned PSBT from/to the Keeper app and the signing device.`}
        </Text>
      </Box>
    </Box>
  );
}

function OtherSDContent() {
  return (
    <Box alignItems="center">
      <OtherSDImage />
      <Box marginTop={2}>
        <Text color="light.greenText" fontSize={13} letterSpacing={0.65}>
          {`\u2022 Either scan or use the export option to transfer the PSBT to the signer.`}
        </Text>
      </Box>
    </Box>
  );
}
export function KeeperContent() {
  return (
    <Box alignItems="center">
      <KeeperSetup />
      <Box marginTop={2}>
        <Text color="light.greenText" fontSize={13} letterSpacing={0.65}>
          {`\u2022 Choose the wallet that was used as a co-signer and select signing PSBT option\n`}
        </Text>
      </Box>
    </Box>
  );
}

function TapsignerContent() {
  return (
    <>
      <TapsignerSetupSVG />
      <BulletPoint text="TAPSIGNER communicates with the app over NFC" />
      <BulletPoint text="You will need the CVC/ Pin on the back of the card" />
    </>
  );
}

function PasswordEnter({ signTransaction, setPasswordModal }) {
  const { pinHash } = useAppSelector((state) => state.storage);
  const loginMethod = useAppSelector((state) => state.settings.loginMethod);
  const appId = useAppSelector((state) => state.storage.appId);
  const dispatch = useAppDispatch();
  const { inProgress, start } = useAsync();

  const [password, setPassword] = useState('');

  useEffect(() => {
    biometricAuth();
    return () => {
      dispatch(credsAuthenticated(false));
    };
  }, []);

  const biometricAuth = async () => {
    if (loginMethod === LoginMethod.BIOMETRIC) {
      try {
        setPasswordModal(false);
        setTimeout(async () => {
          const { success, signature } = await RNBiometrics.createSignature({
            promptMessage: 'Authenticate',
            payload: appId,
            cancelButtonText: 'Use PIN',
          });
          if (success) {
            const res = await SecureStore.verifyBiometricAuth(signature, appId);
            if (res.success) {
              signTransaction();
            } else {
              Alert.alert('Invalid auth. Try again!');
            }
          }
        }, 200);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onPressNumber = (text) => {
    let tmpPasscode = password;
    if (password.length < 4) {
      if (text !== 'x') {
        tmpPasscode += text;
        setPassword(tmpPasscode);
      }
    }
    if (password && text === 'x') {
      setPassword(password.slice(0, -1));
    }
  };

  const onDeletePressed = () => setPassword(password.slice(0, password.length - 1));

  const primaryCallback = () =>
    start(async () => {
      const currentPinHash = hash512(password);
      if (currentPinHash === pinHash) {
        await signTransaction();
      } else Alert.alert('Incorrect password. Try again!');
    });

  return (
    <Box width={hp(280)}>
      <Box>
        <CVVInputsView
          passCode={password}
          passcodeFlag={false}
          backgroundColor
          textColor
          length={4}
        />
        <Text
          fontSize={13}
          letterSpacing={0.65}
          width={wp(290)}
          color="light.greenText"
          marginTop={2}
        />
        <Box mt={10} alignSelf="flex-end" mr={2}>
          <Buttons
            primaryCallback={primaryCallback}
            primaryText="Confirm"
            primaryLoading={inProgress}
          />
        </Box>
      </Box>
      <KeyPadView
        onPressNumber={onPressNumber}
        onDeletePressed={onDeletePressed}
        keyColor="light.primaryText"
        ClearIcon={<DeleteIcon />}
      />
    </Box>
  );
}

function OtpContent({ signTransaction }) {
  const [otp, setOtp] = useState('');
  const onPressNumber = (text) => {
    let tmpPasscode = otp;
    if (otp.length < 6) {
      if (text !== 'x') {
        tmpPasscode += text;
        setOtp(tmpPasscode);
      }
    }
    if (otp && text === 'x') {
      setOtp(otp.slice(0, -1));
    }
  };
  const onDeletePressed = () => {
    setOtp(otp.slice(0, otp.length - 1));
  };

  return (
    <Box width={hp(280)}>
      <Box>
        <CVVInputsView passCode={otp} passcodeFlag={false} backgroundColor textColor />
        <Text
          fontSize={13}
          letterSpacing={0.65}
          width={wp(290)}
          color="light.greenText"
          marginTop={2}
        >
          If you lose your authenticator app, use the other Signing Devices to reset the Signing
          Server
        </Text>
        <Box mt={10} alignSelf="flex-end" mr={2}>
          <Box>
            <CustomGreenButton
              onPress={() => {
                signTransaction({ signingServerOTP: otp });
              }}
              value="proceed"
            />
          </Box>
        </Box>
      </Box>
      <KeyPadView
        onPressNumber={onPressNumber}
        onDeletePressed={onDeletePressed}
        keyColor="light.primaryText"
        ClearIcon={<DeleteIcon />}
      />
    </Box>
  );
}

function SignerModals({
  activeSignerId,
  coldCardModal,
  tapsignerModal,
  ledgerModal,
  otpModal,
  passwordModal,
  passportModal,
  seedSignerModal,
  keystoneModal,
  jadeModal,
  keeperModal,
  trezorModal,
  bitbox02Modal,
  otherSDModal,
  setOtherSDModal,
  setTrezorModal,
  setBitbox02Modal,
  setJadeModal,
  setKeystoneModal,
  setSeedSignerModal,
  setPassportModal,
  setKeeperModal,
  setColdCardModal,
  setTapsignerModal,
  setLedgerModal,
  setPasswordModal,
  showOTPModal,
  signTransaction,
  textRef,
  signers,
  isMultisig,
  collaborativeWalletId,
}: {
  activeSignerId: string;
  coldCardModal: boolean;
  tapsignerModal: boolean;
  ledgerModal: boolean;
  otpModal: boolean;
  passwordModal: boolean;
  passportModal: boolean;
  seedSignerModal: boolean;
  keystoneModal: boolean;
  jadeModal: boolean;
  keeperModal: boolean;
  trezorModal: boolean;
  bitbox02Modal: boolean;
  otherSDModal: boolean;
  setOtherSDModal: any;
  setTrezorModal: any;
  setBitbox02Modal: any;
  setJadeModal: any;
  setKeystoneModal: any;
  setSeedSignerModal: any;
  setPassportModal: any;
  setKeeperModal: any;
  setColdCardModal: any;
  setTapsignerModal: any;
  setLedgerModal: any;
  setPasswordModal: any;
  showOTPModal: any;
  signTransaction: any;
  textRef: any;
  signers: VaultSigner[];
  isMultisig: boolean;
  collaborativeWalletId: string;
}) {
  const navigation = useNavigation();

  const navigateToQrSigning = (signer) => {
    setPassportModal(false);
    setSeedSignerModal(false);
    setKeeperModal(false);
    setOtherSDModal(false);
    setJadeModal(false);
    navigation.dispatch(
      CommonActions.navigate('SignWithQR', { signTransaction, signer, collaborativeWalletId })
    );
  };

  const navigateToChannelSigning = (signer) => {
    setTrezorModal(false);
    setBitbox02Modal(false);
    setLedgerModal(false);
    navigation.dispatch(
      CommonActions.navigate('SignWithChannel', { signTransaction, signer, collaborativeWalletId })
    );
  };
  return (
    <>
      {signers.map((signer) => {
        const currentSigner = signer.signerId === activeSignerId;
        if (signer.type === SignerType.TAPSIGNER) {
          const navigateToSignWithTapsigner = () => {
            setTapsignerModal(false);
            navigation.dispatch(
              CommonActions.navigate('SignWithTapsigner', { signTransaction, signer, textRef })
            );
          };
          return (
            <KeeperModal
              key={signer.signerId}
              visible={currentSigner && tapsignerModal}
              close={() => setTapsignerModal(false)}
              title="Keep your TAPSIGNER ready"
              subTitle="Keep your TAPSIGNER ready before proceeding"
              buttonText="Proceed"
              buttonCallback={navigateToSignWithTapsigner}
              Content={() => <TapsignerContent />}
            />
          );
        }
        if (signer.type === SignerType.COLDCARD) {
          const { registered } = signer;
          const navigateToSignWithColdCard = () => {
            setColdCardModal(false);
            navigation.dispatch(
              CommonActions.navigate('SignWithColdCard', { signTransaction, signer, isMultisig })
            );
          };
          const shouldRegister = !registered && isMultisig;
          return (
            <KeeperModal
              key={signer.signerId}
              visible={currentSigner && coldCardModal}
              close={() => setColdCardModal(false)}
              title={shouldRegister ? 'Register Coldcard' : 'Keep your Mk4 ready'}
              subTitle="Keep your Mk4 ready before proceeding"
              Content={() => <ColdCardContent register={shouldRegister} isMultisig={isMultisig} />}
              buttonText={shouldRegister ? 'Register' : 'Proceed'}
              buttonCallback={navigateToSignWithColdCard}
            />
          );
        }
        if (signer.type === SignerType.LEDGER) {
          return (
            <KeeperModal
              key={signer.signerId}
              visible={currentSigner && ledgerModal}
              close={() => {
                setLedgerModal(false);
              }}
              title="Keep Nano X Ready"
              subTitle={`Please visit ${config.KEEPER_HWI} on your Chrome browser to use the Keeper Hardware Interface to connect with Trezor.`}
              textColor="light.primaryText"
              Content={() => <LedgerContent />}
              buttonText="Proceed"
              buttonCallback={() => navigateToChannelSigning(signer)}
            />
          );
        }
        if (signer.type === SignerType.MOBILE_KEY) {
          return (
            <KeeperModal
              key={signer.signerId}
              visible={currentSigner && passwordModal}
              close={() => {
                setPasswordModal(false);
              }}
              title="Enter your password"
              subTitle=""
              textColor="light.primaryText"
              Content={() => <PasswordEnter signTransaction={signTransaction} />}
            />
          );
        }
        if (signer.type === SignerType.POLICY_SERVER) {
          return (
            <KeeperModal
              key={signer.signerId}
              visible={currentSigner && otpModal}
              close={() => {
                showOTPModal(false);
              }}
              title="Confirm OTP to sign transaction"
              subTitle="To sign using signing server key"
              textColor="light.primaryText"
              Content={() => <OtpContent signTransaction={signTransaction} />}
            />
          );
        }
        if (signer.type === SignerType.PASSPORT) {
          return (
            <KeeperModal
              key={signer.signerId}
              visible={currentSigner && passportModal}
              close={() => {
                setPassportModal(false);
              }}
              title="Keep Passport Ready"
              subTitle="Keep your Foundation Passport ready before proceeding"
              textColor="light.primaryText"
              Content={() => <PassportContent isMultisig={isMultisig} />}
              buttonText="Proceed"
              buttonCallback={() => navigateToQrSigning(signer)}
            />
          );
        }
        if (signer.type === SignerType.SEEDSIGNER) {
          return (
            <KeeperModal
              key={signer.signerId}
              visible={currentSigner && seedSignerModal}
              close={() => {
                setSeedSignerModal(false);
              }}
              title="Keep SeedSigner Ready"
              subTitle="Keep your SeedSigner ready before proceeding"
              textColor="light.primaryText"
              Content={() => <SeedSignerContent isMultisig={isMultisig} />}
              buttonText="Proceed"
              buttonCallback={() => navigateToQrSigning(signer)}
            />
          );
        }
        if (signer.type === SignerType.KEYSTONE) {
          return (
            <KeeperModal
              key={signer.signerId}
              visible={currentSigner && keystoneModal}
              close={() => {
                setKeystoneModal(false);
              }}
              title="Keep Keystone Ready"
              subTitle="Keep your Keystone ready before proceeding"
              textColor="light.primaryText"
              Content={() => <KeystoneContent isMultisig={isMultisig} />}
              buttonText="Proceed"
              buttonCallback={() => navigateToQrSigning(signer)}
            />
          );
        }
        if (signer.type === SignerType.JADE) {
          return (
            <KeeperModal
              key={signer.signerId}
              visible={currentSigner && jadeModal}
              close={() => {
                setJadeModal(false);
              }}
              title="Keep Jade Ready"
              subTitle="Keep your Jade ready before proceeding"
              textColor="light.primaryText"
              Content={() => <JadeContent />}
              buttonText="Proceed"
              buttonCallback={() => navigateToQrSigning(signer)}
            />
          );
        }
        if (signer.type === SignerType.TREZOR) {
          return (
            <KeeperModal
              key={signer.signerId}
              visible={currentSigner && trezorModal}
              close={() => {
                setTrezorModal(false);
              }}
              title="Keep Trezor Ready"
              subTitle={`Please visit ${config.KEEPER_HWI} on your Chrome browser to use the Keeper Hardware Interface to connect with Trezor.`}
              textColor="light.primaryText"
              Content={() => <TrezorContent />}
              buttonText="Proceed"
              buttonCallback={() => navigateToChannelSigning(signer)}
            />
          );
        }
        if (signer.type === SignerType.BITBOX02) {
          return (
            <KeeperModal
              key={signer.signerId}
              visible={currentSigner && bitbox02Modal}
              close={() => {
                setBitbox02Modal(false);
              }}
              title="Keep BitBox02 Ready"
              subTitle={`Please visit ${config.KEEPER_HWI} on your Chrome browser to use the Keeper Hardware Interface to connect with BitBox02.`}
              textColor="light.primaryText"
              Content={() => <BitBox02Content />}
              buttonText="Proceed"
              buttonCallback={() => navigateToChannelSigning(signer)}
            />
          );
        }
        if (signer.type === SignerType.OTHER_SD) {
          return (
            <KeeperModal
              key={signer.signerId}
              visible={currentSigner && otherSDModal}
              close={() => {
                setOtherSDModal(false);
              }}
              title="Keep the Signer Ready"
              subTitle="Keep your Signer ready before proceeding"
              textColor="light.primaryText"
              Content={() => <OtherSDContent />}
              buttonText="Proceed"
              buttonCallback={() => navigateToQrSigning(signer)}
            />
          );
        }
        if (signer.type === SignerType.KEEPER) {
          return (
            <KeeperModal
              key={signer.signerId}
              visible={currentSigner && keeperModal}
              close={() => {
                setKeeperModal(false);
              }}
              title="Keep your Device Ready"
              subTitle="Keep your Keeper Signing Device ready before proceeding"
              textColor="light.primaryText"
              Content={() => <KeeperContent />}
              buttonText="Proceed"
              buttonCallback={() => navigateToQrSigning(signer)}
            />
          );
        }
        return null;
      })}
    </>
  );
}

export default SignerModals;
