import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import MyCartScreen from '../screens/cartScreen/MyCartScreen';
import CheckOutScreen from '../screens/checkoutScreen/CheckOutScreen';
import PaymentSuccessScreen from '../screens/checkoutScreen/PaymentSuccessScreen';
import NotifcationScreen from '../screens/notificationScreen/NotificationScreen';
import MyOrders from '../screens/orders/MyOrders';
import AddPaymentScreen from '../screens/payment/AddPaymentScreen';
import ProductScreen from '../screens/productlist/ProductScreen';
import ProfileScreen from '../screens/profileScreen/ProfileScreen';
import ProfileSettingScreen from '../screens/setting/ProfileSettingScreen';
import ShippingAddressScreen from '../screens/shippingAddress/ShippingAddressScreen';
import { ADD_NEW_SHIPPING_SCREEN, ADD_PAYMENT_SCREEN, CHAT_CONVERSATION_SCREEN, CHAT_SCREEN, CHECKOUT_SCREEN, CREATE_POST_SCREEN, CROP_MAP_SCREEN, HOME_SCREEN, KRISHI_CHARCHA_SCREEN, LUCKY_DRAW_WINNERS_SCREEN, LUCKY_DRAW_PDF_VIEWER_SCREEN, MENUBAR_SCREEN, MY_PROFILE, MY_REWARD_SCREEN, MYCART_SCREEN, NOTIFICATION_SCREEN, OFFER_SCREEN, ORDER_DETAIL_SCREEN, ORDER_SCREEN, PAYMENT_SUCCESS_SCREEN, POST_DETAILS_SCREEN, PRODUCT_SCREEN, PROFILE_SETTING_SCREEN, PROMO_CODE_SCREEN, SELECTED_CROP_SCREEN, SHIPPING_ADDRESS_SCREEN } from './Routes';
import TabScreen from './TabScreen';
import AddNewShipping from '../screens/shippingAddress/AddNewShipping';
import MenuBarScreen from '../screens/menuScreen/MenuBarScreen';
import SelectedCropScreen from '../screens/crop/SelectedCropScreen';
import CropMapScreen from '../screens/crop/CropMapScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
import PromoCodeScreen from '../screens/promo/PromoCodeScreen';
import MyRewards from '../screens/profileScreen/MyRewards';
import KrishiCharchaScreen from '../screens/krishiCharcha/KrishiCharchaScreen';
import PostDetailsScreen from '../screens/krishiCharcha/PostDetailsScreen';
import CreatePostScreen from '../screens/krishiCharcha/CreatePostScreen';
import OfferScreen from '../screens/offerScreen/OfferScreen';
import LuckyDrawWinnersScreen from '../screens/luckyDrawWinners/LuckyDrawWinnersScreen';
import LuckyDrawPDFViewerScreen from '../screens/luckyDrawPDFViewer/LuckyDrawPDFViewerScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ChatConversationScreen from '../screens/chat/ChatScreen';
import { versionApp } from '../shared/components/CommonUtilities';
// import ComingSoonScreen from './ComingSoonScreen';

export type RootStackParamList = {
    TabScreen: any,
    HomeScreen: any,
    ProfileScreen: any
    NotifcationScreen: any
    MyCartScreen: any
    CheckOutScreen: any
    PaymentSuccessScreen: any
    productScreen: any
    myOrders: any
    ShippingAddressScreen: any
    addPaymentScreen: any
    profileSettingScreen: any
    AddNewShipping: any
    MenuBarScreen: any
    selectedCropScreen: any
    cropMapScreen: any
    orderDetailScreen: any
    promoCodeScreen: any
    myRewards: any
    KrishiCharchaScreen: any
    PostDetails: any
    CreatePost: any
    OfferScreen: any
    LuckyDrawWinners: any
    LuckyDrawPDFViewer: any
    ChatScreen: any
    ChatConversation: any
}
const RootStack = createNativeStackNavigator<RootStackParamList>();

function AppRouter(): JSX.Element {
    useEffect(() => {
        versionApp()
    }, [])
    return (
        <>
            {/* <ComingSoonScreen /> */}
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                <RootStack.Screen name={HOME_SCREEN} options={{ headerShown: false }} component={TabScreen} />
                <RootStack.Screen name={MY_PROFILE} options={{ headerShown: false }} component={ProfileScreen} />
                <RootStack.Screen name={MYCART_SCREEN} options={{ headerShown: false }} component={MyCartScreen} />
                <RootStack.Screen name={NOTIFICATION_SCREEN} options={{ headerShown: false }} component={NotifcationScreen} />
                <RootStack.Screen name={CHECKOUT_SCREEN} options={{ headerShown: false }} component={CheckOutScreen} />
                <RootStack.Screen name={PAYMENT_SUCCESS_SCREEN} options={{ headerShown: false }} component={PaymentSuccessScreen} />
                <RootStack.Screen name={PRODUCT_SCREEN} options={{ headerShown: false }} component={ProductScreen} />
                <RootStack.Screen name={ORDER_SCREEN} options={{ headerShown: false }} component={MyOrders} />
                <RootStack.Screen name={SHIPPING_ADDRESS_SCREEN} options={{ headerShown: false }} component={ShippingAddressScreen} />
                <RootStack.Screen name={ADD_PAYMENT_SCREEN} options={{ headerShown: false }} component={AddPaymentScreen} />
                <RootStack.Screen name={PROFILE_SETTING_SCREEN} options={{ headerShown: false }} component={ProfileSettingScreen} />
                <RootStack.Screen name={ADD_NEW_SHIPPING_SCREEN} options={{ headerShown: false }} component={AddNewShipping} />
                <RootStack.Screen name={MENUBAR_SCREEN} options={{ headerShown: false }} component={MenuBarScreen} />
                <RootStack.Screen name={SELECTED_CROP_SCREEN} options={{ headerShown: false }} component={SelectedCropScreen} />
                <RootStack.Screen name={CROP_MAP_SCREEN} options={{ headerShown: false }} component={CropMapScreen} />
                <RootStack.Screen name={ORDER_DETAIL_SCREEN} options={{ headerShown: false }} component={OrderDetailScreen} />
                <RootStack.Screen name={PROMO_CODE_SCREEN} options={{ headerShown: false }} component={PromoCodeScreen} />
                <RootStack.Screen name={MY_REWARD_SCREEN} options={{ headerShown: false }} component={MyRewards} />
                <RootStack.Screen name={KRISHI_CHARCHA_SCREEN} options={{ headerShown: false }} component={KrishiCharchaScreen} />
                <RootStack.Screen name={POST_DETAILS_SCREEN} options={{ headerShown: false }} component={PostDetailsScreen} />
                <RootStack.Screen name={CREATE_POST_SCREEN} options={{ headerShown: false }} component={CreatePostScreen} />
                <RootStack.Screen name={OFFER_SCREEN} options={{ headerShown: false }} component={OfferScreen} />
                <RootStack.Screen name={LUCKY_DRAW_WINNERS_SCREEN} options={{ headerShown: false }} component={LuckyDrawWinnersScreen} />
                <RootStack.Screen name={LUCKY_DRAW_PDF_VIEWER_SCREEN} options={{ headerShown: false }} component={LuckyDrawPDFViewerScreen} />
                <RootStack.Screen name={CHAT_SCREEN} options={{ headerShown: false }} component={ChatScreen} />
                <RootStack.Screen name={CHAT_CONVERSATION_SCREEN} options={{ headerShown: false }} component={ChatConversationScreen} />
            </RootStack.Navigator >
        </>
    );
}
export default AppRouter;