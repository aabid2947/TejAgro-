import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { jwtDecode } from "jwt-decode"
import { useState } from "react"
import { Pressable, SafeAreaView, StyleSheet, Text, ToastAndroid, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useDispatch, useSelector } from "react-redux"
import AuthApi from "../../api/AuthApi"
import { SubtotalCart } from "../../components/commonComponent/SubtotalCart"
import TopHeaderFixed from "../../components/headerview/TopHeaderFixed"
import { LoaderScreen } from "../../components/loaderview/LoaderScreen"
import { RootState } from "../../reduxToolkit/store"
import { RootStackParamList } from "../../routes/AppRouter"
import { ADD_NEW_SHIPPING_SCREEN, HOME_SCREEN, MY_PROFILE, ORDER_SCREEN, PRODUCT_SCREEN, SHIPPING_ADDRESS_SCREEN } from "../../routes/Routes"
import { BLACK, GRAY_BORDER, MDBLUE, ORANGE } from "../../shared/common-styles/colors"
import { PressableB, titleViewIcon } from "../../shared/components/CommonUtilities"
import { MyOrdersStyle } from "../orders/MyOrdersStyle"
import { CheckOutStyle } from "./CheckOutStyle"
import { clearSelectedPromoCode, setTotalItems } from "../../reduxToolkit/counterSlice"
import TextPoppinsSemiBold from "../../shared/fontFamily/TextPoppinsSemiBold"
import { useTranslation } from "react-i18next"
import EditIcon from "../../svg/EditIcon"
import React from "react"

