/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import { useSafeAreaInsets, SafeAreaProvider } from "react-native-safe-area-context";
import { DefaultTheme, NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import i18n from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { initReactI18next } from 'react-i18next';
import { StatusBar, StyleSheet,TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as RNLocalize from 'react-native-localize';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { jwtDecode } from 'jwt-decode';
import { initializeNotifications, updateFCMTokenForClient, setFCMNavigationRef } from './src/utility/NotificationService';
import en from './src/assets/locales/en.json';
import mr from './src/assets/locales/mr.json';
import AuthGuard from './src/components/guards/AuthGuard';
import InternetAuthGuard from './src/components/guards/InternetAuthGuard';
import { LoaderScreen } from './src/components/loaderview/LoaderScreen';
import { ModalProvider } from './src/components/modalContext/ModalContext';
import { LuckyDrawProvider } from './src/contexts/LuckyDrawContext';
import { PopupProvider } from './src/contexts/PopupContext';
import { persistor, RootState, store } from './src/reduxToolkit/store';
import AppRouter from './src/routes/AppRouter';
import { PRIMARY, WHITE } from './src/shared/common-styles/colors';
import AuthGuardReferralCode from './src/components/guards/AuthGuardReferralCode';
import SocialMediaFab from './src/components/SocialMediaFab/SocialMediaFab';
// import { initializeAuthAxios } from './src/api/axiosAuth';

import { Linking } from 'react-native';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

// App hash for SMS Retriever (should match your SMS format)
const APP_HASH = '8OI9CriExX5'; // Make sure this matches your backend SMS format
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

function App(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigationRef = useNavigationContainerRef();
  const [loader, setLoader] = useState(false);
  const [currentRouteName, setCurrentRouteName] = useState<string>('');

  useEffect(() => {
    
    const timeoutId = setTimeout(() => {
      setLoader(true)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });


  const languageSelected = useSelector((state: RootState) => state.counter.languageSelected)
  const userData = useSelector((state: RootState) => state.counter.isUserinfo)

  // Initialize FCM when app loads
  useEffect(() => {
    const initializeFCM = async () => {
      try {
        // Set navigation reference for FCM first
        if (navigationRef) {
          setFCMNavigationRef(navigationRef);
          console.log('✅ FCM Navigation reference set');
        }

        // Always initialize FCM first
        await initializeNotifications();
        
        // If user is logged in, get client_id and update FCM token
        if (userData?.jwt) {
          try {
            const decodedToken: any = jwtDecode(userData.jwt);
            const clientId = decodedToken?.data?.client_id;
            
            if (clientId) {
              console.log('Updating FCM token for client:', clientId);
              await updateFCMTokenForClient(clientId);
            }
          } catch (error) {
            console.error('Error decoding JWT for FCM:', error);
          }
        }
      } catch (error) {
        console.error('Error initializing FCM:', error);
      }
    };

    initializeFCM();
  }, [userData?.jwt, navigationRef]); // Re-run when user login status changes or navigation is ready

  const resources = {
    en: { translation: en },
    mr: { translation: mr },
  };

  const languageDetector: any = {
    type: 'languageDetector',
    async: true,
    detect: (cb: (language: string) => void) => {
      cb(languageSelected || RNLocalize.getLocales()[0].languageCode);
    },
    init: () => { },
    cacheUserLanguage: () => { },
  };

  useMemo(() =>
    i18n
      .use(initReactI18next)
      .use(languageDetector)
      .init({
        resources,
        compatibilityJSON: 'v3',
        fallbackLng: 'en', // Fallback language
        interpolation: {
          escapeValue: false, // React already escapes values
        },
      })
    , [languageSelected])

  return (
    <LuckyDrawProvider>
      <GestureHandlerRootView style={style.rootStyle}>
        <StatusBar backgroundColor={WHITE} barStyle="dark-content" />
        <NavigationContainer 
          ref={navigationRef}
          theme={MyTheme}
          onReady={() => {
            setCurrentRouteName(navigationRef.getCurrentRoute()?.name || '');
          }}
          onStateChange={() => {
            const currentRoute = navigationRef.getCurrentRoute();
            setCurrentRouteName(currentRoute?.name || '');
          }}
        >
          <>
            {loader ?
              <InternetAuthGuard>
                <AuthGuard>
                  {/* <AuthGuardReferralCode> */}
                    <AppRouter />
                  {/* </AuthGuardReferralCode> */}
                </AuthGuard>
              </InternetAuthGuard>
              :
              <LoaderScreen />
            }
                {/* Hide FAB buttons on intro, login and OTP screens */}
                {currentRouteName !== 'IntroScreen' && currentRouteName !== 'SignIn' && currentRouteName !== 'OtpScreen' && (
                  <SocialMediaFab 
                    style={[
                      style.socialMediaButton, 
                      { bottom: 90 + insets.bottom }
                    ]} 
                  />
                )}
          </>
        </NavigationContainer>
      </GestureHandlerRootView >
    </LuckyDrawProvider>
  );
}

export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaProvider>
        <PopupProvider>
          <ModalProvider>
            {/* <MyContextProvider> */}
            <App />
            {/* </MyContextProvider> */}
          </ModalProvider>
        </PopupProvider>
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
);

const style = StyleSheet.create({
  rootStyle: {
    flex: 1,
    backgroundColor: WHITE,
    // paddingTop: insets.top,
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  appText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold'
  },
  env: {
    position: 'absolute',
    backgroundColor: PRIMARY,
    top: 90,
    right: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    opacity: 0.65,
    zIndex: 1000
  },
  socialMediaButton: {
    position: 'absolute',
    // bottom will be set dynamically with insets
    right: 20,
  },
})
