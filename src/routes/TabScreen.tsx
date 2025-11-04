/* eslint-disable primport ReferralScreen from '../screens/ReferralTab/ReferralScreen';
import YouTubeVideosScreen from '../screens/youtubeVideos/YouTubeVideosScreen';
import KrishiCharchaScreen from '../screens/krishiCharcha/KrishiCharchaScreen';
import OfferScreen from '../screens/offerScreen/OfferScreen';
import TextPoppinsSemiBold from '../shared/fontFamily/TextPoppinsSemiBold';er/prettier */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MyCartScreen from '../screens/cartScreen/MyCartScreen';
import Dashboard from '../screens/dashboard/Dashboard';
import ProductListScreen from '../screens/productlist/ProductListScreen';
import { GRAY_SHADE, MDBLUE, UNFOCUSED, WHITE } from '../shared/common-styles/colors';
import AccoountSetting from '../svg/AccoountSetting';
import CartSvg from '../svg/CartSvg';
import HomeIconSvg from '../svg/HomeIconSvg';
import ProductIconSvg from '../svg/ProductIconSvg';
import ReferralSvg from '../svg/ReferralSvg';
import Call from '../svg/CallSvg'; 
import WhatsAppIcon from '../svg/WhatsAppIcon'; // Import the improved WhatsApp icon
import PlusIcon from '../svg/PlusIcon';
import YouTubeIcon from '../svg/YouTubeIcon';
import KrishiCharchaIcon from '../svg/KrishiCharchaIcon';
import OfferIcon from '../svg/OfferIcon';
import ReferralScreen from '../screens/ReferralTab/ReferralScreen';
import YouTubeVideosScreen from '../screens/youtubeVideos/YouTubeVideosScreen';
import KrishiCharchaScreen from '../screens/krishiCharcha/KrishiCharchaScreen';
import OfferScreen from '../screens/offerScreen/OfferScreen';
import TextPoppinsSemiBold from '../shared/fontFamily/TextPoppinsSemiBold';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reduxToolkit/store';
import AuthApi from '../api/AuthApi';
import { profileDetail } from '../reduxToolkit/counterSlice';
import { MYCART_SCREEN, CREATE_POST_SCREEN, OFFER_SCREEN } from './Routes';
import { useLuckyDraw } from '../contexts/LuckyDrawContext';
import LuckyDrawPopup from '../components/luckyDrawPopup/LuckyDrawPopup';

const Tab = createBottomTabNavigator();

