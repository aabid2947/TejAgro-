/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
 import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import i18n from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { initReactI18next } from 'react-i18next';
import { StatusBar, StyleSheet,TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as RNLocalize from 'react-native-localize';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import en from './src/assets/locales/en.json';
import mr from './src/assets/locales/mr.json';
import AuthGuard from './src/components/guards/AuthGuard';
import InternetAuthGuard from './src/components/guards/InternetAuthGuard';
import { LoaderScreen } from './src/components/loaderview/LoaderScreen';
import { ModalProvider } from './src/components/modalContext/ModalContext';
import { persistor, RootState, store } from './src/reduxToolkit/store';
import AppRouter from './src/routes/AppRouter';
import { PRIMARY, WHITE } from './src/shared/common-styles/colors';
import AuthGuardReferralCode from './src/components/guards/AuthGuardReferralCode';
import WhatsAppIcon from './src/svg/WhatsAppIcon'; // Import the improved WhatsApp icon
// import { initializeAuthAxios } from './src/api/axiosAuth';

import { Linking } from 'react-native';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

// Removed SmsRetriever.getAppHash() as it's not available in current version
const APP_HASH = '8OI9CriExX5'; // Replace with your actual app hash
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};
// const insets = useSafeAreaInsets();

function App(): JSX.Element {
  const [loader, setLoader] = useState(false)
  console.log("starting")
  useEffect(() => {
    
    const timeoutId = setTimeout(() => {
      setLoader(true)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  const handleWhatsAppPress = () => {
      const phoneNumber = '+919130530591';
      const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
      
      Linking.canOpenURL(whatsappUrl)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(whatsappUrl);
          } else {
            // Fallback to web WhatsApp
            return Linking.openURL(`https://wa.me/${phoneNumber.replace('+', '')}`);
          }
        })
        .catch((err) => console.error('Error opening WhatsApp:', err));
    };

  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });


  const languageSelected = useSelector((state: RootState) => state.counter.languageSelected)



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
    <GestureHandlerRootView style={style.rootStyle}>
      <StatusBar backgroundColor={WHITE} barStyle="dark-content" />
      <NavigationContainer theme={MyTheme}>
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
              <TouchableOpacity
                  style={style.whatsappButton}
                  onPress={handleWhatsAppPress}
                  activeOpacity={0.8}
                >
                  <WhatsAppIcon width={28} height={28} />
                </TouchableOpacity>
        </>
      </NavigationContainer>
    </GestureHandlerRootView >
  );
}

export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ModalProvider>
        {/* <MyContextProvider> */}
        <App />
        {/* </MyContextProvider> */}
      </ModalProvider>
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
    whatsappButton: {
    position: 'absolute',
    bottom: 90, // Position above the tab bar
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: '#25D366',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
})
