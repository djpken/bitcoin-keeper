import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { Box, Text, View } from 'native-base';
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';

import AppClient from 'src/hardware/ledger';
import KeeperModal from 'src/components/KeeperModal';
import { LocalizationContext } from 'src/common/content/LocContext';
import { SignerType } from 'src/core/wallets/enums';
import { VaultSigner } from 'src/core/wallets/interfaces/vault';
import WalletUtilities from 'src/core/wallets/operations/utils';
import { addSigningDevice } from 'src/store/sagaActions/vaults';
import { captureError } from 'src/core/services/sentry';
import config from 'src/core/config';
import useBLE from 'src/hooks/useLedger';
import { useDispatch } from 'react-redux';
import { wp } from 'src/common/data/responsiveness/responsive';

const AddLedger = ({}) => {
  const {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    disconnectFromDevice,
    transport,
    isScanning,
  } = useBLE();

  const scanForDevices = () => {
    requestPermissions((isGranted) => {
      if (isGranted) {
        scanForPeripherals();
      }
    });
  };
  const [visible, setVisible] = useState(true);
  const { translations } = useContext(LocalizationContext);
  const ledger = translations['ledger'];
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    open();
    return () => {
      disconnectFromDevice();
    };
  }, []);

  const LedgerSetupContent = () => {
    useEffect(() => {
      scanForDevices();
    }, []);
    return (
      <View>
        <Box ml={wp(21)}>
          {isScanning ? <ActivityIndicator /> : null}
          {allDevices.map((device) => {
            return (
              <TouchableOpacity style={styles.deviceItem} onPress={() => connectToDevice(device)}>
                <Text style={styles.deviceName}>{device.name}</Text>
              </TouchableOpacity>
            );
          })}
        </Box>
        <Box marginTop={'4'}>
          <Text color={'#073B36'} fontSize={13} fontFamily={'body'} fontWeight={'100'} p={1}>
            {`Please stay on the BTC app before connecting to the deivce`}
          </Text>
        </Box>
      </View>
    );
  };

  const fetchAddress = async () => {
    try {
      const app = new AppClient(transport);
      const path = "m/48'/1'/0'/1'"; // m / purpose' / coin_type' / account' / script_type' / change / address_index bip-48
      const xpub = await app.getExtendedPubkey(path);
      const masterfp = await app.getMasterFingerprint();
      const networkType = config.NETWORK_TYPE;
      const network = WalletUtilities.getNetworkByType(networkType);
      const signer: VaultSigner = {
        signerId: WalletUtilities.getFingerprintFromExtendedKey(xpub, network),
        type: SignerType.LEDGER,
        signerName: 'Nano X',
        xpub,
        xpubInfo: {
          derivationPath: path,
          xfp: masterfp,
        },
        lastHealthCheck: new Date(),
        addedOn: new Date(),
      };
      dispatch(addSigningDevice(signer));
      navigation.dispatch(CommonActions.navigate('AddSigningDevice'));
    } catch (error) {
      captureError(error);
      Alert.alert(error.toString());
    }
  };
  useEffect(() => {
    if (transport) {
      fetchAddress();
    }
  }, [transport]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!transport ? (
        <KeeperModal
          visible={visible}
          close={close}
          title={ledger.ScanningBT}
          subTitle={ledger.KeepLedgerReady}
          modalBackground={['#F7F2EC', '#F7F2EC']}
          buttonBackground={['#00836A', '#073E39']}
          textColor={'#041513'}
          Content={LedgerSetupContent}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  deviceItem: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deviceName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AddLedger;
