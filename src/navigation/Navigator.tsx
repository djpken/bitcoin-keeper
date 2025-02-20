import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useContext, useRef } from 'react';
import AddAmountScreen from 'src/screens/Recieve/AddAmountScreen';
import AddDescription from 'src/screens/Vault/AddDescription';
import AddSendAmount from 'src/screens/Send/AddSendAmount';
import AddSigningDevice from 'src/screens/Vault/AddSigningDevice';
import AppSettings from 'src/screens/AppSettings/AppSettings';
import AppVersionHistory from 'src/screens/AppSettings/AppVersionHistoty';
import ArchivedVault from 'src/screens/Vault/ArchivedVault';
import BackupWallet from 'src/screens/BackupWallet/BackupWallet';
import ChangeLanguage from 'src/screens/AppSettings/ChangeLanguage';
import ChoosePlan from 'src/screens/ChoosePlanScreen/ChoosePlan';
import ChoosePolicyNew from 'src/screens/Vault/ChoosePolicyNew';
import CreatePin from 'src/screens/LoginScreen/CreatePin';
import EditWalletSettings from 'src/screens/WalletDetails/EditWalletDetails';
import EnterSeedScreen from 'src/screens/Recovery/EnterSeedScreen';
import EnterWalletDetailScreen from 'src/screens/EnterWalletDetailScreen/EnterWalletDetailScreen';
import ExportSeedScreen from 'src/screens/ExportSeedScreen/ExportSeedScreen';
import KeeperLoader from 'src/components/KeeperLoader';
import NewKeeperApp from 'src/screens/NewKeeperAppScreen/NewKeeperAppScreen';
import OnBoardingSlides from 'src/screens/Splash/OnBoardingSlides';
import { RealmProvider } from 'src/storage/realm/RealmProvider';
import ReceiveScreen from 'src/screens/Recieve/ReceiveScreen';
import RegisterWithQR from 'src/screens/QRScreens/RegisterWithQR';
import ResetPin from 'src/screens/LoginScreen/ResetPin';
import ScanQR from 'src/screens/QRScreens/ScanQR';
import ShowQR from 'src/screens/QRScreens/ShowQR';
import SendConfirmation from 'src/screens/Send/SendConfirmation';
import SendScreen from 'src/screens/Send/SendScreen';
import SetupColdCard from 'src/screens/SigningDevices/SetupColdCard';
import SetupInheritance from 'src/screens/Inheritance/SetupInheritance';
import PreviewPDF from 'src/screens/Inheritance/components/PreviewPDF';
import InheritanceStatus from 'src/screens/Inheritance/InheritanceStatus';
import InheritanceSetupInfo from 'src/screens/Inheritance/InheritanceSetupInfo';
import IKSAddEmailPhone from 'src/screens/Inheritance/IKSAddEmailPhone';
import EnterOTPEmailConfirmation from 'src/screens/Inheritance/EnterOTPEmailConfirmation';
import SignTransactionScreen from 'src/screens/SignTransaction/SignTransactionScreen';
import SignWithColdCard from 'src/screens/SignTransaction/SignWithColdCard';
import SignWithQR from 'src/screens/SignTransaction/SignWithQR';
import SignWithTapsigner from 'src/screens/SignTransaction/SignWithTapsigner';
import SignerAdvanceSettings from 'src/screens/Vault/SignerAdvanceSettings';
import SigningDeviceDetails from 'src/screens/Vault/SigningDeviceDetails';
import SigningDeviceList from 'src/screens/Vault/SigningDeviceList';
import SigningServer from 'src/screens/Vault/SigningServer';
import SigningServerSettings from 'src/screens/Vault/SigningServerSettings';
import SplashScreen from 'src/screens/Splash/SplashScreen';
import TimelockScreen from 'src/screens/Vault/TimelockScreen';
import TorSettings from 'src/screens/AppSettings/TorSettings';
import ManageWallets from 'src/screens/AppSettings/ManageWallets';
import TransactionDetails from 'src/screens/ViewTransactions/TransactionDetails';
import VaultDetails from 'src/screens/Vault/VaultDetails';
import VaultRecovery from 'src/screens/VaultRecovery/VaultRecovery';
import VaultSettings from 'src/screens/Vault/VaultSettings';
import AllTransactions from 'src/screens/Vault/AllTransactions';
import WalletBackHistoryScreen from 'src/screens/BackupWallet/WalletBackHistoryScreen';
import WalletDetails from 'src/screens/WalletDetails/WalletDetails';
import WalletSettings from 'src/screens/WalletDetails/WalletSettings';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routingInstrumentation } from 'src/services/sentry';
import Colors from 'src/theme/Colors';
import NodeSettings from 'src/screens/AppSettings/Node/NodeSettings';
import HomeScreen from 'src/screens/HomeScreen/HomeScreen';
import OtherRecoveryMethods from 'src/screens/Recovery/OtherRecoveryMethods';
import ConnectChannel from 'src/screens/Channel/ConnectChannel';
import RegisterWithChannel from 'src/screens/QRScreens/RegisterWithChannel';
import VaultConfigurationRecovery from 'src/screens/VaultRecovery/VaultConfigurationRecovery';
import SignWithChannel from 'src/screens/QRScreens/SignWithChannel';
import SigningDeviceConfigRecovery from 'src/screens/Recovery/SigningDeviceConfigRecovery';
import ScanQRFileRecovery from 'src/screens/Recovery/ScanQRFileRecovery';
import PoolSelection from 'src/screens/Mix/PoolSelection';
import BroadcastPremix from 'src/screens/Mix/BroadcastPremix';
import WhirlpoolConfiguration from 'src/screens/Mix/WhirlpoolConfiguration';
import UTXOLabeling from 'src/screens/UTXOManagement/UTXOLabeling';
import UTXOManagement from 'src/screens/UTXOManagement/UTXOManagement';
import MixProgress from 'src/screens/Mix/MixProgress';
import ImportWalletScreen from 'src/screens/ImportWalletScreen/ImportWalletScreen';
import ImportWalletDetailsScreen from 'src/screens/ImportWalletDetailsScreen/ImportWalletDetailsScreen';
import AddDetailsFinalScreen from 'src/screens/ImportWalletDetailsScreen/AddDetailsFinalScreen';
import UpdateWalletDetails from 'src/screens/WalletDetails/UpdateWalletDetails';
import AssignSignerType from 'src/screens/Vault/AssignSignerType';
import CosignerDetails from 'src/screens/WalletDetails/CosignerDetails';
import WalletDetailsSettings from 'src/screens/WalletDetails/WalletDetailsSettings';
import CollabrativeWalletSettings from 'src/screens/WalletDetails/CollabrativeWalletSettings';
import ImportDescriptorScreen from 'src/screens/WalletDetails/ImportDescriptor';
import GenerateVaultDescriptor from 'src/screens/Vault/GenerateVaultDescriptor';
import Login from '../screens/LoginScreen/Login';
import { AppContext } from 'src/context/AppContext';
import SetupTapsigner from 'src/screens/SigningDevices/SetupTapsigner';
import SetupSeedWordSigner from 'src/screens/SigningDevices/SetupSeedWordSigner';
import InputSeedWordSigner from 'src/screens/SigningDevices/InputSeedWordSigner';
import SetupOtherSDScreen from 'src/screens/SigningDevices/SetupOtherSDScreen';
import SetupCollaborativeWallet from 'src/screens/SigningDevices/SetupCollaborativeWallet';
import SetupSigningServer from 'src/screens/SigningDevices/SetupSigningServer';
import SigningDeviceListRecovery from 'src/screens/Recovery/SigninDeviceListRecovery';
import UnlockTapsigner from 'src/screens/SigningDevices/UnlockTapsigner';
import UTXOSelection from 'src/screens/Send/UTXOSelection';
import VaultSetup from 'src/screens/Vault/VaultSetup';

const defaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.Isabelline,
  },
};

function LoginStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen options={{ gestureEnabled: false }} name="Splash" component={SplashScreen} />
      <Stack.Screen options={{ gestureEnabled: false }} name="Login" component={Login} />
      <Stack.Screen options={{ gestureEnabled: false }} name="CreatePin" component={CreatePin} />
      <Stack.Screen options={{ gestureEnabled: false }} name="ResetPin" component={ResetPin} />
      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="OnBoardingSlides"
        component={OnBoardingSlides}
      />
      <Stack.Screen
        name="NewKeeperApp"
        options={{ gestureEnabled: false }}
        component={NewKeeperApp}
      />

      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="VaultRecoveryAddSigner"
        component={VaultRecovery}
      />
      <Stack.Screen name="VaultConfigurationRecovery" component={VaultConfigurationRecovery} />
      <Stack.Screen name="SigningDeviceConfigRecovery" component={SigningDeviceConfigRecovery} />
      <Stack.Screen name="SigningDeviceListRecovery" component={SigningDeviceListRecovery} />
      <Stack.Screen name="ScanQRFileRecovery" component={ScanQRFileRecovery} />
      <Stack.Screen name="OtherRecoveryMethods" component={OtherRecoveryMethods} />

      {/* Cold Card */}
      <Stack.Screen name="AddColdCardRecovery" component={SetupColdCard} />
      {/* Tap Signer  */}
      <Stack.Screen name="AddTapsignerRecovery" component={SetupTapsigner} />
      {/* QR Based SDs */}
      <Stack.Screen options={{ gestureEnabled: false }} name="ScanQR" component={ScanQR} />
      {/* Channel Based SDs */}
      <Stack.Screen name="ConnectChannel" component={ConnectChannel} />
      {/* Mobile Key, Seed Key */}
      <Stack.Screen name="EnterSeedScreen" component={EnterSeedScreen} />
      <Stack.Screen name="UnlockTapsigner" component={UnlockTapsigner} />
      {/* Other SD */}
      <Stack.Screen name="SetupOtherSDScreen" component={SetupOtherSDScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  const Stack = createNativeStackNavigator();
  return (
    <RealmProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SigningDeviceList" component={SigningDeviceList} />
        <Stack.Screen name="AddTapsigner" component={SetupTapsigner} />
        <Stack.Screen name="SignWithTapsigner" component={SignWithTapsigner} />
        <Stack.Screen name="AddColdCard" component={SetupColdCard} />
        <Stack.Screen name="AppSettings" component={AppSettings} />
        <Stack.Screen name="AppVersionHistory" component={AppVersionHistory} />
        <Stack.Screen name="TorSettings" component={TorSettings} />
        <Stack.Screen name="ManageWallets" component={ManageWallets} />
        <Stack.Screen name="SetupInheritance" component={SetupInheritance} />
        <Stack.Screen name="PreviewPDF" component={PreviewPDF} />
        <Stack.Screen name="InheritanceStatus" component={InheritanceStatus} />
        <Stack.Screen name="InheritanceSetupInfo" component={InheritanceSetupInfo} />
        <Stack.Screen name="IKSAddEmailPhone" component={IKSAddEmailPhone} />
        <Stack.Screen name="EnterOTPEmailConfirmation" component={EnterOTPEmailConfirmation} />
        <Stack.Screen name="Send" component={SendScreen} />
        <Stack.Screen name="UTXOLabeling" component={UTXOLabeling} />
        <Stack.Screen name="Receive" component={ReceiveScreen} />
        <Stack.Screen name="ChangeLanguage" component={ChangeLanguage} />
        <Stack.Screen name="ChoosePlan" component={ChoosePlan} />
        <Stack.Screen name="EnterWalletDetail" component={EnterWalletDetailScreen} />
        <Stack.Screen name="UpdateWalletDetails" component={UpdateWalletDetails} />
        <Stack.Screen name="EditWalletDetails" component={EditWalletSettings} />
        <Stack.Screen name="WalletDetailsSettings" component={WalletDetailsSettings} />
        <Stack.Screen name="ImportDescriptorScreen" component={ImportDescriptorScreen} />
        <Stack.Screen name="CollaborativeWalletSettings" component={CollabrativeWalletSettings} />
        <Stack.Screen name="AddAmount" component={AddAmountScreen} />
        <Stack.Screen name="ExportSeed" component={ExportSeedScreen} />
        <Stack.Screen name="ImportWallet" component={ImportWalletScreen} />
        <Stack.Screen name="ImportWalletDetails" component={ImportWalletDetailsScreen} />
        <Stack.Screen name="AddDetailsFinal" component={AddDetailsFinalScreen} />
        <Stack.Screen name="AddSendAmount" component={AddSendAmount} />
        <Stack.Screen name="SendConfirmation" component={SendConfirmation} />
        <Stack.Screen name="WalletDetails" component={WalletDetails} />
        <Stack.Screen name="VaultDetails" component={VaultDetails} />
        <Stack.Screen name="UTXOManagement" component={UTXOManagement} />
        <Stack.Screen name="WalletSettings" component={WalletSettings} />
        <Stack.Screen name="BackupWallet" component={BackupWallet} />
        <Stack.Screen name="SigningDeviceDetails" component={SigningDeviceDetails} />
        <Stack.Screen name="WalletBackHistory" component={WalletBackHistoryScreen} />
        <Stack.Screen name="SignTransactionScreen" component={SignTransactionScreen} />
        <Stack.Screen name="AddSigningDevice" component={AddSigningDevice} />
        <Stack.Screen name="SetupSigningServer" component={SetupSigningServer} />
        <Stack.Screen name="SetupSeedWordSigner" component={SetupSeedWordSigner} />
        <Stack.Screen name="InputSeedWordSigner" component={InputSeedWordSigner} />
        <Stack.Screen name="ArchivedVault" component={ArchivedVault} />
        <Stack.Screen name="VaultSettings" component={VaultSettings} />
        <Stack.Screen name="SignWithColdCard" component={SignWithColdCard} />
        <Stack.Screen name="ChoosePolicyNew" component={ChoosePolicyNew} />
        <Stack.Screen name="SigningServerSettings" component={SigningServerSettings} />
        <Stack.Screen name="SigningServer" component={SigningServer} />
        <Stack.Screen name="AddDescription" component={AddDescription} />
        <Stack.Screen name="AllTransactions" component={AllTransactions} />
        <Stack.Screen name="TransactionDetails" component={TransactionDetails} />
        <Stack.Screen name="TimelockScreen" component={TimelockScreen} />
        <Stack.Screen name="SignerAdvanceSettings" component={SignerAdvanceSettings} />
        <Stack.Screen name="ScanQR" component={ScanQR} />
        <Stack.Screen name="ShowQR" component={ShowQR} />
        <Stack.Screen name="RegisterWithQR" component={RegisterWithQR} />
        <Stack.Screen name="SignWithQR" component={SignWithQR} />
        <Stack.Screen name="NodeSettings" component={NodeSettings} />
        <Stack.Screen name="ConnectChannel" component={ConnectChannel} />
        <Stack.Screen name="RegisterWithChannel" component={RegisterWithChannel} />
        <Stack.Screen name="SetupOtherSDScreen" component={SetupOtherSDScreen} />
        <Stack.Screen name="SignWithChannel" component={SignWithChannel} />
        <Stack.Screen name="PoolSelection" component={PoolSelection} />
        <Stack.Screen name="BroadcastPremix" component={BroadcastPremix} />
        <Stack.Screen name="WhirlpoolConfiguration" component={WhirlpoolConfiguration} />
        <Stack.Screen name="CosignerDetails" component={CosignerDetails} />
        <Stack.Screen name="GenerateVaultDescriptor" component={GenerateVaultDescriptor} />
        <Stack.Screen name="SetupCollaborativeWallet" component={SetupCollaborativeWallet} />
        <Stack.Screen name="EnterSeedScreen" component={EnterSeedScreen} />
        <Stack.Screen name="UnlockTapsigner" component={UnlockTapsigner} />
        <Stack.Screen name="UTXOSelection" component={UTXOSelection} />
        <Stack.Screen name="VaultSetup" component={VaultSetup} />
        <Stack.Screen
          name="MixProgress"
          component={MixProgress}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="AssignSignerType" component={AssignSignerType} />
      </Stack.Navigator>
    </RealmProvider>
  );
}
function Navigator() {
  const Stack = createNativeStackNavigator();
  const navigation = useRef();
  const { appLoading, loadingContent } = useContext(AppContext);

  // Register the navigation container with the instrumentation
  const onReady = () => {
    routingInstrumentation.registerNavigationContainer(navigation);
  };
  return (
    <NavigationContainer theme={defaultTheme} ref={navigation} onReady={onReady}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginStack" component={LoginStack} />
        <Stack.Screen name="App" component={AppStack} />
      </Stack.Navigator>
      <KeeperLoader
        visible={appLoading}
        loadingContent={loadingContent}
        close={() => {}}
        title="please wait"
        subTitle="loading"
      />
    </NavigationContainer>
  );
}

export default Navigator;
