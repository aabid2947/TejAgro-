/* eslint-disable prettier/prettier */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, Linking, TouchableOpacity, StyleSheet } from 'react-native';
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
import ReferralScreen from '../screens/ReferralTab/ReferralScreen';
import TextPoppinsSemiBold from '../shared/fontFamily/TextPoppinsSemiBold';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reduxToolkit/store';
import AuthApi from '../api/AuthApi';
import { profileDetail } from '../reduxToolkit/counterSlice';
import { MYCART_SCREEN } from './Routes';

const Tab = createBottomTabNavigator();

const TabScreen = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const totalItems = useSelector((state: RootState) => state.counter.totalItems);
  const isLoggedIn: any = useSelector((state: RootState) => state.counter.login);

  useEffect(() => {}, [totalItems]);
  console.log('🔔 ProductListScreen render');

  useEffect(() => {
    getProfile();
  }, [isLoggedIn]);

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
          options={{
            tabBarLabel: ({ focused }) => (
              <TextPoppinsSemiBold style={{ color: focused ? MDBLUE : UNFOCUSED, fontSize: 14 }}>
                {t('PRODUCT')}
              </TextPoppinsSemiBold>
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
          options={{
            tabBarLabel: ({ focused }) => (
              <TextPoppinsSemiBold style={{ color: focused ? MDBLUE : UNFOCUSED, fontSize: 14 }}>
                {t('HOME')}
              </TextPoppinsSemiBold>
            ),
            tabBarIcon: ({ focused }) =>
              focused ? (
                <HomeIconSvg width={24} height={24} color={MDBLUE} />
              ) : (
                <HomeIconSvg width={24} height={24} color={UNFOCUSED} />
              ),
          }}
        />
        <Tab.Screen
          name={MYCART_SCREEN}
          component={MyCartScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <TextPoppinsSemiBold style={{ color: focused ? MDBLUE : UNFOCUSED, fontSize: 14 }}>
                {t('MY_CART')}
              </TextPoppinsSemiBold>
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
        />
        {/* New Call tab */}
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
      
      {/* WhatsApp Floating Button */}
  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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