const TabScreen = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const totalItems = useSelector((state: RootState) => state.counter.totalItems);
  const isLoggedIn: any = useSelector((state: RootState) => state.counter.login);
  const [currentTab, setCurrentTab] = useState('Product');
  const { hasVisitedLuckyDraw, isLoading } = useLuckyDraw();
  const [showLuckyDrawPopup, setShowLuckyDrawPopup] = useState(false);

  useEffect(() => {}, [totalItems]);
  console.log('🔔 ProductListScreen render');

  useEffect(() => {
    getProfile();
  }, [isLoggedIn]);

  // Show lucky draw popup when app loads if user hasn't visited
  useEffect(() => {
    if (!isLoading && !hasVisitedLuckyDraw && isLoggedIn) {
      // Add a small delay to ensure the app is fully loaded
      const timer = setTimeout(() => {
        setShowLuckyDrawPopup(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, hasVisitedLuckyDraw, isLoggedIn]);

  const getProfile = async () => {
    try {
      const resp = await AuthApi.getProfileDetails();
      if (resp && resp.data) {
        dispatch(profileDetail(resp.data));
      } else {
        console.log('Error: getProfileDetails response is empty.');
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="Product"
        screenOptions={{
          tabBarActiveTintColor: '#1b1b1b',
          tabBarInactiveTintColor: GRAY_SHADE,
          tabBarActiveBackgroundColor: WHITE,
          tabBarLabelStyle: { fontSize: 10, fontFamily: 'bold' },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Product"
          component={ProductListScreen}
          listeners={{
            tabPress: () => setCurrentTab('Product'),
          }}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? MDBLUE : UNFOCUSED, fontSize: 14 }}>
                {t('PRODUCT')}
              </Text>
            ),
            tabBarIcon: ({ focused }) =>
              focused ? (
                <ProductIconSvg width={24} height={24} color={MDBLUE} />
              ) : (
                <ProductIconSvg width={24} height={24} color={UNFOCUSED} />
              ),
          }}
        />
        <Tab.Screen
          name="Home"
          component={Dashboard}
          listeners={{
            tabPress: () => setCurrentTab('Home'),
          }}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? MDBLUE : UNFOCUSED, fontSize: 14 }}>
                {t('HOME')}
              </Text>
            ),
            tabBarIcon: ({ focused }) =>
              focused ? (
                <HomeIconSvg width={24} height={24} color={MDBLUE} />
              ) : (
                <HomeIconSvg width={24} height={24} color={UNFOCUSED} />
              ),
          }}
        />
        {/* <Tab.Screen
          name={MYCART_SCREEN}
          component={MyCartScreen}
          listeners={{
            tabPress: () => setCurrentTab(MYCART_SCREEN),
          }}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? MDBLUE : UNFOCUSED, fontSize: 14 }}>
                {t('MY_CART')}
              </Text>
            ),
            tabBarIcon: ({ focused }) => (
              <View style={{ position: 'relative' }}>
                {focused ? (
                  <CartSvg width={24} height={24} color={MDBLUE} />
                ) : (
                  <CartSvg width={24} height={24} color={UNFOCUSED} />
                )}
                {totalItems > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: -10,
                      backgroundColor: 'red',
                      borderRadius: 10,
                      width: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                      {totalItems}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        /> */}
        {/* YouTube Videos tab */}
        <Tab.Screen
          name="Videos"
          component={YouTubeVideosScreen}
          listeners={{
            tabPress: () => setCurrentTab('Videos'),
          }}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? MDBLUE : UNFOCUSED, fontSize: 14 }}>
                {t('VIDEOS')}
              </Text>
            ),
            tabBarIcon: ({ focused }) =>
              focused ? (
                <YouTubeIcon width={24} height={24} color={MDBLUE} />
              ) : (
                <YouTubeIcon width={24} height={24} color={UNFOCUSED} />
              ),
          }}
        />
        {/* Krishi Charcha tab */}
        <Tab.Screen
          name="KrishiCharcha"
          component={KrishiCharchaScreen}
          listeners={{
            tabPress: () => setCurrentTab('KrishiCharcha'),
          }}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? MDBLUE : UNFOCUSED, fontSize: 14 }}>
                {t('KRISHI_CHARCHA')}
              </Text>
            ),
            tabBarIcon: ({ focused }) =>
              focused ? (
                <KrishiCharchaIcon width={24} height={24} color={MDBLUE} />
              ) : (
                <KrishiCharchaIcon width={24} height={24} color={UNFOCUSED} />
              ),
          }}
        />
        {/* Offers tab */}
        {/* <Tab.Screen
          name={OFFER_SCREEN}
          component={OfferScreen}
          listeners={{
            tabPress: () => setCurrentTab(OFFER_SCREEN),
          }}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? MDBLUE : UNFOCUSED, fontSize: 14 }}>
                {t('OFFERS')}
              </Text>
            ),
            tabBarIcon: ({ focused }) =>
              focused ? (
                <OfferIcon width={24} height={24} color={MDBLUE} />
              ) : (
                <OfferIcon width={24} height={24} color={UNFOCUSED} />
              ),
          }}
        /> */}
        {/* Call tab - Commented out */}
        <Tab.Screen
          name="Call"
          component={() => null}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              Linking.openURL('tel:+919130530591');
            },
          }}
          options={{
            tabBarLabel: ({ focused }) => (
              <TextPoppinsSemiBold style={{ color: focused ? MDBLUE : UNFOCUSED, fontSize: 14 }}>
                {t('CALL')}
              </TextPoppinsSemiBold>
            ),
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Call width={24} height={24} color={MDBLUE} />
              ) : (
                <Call width={24} height={24} color={UNFOCUSED} />
              ),
          }}
        />
      </Tab.Navigator>
      
      {/* Create Post Floating Button - Only show on Krishi Charcha tab */}
      {currentTab === 'KrishiCharcha' && (
        <TouchableOpacity
          style={[styles.createPostButton, { bottom: 155 + insets.bottom }]}
          onPress={() => navigation.navigate(CREATE_POST_SCREEN as never)}
          activeOpacity={0.8}
        >
          <PlusIcon width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      
      {/* WhatsApp Floating Button */}
      {/* <TouchableOpacity
        style={styles.whatsappButton}
        onPress={handleWhatsAppPress}
        activeOpacity={0.8}
      >
        <WhatsAppIcon width={28} height={28} color="#FFFFFF" />
      </TouchableOpacity> */}
  
      {/* Lucky Draw Popup */}
      <LuckyDrawPopup 
        visible={showLuckyDrawPopup} 
        onClose={() => setShowLuckyDrawPopup(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createPostButton: {
    position: 'absolute',
    // bottom will be set dynamically with insets (230 + insets.bottom)
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: MDBLUE,
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
});

export default TabScreen;