import React, { useEffect } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { View, Text } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScaledSheet } from 'react-native-size-matters';
import { ImageBackground, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';

import StatusBarComponent from 'src/components/StatusBarComponent';
import DevicesComponent from 'src/components/DevicesComponent';
import backgroundImage from 'src/assets/images/background.png';
import HomeCard from 'src/components/HomeCard';
import ScannerIcon from 'src/assets/images/svgs/scanner.svg';
import SettingIcon from 'src/assets/images/svgs/settings.svg';
import MobileIcon from 'src/assets/images/svgs/iphone_tile.svg';
import LaptopIcon from 'src/assets/images/svgs/laptop_tile.svg';
import ColdCardIcon from 'src/assets/images/svgs/coldcard_tile.svg';
import IPardIcon from 'src/assets/images/svgs/ipad_tile.svg';
import PdfIcon from 'src/assets/images/svgs/pdf_tile.svg';
import DiamondIcon from 'src/assets/images/svgs/elite.svg';
import AddNewIcon from 'src/assets/images/svgs/add_key.svg';

import SingleSigIcon from 'src/assets/images/svgs/single_sig.svg';
import BlueWalletIcon from 'src/assets/images/svgs/blue_wallet.svg';
import MultiSigIcon from 'src/assets/images/svgs/multi_sig.svg';
import SettingSheet from './Settings/SettingSheet';
import { setupWallet } from 'src/store/actions/storage';
import { loginWithHexa } from 'src/store/actions/accounts';
import { QR_TYPES } from './LoginScreen/constants';
import SecureHexa from 'src/components/SecureHexa';

const windowHeight = Dimensions.get('window').height;
const getResponsive = () => {
  if (windowHeight >= 850) {
    return {
      padingTop: 7,
      marginTop: 0,
      height: 35
    };
  } else if (windowHeight >= 750) {
    return {
      padingTop: 10,
      marginTop: -2,
      height: 38
    }
  } else if (windowHeight >= 650) {
    return {
      padingTop: 14,
      marginTop: -8,
      height: 42
    };
  } else {
    return {
      padingTop: 16,
      marginTop: -9,
      height: 44
    };
  }
}

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Arika’s',
    subtitle: 'iPhone 12',
    Childern: MobileIcon,
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Personal ',
    subtitle: 'iMac',
    Childern: LaptopIcon,
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Cold Card ',
    subtitle: 'Wallet',
    Childern: ColdCardIcon,
  },
  {
    id: '58694a0f-3da1-471f-bd96-14557671e29d72',
    title: 'Home',
    subtitle: 'iPad',
    Childern: IPardIcon,
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e2679d72',
    title: 'Arika’s',
    subtitle: 'PDF',
    Childern: PdfIcon,
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e2675679d72',
    title: 'Add',
    subtitle: 'New Key',
    Childern: AddNewIcon,
  },
];

// const DATATWO = [
//   {
//     id: 'bd7acbea-c1b1-46c2-aed5-3ad53a56bb28ba',
//     titles: 'First Item',
//     Childern: SingleSigIcon,
//     icontitle: 'Single-sig',
//   },
//   {
//     id: '3ac68afc-c605-48d3-a4f8-fbd91aa67897f63',
//     titles: 'Second Item',
//     Childern: BlueWalletIcon,
//     icontitle: 'Blue Wallet',
//   },
//   {
//     id: '58694a0f-3da1-471f-bd96-145571e6729d72',
//     titles: 'Third Item',
//     Childern: MultiSigIcon,
//     icontitle: 'Multi Sig',
//   },
//   {
//     id: '58694a0f-3da1-471f-bd96-14557677891e29d72',
//     titles: 'four Item',
//     Childern: LaptopIcon,
//     last: 'true',
//   },
// ];