const CheckOutScreen = (props: any) => {
    const { cartData, totalCartPrice, walletUsed } = props?.route?.params || {};

    const { t } = useTranslation();
    const navigation: any = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const selectedShippingAddress: any = useSelector((state: RootState) => state.counter.selectAddress)
    const selectedPromoCode: any = useSelector((state: RootState) => state.counter.promoCodeId)
    const isUserData: any = useSelector((state: RootState) => state.counter.isUserinfo);
    const profileInfo: any = useSelector((state: RootState) => state.counter.isProfileInfo)
    const [isLoader, setLoader] = useState(false);
    const [isLoaderSumit, setLoaderSubmit] = useState(false);
    const item = props?.route?.params?.cartData
    const dispatch = useDispatch();
    const isShipping = true
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    let totalAmount = selectedPromoCode?.total_amount || totalCartPrice;
    let finalAmount = walletUsed?.use_wallet_amount > 0 ? walletUsed?.grand_amount : selectedPromoCode?.final_amount || totalCartPrice;
    let promoCodeDiscount = selectedPromoCode?.promo_code_discount || 0;
    const handlePaymentSelection = (method: string) => {
        setPaymentMethod(method);
    };
    const decodeToken = (token: string) => {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.log('Error decoding JWT token:', error);
            return null;
        }
    };

    const token = isUserData?.jwt || "";
    const decodedToken: any = decodeToken(token);

    const submitOnPress = async () => {
        const payload = {
            client_id: decodedToken?.data?.client_id,
            promo_code_id: (Object.keys(selectedPromoCode).length > 0) ? selectedPromoCode?.promo_code_id : "",
            use_wallet_amount: walletUsed?.use_wallet_amount || "",
            promo_code_amount: selectedPromoCode?.promo_code_discount || "0",
            shipping_address_id: selectedShippingAddress.shipping_addres_id || "",
            product_details: item.map((cartItem: any) => ({
                product_id: cartItem?.product_id,
                mrp: cartItem?.mrp || "0",
                quantity: cartItem?.quantity || "1",
                discount_percent: cartItem?.discount_percent || "0",
                discount_amount: cartItem?.discount_amount || "0",
                gst_percent: cartItem?.gst_percent || "0",
                gst_amount: cartItem?.gst_amount || "0",
                total_amount: cartItem?.total_amount || "0"
            }))
        };
        try {
            setLoaderSubmit(true)
            console.log("Checkout screen payload : ", JSON.stringify(payload))
            const response = await AuthApi.confirmOrder(payload);
            setLoaderSubmit(false)
            console.log(response?.data, 'response0')
            if (response && response?.data?.message) {
                dispatch(clearSelectedPromoCode());
                dispatch(setTotalItems(0))
                if (!profileInfo?.client_name) {
                    ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
                    navigation.navigate(MY_PROFILE)
                } else {
                    ToastAndroid.show("Order placed !", ToastAndroid.SHORT);
                    navigation.navigate(HOME_SCREEN)
                }
            } else {
                ToastAndroid.show("Something went wrong...", ToastAndroid.SHORT);
            }
        } catch (error: any) {
            setLoaderSubmit(false)
            ToastAndroid.show(error?.response?.data?.message || 'Cart is empty', ToastAndroid.SHORT);
        }
    }

    const onPressPlus = () => {
        navigation.navigate(SHIPPING_ADDRESS_SCREEN)
    }

    const onPressEditAdd = () => {
        navigation.navigate(ADD_NEW_SHIPPING_SCREEN, selectedShippingAddress, isShipping)
    }
    return (
        <SafeAreaView style={CheckOutStyle.container}>
            <TopHeaderFixed
                leftIconSize={20}
                gobackText={t("CHECK")}
                topHeight={100}
                onGoBack={() => navigation.goBack()} />
            {isLoader ? (
                <LoaderScreen />
            ) :
                (
                    <>
                        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                            {titleViewIcon(`${t("SHIPPING_ADDRESS")}`, onPressPlus)}
                            <View style={MyOrdersStyle.renderView}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flexGrow: 1 }}>
                                        <TextPoppinsSemiBold style={MyOrdersStyle.titleStyle1}>{selectedShippingAddress?.full_name || "NA"}</TextPoppinsSemiBold>
                                    </View>
                                    <Pressable onPress={onPressEditAdd} >
                                        <EditIcon height={20} width={20} />
                                    </Pressable>
                                </View>
                                <View style={MyOrdersStyle.dividerStyle} />
                                <TextPoppinsSemiBold style={styles.subTitle}>{`${selectedShippingAddress?.address}, ${selectedShippingAddress?.city}, ${selectedShippingAddress?.district}, ${selectedShippingAddress?.country}- ${selectedShippingAddress?.zipcode} `}</TextPoppinsSemiBold>
                            </View>
                            {/* {titleViewIcon("Payment")}
                        {PaymentCart(CardLogo, "**** **** **** 8990")}
                        {titleViewIcon("Delivery method")}
                        {PaymentCart(CardLogo, "Fast(2-3days)")} */}
                        </KeyboardAwareScrollView>

                        <View style={MyOrdersStyle.renderView}>
                            {SubtotalCart(totalAmount, finalAmount, promoCodeDiscount, walletUsed?.use_wallet_amount)}
                        </View>
                        <View style={MyOrdersStyle.renderView}>
                            <View style={styles.radioButtonContainer}>
                                <Pressable
                                    style={styles.radioButton}
                                    onPress={() => handlePaymentSelection("Cash on Delivery")}
                                >
                                    <View
                                        style={[
                                            styles.radioOuterCircle,
                                            paymentMethod === "Cash on Delivery" && styles.radioOuterCircleSelected,
                                        ]}
                                    >
                                        {paymentMethod === "Cash on Delivery" && <View style={styles.radioInnerCircle} />}
                                    </View>
                                    <TextPoppinsSemiBold style={styles.radioText}>Cash on Delivery</TextPoppinsSemiBold>
                                </Pressable>
                            </View>
                        </View>
                        {PressableB(isLoaderSumit ? `${t("LOADING")}` : `${t("SUBMIT_ORDER")}`, submitOnPress, isLoaderSumit)}
                    </>
                )}
        </SafeAreaView>
    )
}

export default CheckOutScreen

export const styles = StyleSheet.create({
    subTitle: {
        fontSize: 14,
        lineHeight: 18,
        color: GRAY_BORDER
    },
    radioButtonContainer: {
        // marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    radioButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    radioOuterCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: GRAY_BORDER,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    radioOuterCircleSelected: {
        borderColor: ORANGE,
    },
    radioInnerCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: ORANGE,
    },
    radioText: {
        fontSize: 16,
        color: BLACK,
    },
})