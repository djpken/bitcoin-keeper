import * as Sentry from '@sentry/react-native';

import { LogBox, Platform, StatusBar, UIManager } from 'react-native';
import React, { ReactElement, useEffect } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { NativeBaseProvider } from 'native-base';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { sentryConfig } from 'src/core/services/sentry';
import { withIAPContext, initConnection, endConnection } from 'react-native-iap';
import { TorContextProvider } from 'src/context/TorContext';
import { HCESessionProvider } from 'react-native-hce';
import { customTheme } from './src/navigation/themes';
import Navigator from './src/navigation/Navigator';
import { persistor, store } from './src/store/store';
import { LocalizationProvider } from 'src/context/Localization/LocContext';
import { AppContextProvider } from 'src/context/AppContext';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
  /\b{$Require cycle}\b/gi,
  'Warning: ...',
  /.+/s,
]);

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function AndroidProvider({ children }: { children: ReactElement }) {
  return Platform.OS === 'android' ? <HCESessionProvider>{children}</HCESessionProvider> : children;
}

function App() {
  useEffect(() => {
    initConnection();
    Sentry.init(sentryConfig);
    return () => {
      endConnection();
    };
  }, []);

  // linear-gradient configs for NativeBase
  const config = {
    dependencies: {
      'linear-gradient': LinearGradient,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider theme={customTheme} config={config}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <LocalizationProvider>
          <AppContextProvider>
            <TorContextProvider>
              <AndroidProvider>
                <Navigator />
              </AndroidProvider>
            </TorContextProvider>
          </AppContextProvider>
        </LocalizationProvider>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}

function AppWrapper() {
  return (
    <PersistGate persistor={persistor} loading={null}>
      <Provider store={store}>
        <App />
      </Provider>
    </PersistGate>
  );
}

const SentryApp = Sentry.wrap(AppWrapper);

export default withIAPContext(SentryApp);