const HomeScreen = ({ navigation }) => {
  const bottomSheetRef = React.useRef(null);
  const secureHexaRef = React.useRef(null);

  const wallet = useSelector((state: RootStateOrAny) => state.storage.wallet)
  const allAccounts = [...useSelector((state: RootStateOrAny) => state.accounts.accountShells), { isEnd: true }]
  const rehydrated = useSelector((state: RootStateOrAny) => state._persist.rehydrated)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!wallet && rehydrated) {
      // await redux persist's rehydration
      setTimeout(() => {
        dispatch(setupWallet())
      }, 1000)
    }
  }, [wallet, rehydrated])

  const renderItem = (item) => <DevicesComponent item={item} />;
  const renderItemTwo = ({ item }) => {
    return (
      <HomeCard
        Icon={SingleSigIcon}
        name={item?.primarySubAccount?.customDisplayName}
        description={item?.primarySubAccount?.customDescription}
        balance={item?.primarySubAccount?.balances?.confirmed + item?.primarySubAccount?.balances?.unconfirmed}
        isEnd={item?.isEnd}
      />);
  };
  const openSettings = React.useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const processQR = (qrData: string) => {
    console.log('qrData', qrData.data)

    try {
      const parsedData = JSON.parse(qrData.data)
      console.log('parsedData', parsedData)
      switch (parsedData.type) {
        case QR_TYPES.SECURE_WITH_HEXA:
          secureHexaRef.current.expand();
          break
        case QR_TYPES.LOGIN_WITH_HEXA:
          dispatch(loginWithHexa(parsedData.authToken, parsedData.walletName))
          break
        default:
          throw new Error('Invalid QR')
      }
    } catch (err) {
      Alert.alert('Invalid QR')
    }
  }

  return (
    <View style={styles.Container} background={'light.lightYellow'}>
      <ImageBackground style={styles.backgroundImage} source={backgroundImage}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('QRscanner', {
            processQR,
          })}>
            <ScannerIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={openSettings}>
            <SettingIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.eliteUserContentContainer}>
          <DiamondIcon />
          <View style={styles.eliteUserContainer} backgroundColor={'light.brown'}>
            <Text
              style={styles.eliteUserText}
              color={'light.lightBlack'}
              fontFamily={'body'}
              fontWeight={'300'}
            >
              Elite User
            </Text>
          </View>
        </View>
        <View style={styles.userNameContainer}>
          <Text
            style={styles.helloText}
            color={'light.white'}
            fontFamily={'body'}
            fontWeight={'200'}
          >
            Hello,
          </Text>
          <Text
            style={styles.helloText}
            color={'light.white'}
            fontFamily={'body'}
            fontWeight={'300'}
            fontStyle={'italic'}
          >
            {' '}
            Alex
          </Text>
        </View>
        <Text style={styles.loremText} color={'light.white'} fontFamily={'body'} fontWeight={'100'}>
          Lorem Ipsum Dolor Amet
        </Text>
      </ImageBackground>
      <Text
        style={styles.devicesText}
        color={'light.lightBlack'}
        fontFamily={'body'}
        fontWeight={'200'}
      >
        5 Devices
      </Text>
      <Text
        style={styles.securingFundsText}
        color={'light.lightBlack'}
        fontFamily={'body'}
        fontWeight={'100'}
      >
        used for securing funds
      </Text>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        style={styles.flatlistContainer}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={<View style={{ width: 40 }}></View>}
      />
      <Text
        style={styles.devicesText}
        color={'light.lightBlack'}
        fontFamily={'body'}
        fontWeight={'200'}
      >
        {allAccounts.length - 1} Wallet{allAccounts.length - 1 > 1 && 's'}
      </Text>
      <Text
        style={styles.securingFundsText}
        color={'light.lightBlack'}
        fontFamily={'body'}
        fontWeight={'100'}
      >
        lorem ipsum dolor
      </Text>
      {allAccounts.length != 0 && <FlatList
        data={allAccounts}
        renderItem={renderItemTwo}
        keyExtractor={(item) => item.id}
        horizontal={true}
        style={styles.cardFlatlistContainer}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={<View style={{ width: 50 }}></View>}
      />}

      <SettingSheet bottomSheetRef={bottomSheetRef} />
      <SecureHexa bottomSheetRef={secureHexaRef} />
    </View>
  );
};

const styles = ScaledSheet.create({
  Container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: hp(getResponsive().padingTop),
    paddingHorizontal: wp(10)
  },
  backgroundImage: {
    width: wp('100%'),
    height: hp(getResponsive().height),
    marginTop: hp(getResponsive().marginTop)
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helloText: {
    fontSize: RFValue(24),
    lineHeight: '24@s',
    letterSpacing: '0.7@s',
  },
  loremText: {
    fontSize: RFValue(12),
    lineHeight: '20@s',
    letterSpacing: '0.5@s',
    textAlign: 'center',
  },
  devicesText: {
    fontSize: RFValue(20),
    lineHeight: '27@s',
    letterSpacing: '0.5@s',
    marginLeft: wp(10),
  },
  securingFundsText: {
    fontSize: RFValue(12),
    lineHeight: '16@s',
    letterSpacing: '0.5@s',
    marginLeft: wp(10),
  },
  flatlistContainer: {
    flexGrow: 0,
    marginBottom: hp(4),
    marginTop: hp(3),
    paddingLeft: wp(10),
  },
  cardFlatlistContainer: {
    paddingLeft: wp(8),
  },
  eliteUserContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(8),
    marginBottom: hp(1.3),
  },
  eliteUserContainer: {
    paddingHorizontal: wp(1.5),
    borderRadius: '20@s',
    height: hp(1.7),
    marginLeft: wp(1),
  },
  eliteUserText: {
    fontSize: RFValue(8),
    lineHeight: '12@s',
    letterSpacing: '0.5@s',
  },
});
export default HomeScreen;
