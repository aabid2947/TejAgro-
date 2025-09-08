import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { jwtDecode } from "jwt-decode"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Pressable, SafeAreaView, StyleSheet, Text, ToastAndroid, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useDispatch, useSelector } from "react-redux"
import AuthApi from "../../api/AuthApi"
import { SubtotalCart } from "../../components/commonComponent/SubtotalCart"
import TopHeaderFixed from "../../components/headerview/TopHeaderFixed"
import { LoaderScreen } from "../../components/loaderview/LoaderScreen"
import { clearSelectedPromoCode, setOrderPlaced, setTotalItems } from "../../reduxToolkit/counterSlice"
import { RootState } from "../../reduxToolkit/store"
import { RootStackParamList } from "../../routes/AppRouter"
import { ADD_NEW_SHIPPING_SCREEN, HOME_SCREEN, MY_PROFILE, PAYMENT_SUCCESS_SCREEN, SHIPPING_ADDRESS_SCREEN } from "../../routes/Routes"
import { BLACK, GRAY_BORDER, ORANGE } from "../../shared/common-styles/colors"
import { PressableB, titleViewIcon } from "../../shared/components/CommonUtilities"
import TextPoppinsSemiBold from "../../shared/fontFamily/TextPoppinsSemiBold"
import EditIcon from "../../svg/EditIcon"
import { processEasebuzzPayment } from "../../utility/PaymentUtility"
import { MyOrdersStyle } from "../orders/MyOrdersStyle"
import { CheckOutStyle } from "./CheckOutStyle"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const CheckOutScreen = (props: any) => {
    const { totalCartPrice, walletUsed } = props?.route?.params || {};
    const item = props?.route?.params?.cartData

    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets()
    const selectedShippingAddress: any = useSelector((state: RootState) => state.counter.selectAddress)
    const selectedPromoCode: any = useSelector((state: RootState) => state.counter.promoCodeId)
    const isUserData: any = useSelector((state: RootState) => state.counter.isUserinfo);
    const profileInfo: any = useSelector((state: RootState) => state.counter.isProfileInfo)

    const [isLoader, setLoader] = useState(false);
    const [isLoaderSubmit, setLoaderSubmit] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const isShipping = true

    const finalAmount = walletUsed?.use_wallet_amount > 0 ? walletUsed?.grand_amount : selectedPromoCode?.final_amount || totalCartPrice;
    const totalAmount = selectedPromoCode?.total_amount || totalCartPrice;
    const promoCodeDiscount = selectedPromoCode?.promo_code_discount || 0;
 
    const decodeToken = (token: string) => {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    };

    const token = isUserData?.jwt || "";
    const decodedToken: any = decodeToken(token);

    const handlePaymentSelection = (method: string) => {
        setPaymentMethod(method);
    };

    /**
     * Places the final order after payment verification or for COD.
     * Navigates to PaymentSuccessScreen for online payments.
     */
    const handleOrderPlacement = async (
        isPaid: boolean,
        paymentResponse?: any,
        transactionId?: string,
        paymentId?: string
    ) => {
        const payload = {
            client_id: decodedToken?.data?.client_id,
            promo_code_id: (Object.keys(selectedPromoCode).length > 0) ? selectedPromoCode?.promo_code_id : "",
            use_wallet_amount: walletUsed?.use_wallet_amount || "",
            promo_code_amount: selectedPromoCode?.promo_code_discount || "0",
            shipping_address_id: selectedShippingAddress.shipping_addres_id || "",
            payment_method: paymentMethod,
            payment_status: isPaid ? "paid" : "pending",
            payment_response: paymentResponse ? JSON.stringify(paymentResponse) : "",
            product_details: item.map((cartItem: any) => ({
                product_id: cartItem?.product_id,
                mrp: cartItem?.mrp || "0",
                quantity: cartItem?.quantity || "1",
                discount_percent: cartItem?.discount_percent || "0",
                discount_amount: cartItem?.discount_amount || "0",
                gst_percent: cartItem?.gst_percent || "0",
                gst_amount: cartItem?.gst_amount || "0",
                total_amount: cartItem?.total_amount || "0"
            })),
            transaction_id: transactionId || "",
            pi_no: paymentId || "" // Changed from payment_id to pi_no
        };
        console.log("Order Payload:", payload);

        try {
            setLoaderSubmit(true);
            const response = await AuthApi.confirmOrder(payload);
            console.log("Order Confirmation Response:", response);

            if (response && response?.data && response?.data?.status !== false) {
                // Clear cart and promo code for successful orders
                dispatch(clearSelectedPromoCode());
                dispatch(setTotalItems(0));
                
                if (isPaid) {
                    // Navigate to success screen for online payments
                    navigation.navigate(PAYMENT_SUCCESS_SCREEN, {
                        paymentResponse: paymentResponse,
                        orderId: response.data.order_id || transactionId, 
                        amount: paymentResponse.amount,
                        paymentMethod: paymentMethod
                    });
                } else {
                    // Handle COD success
                    ToastAndroid.show(t("Order_Placed"), ToastAndroid.SHORT);
                    dispatch(setOrderPlaced(true));
                    navigation.navigate(HOME_SCREEN);
                }
            } else {
                // Handle API errors
                const errorMessage = response?.data?.message || response?.data?.error || "Order placement failed. Please try again.";
                throw new Error(errorMessage);
            }
        } catch (error: any) {
            console.error("Order Placement Error:", error);
            // Show specific error message from API or generic fallback
            const errorMessage = error?.response?.data?.message || 
                                error?.response?.data?.error || 
                                error.message || 
                                'Order placement failed';
            ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        } finally {
            setLoaderSubmit(false);
        }
    };

    /**
     * Handles the entire online payment flow:
     * 1. Initiates payment with the backend.
     * 2. Opens the payment gateway.
     * 3. Verifies the payment with a custom webhook.
     * 4. Places the order upon successful verification.
     */
    const handleEasebuzzPayment = async () => {
        try {
            setLoaderSubmit(true);

            // --- STEP 1: INITIATE PAYMENT ---
            const initiatePayload = {
                client_id: decodedToken?.data?.client_id,
                grand_total: finalAmount
            };

            const initiateResponse = await AuthApi.initiatePayment(initiatePayload);
            if (!initiateResponse?.data?.status || !initiateResponse?.data?.accessKey) {
                throw new Error(initiateResponse?.data?.message || "Failed to initiate payment. Please try again.");
            }
            console.log(initiateResponse.data)
            const { accessKey, payMode,hash } = initiateResponse.data;

            // --- STEP 2: PROCESS PAYMENT WITH SDK ---
            const paymentResult = await processEasebuzzPayment(accessKey, payMode || "test");
            if (!paymentResult.success || !paymentResult.payment_response) {
                throw new Error(paymentResult.error || "Payment failed or was cancelled.");
            }
            console.log("paymentResule",paymentResult)

            // --- STEP 3: CALL CUSTOM WEBHOOK FOR VERIFICATION ---
            const paymentDetails = paymentResult.payment_response;
            const webhookPayload = {
                status: paymentDetails.status,
                email: paymentDetails.email || profileInfo?.email,
                firstname: paymentDetails.firstname || profileInfo?.client_name?.split(' ')[0],
                productinfo: "Demo Product", // Static as per requirement
                amount: paymentDetails.amount,
                txnid: paymentDetails.txnid,
                key: accessKey,
                hash:paymentDetails.hash,
                client_id: decodedToken?.data?.client_id,
                easepayid: paymentDetails.easepayid

            };
            console.log("webhookPayload",webhookPayload)

            const webhookResponse = await AuthApi.webhookPayment(webhookPayload);
            // Check for successful response from webhook which must contain transaction_id
            if (!webhookResponse?.data?.transaction_id || !webhookResponse?.data?.payment_id) {
                throw new Error(webhookResponse?.data?.message || "Payment verification failed. Please contact support.");
            }
            const { transaction_id, payment_id } = webhookResponse.data;

            // --- STEP 4: PLACE ORDER ---
            await handleOrderPlacement(true, paymentResult.payment_response, transaction_id, payment_id);

        } catch (error: any) {
            console.error("Payment Process Error:", error);
            ToastAndroid.show(error.message || "An unexpected error occurred during payment.", ToastAndroid.LONG);
        } finally {
            // Loader is managed within handleOrderPlacement for the final step
            // but we turn it off here in case of early failure.
            setLoaderSubmit(false);
        }
    };


    const handleCashOnDelivery = () => {
        handleOrderPlacement(false);
    };

    const submitOnPress = () => {
        if (!selectedShippingAddress?.shipping_addres_id) {
            ToastAndroid.show("Please select a shipping address.", ToastAndroid.SHORT);
            return;
        }

        if (paymentMethod === "Online Payment") {
            handleEasebuzzPayment();
        } else {
            handleCashOnDelivery();
        }
    };

    const onPressPlus = () => {
        navigation.navigate(SHIPPING_ADDRESS_SCREEN)
    }

    const onPressEditAdd = () => {
        navigation.navigate(ADD_NEW_SHIPPING_SCREEN, { ...selectedShippingAddress, isShipping })
    }

    return (
        <SafeAreaView style={[CheckOutStyle.container, { paddingBottom: insets.bottom,paddingTop: insets.top }]}>
            <TopHeaderFixed
                leftIconSize={20}
                gobackText={t("CHECK")}
                topHeight={100}
                onGoBack={() => navigation.goBack()} />
            {isLoader ? (
                <LoaderScreen />
            ) : (
                <>
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                        {titleViewIcon(`${t("SHIPPING_ADDRESS")}`, onPressPlus)}
                        <View style={MyOrdersStyle.renderView}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexGrow: 1 }}>
                                    <TextPoppinsSemiBold style={MyOrdersStyle.titleStyle1}>{selectedShippingAddress?.full_name || "NA"}</TextPoppinsSemiBold>
                                </View>
                                {selectedShippingAddress?.shipping_addres_id && (
                                    <Pressable onPress={onPressEditAdd} >
                                        <EditIcon height={20} width={20} />
                                    </Pressable>
                                )}
                            </View>
                            <View style={MyOrdersStyle.dividerStyle} />
                            <TextPoppinsSemiBold style={styles.subTitle}>{selectedShippingAddress?.shipping_addres_id ? `${selectedShippingAddress?.address}, ${selectedShippingAddress?.city}, ${selectedShippingAddress?.district}, ${selectedShippingAddress?.country}- ${selectedShippingAddress?.zipcode} ` : "Please select an address"}</TextPoppinsSemiBold>
                        </View>
                    </KeyboardAwareScrollView>

                    <View style={MyOrdersStyle.renderView}>
                        {SubtotalCart(totalAmount, finalAmount, promoCodeDiscount, walletUsed?.use_wallet_amount)}
                    </View>

                    <View style={MyOrdersStyle.renderView}>
                        <TextPoppinsSemiBold style={styles.paymentTitle}>Payment Method</TextPoppinsSemiBold>
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
                        <View style={[styles.radioButtonContainer, { marginTop: 15 }]}>
                            <Pressable
                                style={styles.radioButton}
                                onPress={() => handlePaymentSelection("Online Payment")}
                            >
                                <View
                                    style={[
                                        styles.radioOuterCircle,
                                        paymentMethod === "Online Payment" && styles.radioOuterCircleSelected,
                                    ]}
                                >
                                    {paymentMethod === "Online Payment" && <View style={styles.radioInnerCircle} />}
                                </View>
                                <TextPoppinsSemiBold style={styles.radioText}>Online Payment</TextPoppinsSemiBold>
                            </Pressable>
                        </View>
                    </View>

                    {PressableB(
                        isLoaderSubmit ? `${t("LOADING")}` :
                            paymentMethod === "Online Payment" ? `${t("Pay_Now")} (₹${finalAmount})` : `${t("SUBMIT_ORDER")}`,
                        submitOnPress,
                        isLoaderSubmit
                    )}
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
    paymentTitle: {
        fontSize: 16,
        lineHeight: 22,
        color: BLACK,
        marginBottom: 15
    },
    radioButtonContainer: {
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