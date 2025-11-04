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
    const { totalCartPrice, walletUsed, referralCode } = props?.route?.params || {};
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
        // Ensure the user's profile has a name before placing an order
        if (!profileInfo?.client_name || String(profileInfo.client_name).trim().length === 0) {
            ToastAndroid.show("Set name first", ToastAndroid.SHORT);
            navigation.navigate(MY_PROFILE);
            return;
        }

        const payload = {
            client_id: decodedToken?.data?.client_id,
            promo_code_id: (Object.keys(selectedPromoCode).length > 0) ? selectedPromoCode?.promo_code_id : "",
            use_wallet_amount: walletUsed?.use_wallet_amount || "",
            promo_code_amount: selectedPromoCode?.promo_code_discount || "0",
            shipping_address_id: selectedShippingAddress.shipping_addres_id || "",
            payment_method: paymentMethod,
            payment_status: isPaid ? "paid" : "pending",
            payment_response: paymentResponse ? JSON.stringify(paymentResponse) : "",
            referral_code: referralCode || "",
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
            payment_id: paymentId || "" // Changed from payment_id to payment_id
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
                    console.log(paymentResponse)
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
        let paymentResult: any = null;
        let accessKey: string = "";
        // Ensure the user's profile has a name before initiating online payment
        if (!profileInfo?.client_name || String(profileInfo.client_name).trim().length === 0) {
            ToastAndroid.show("Set name first", ToastAndroid.SHORT);
            navigation.navigate(MY_PROFILE);
            return;
        }

        try {
            setLoaderSubmit(true);

            // --- STEP 1: INITIATE PAYMENT ---
            const initiatePayload = {
                client_id: decodedToken?.data?.client_id,
                grand_total: finalAmount
            };
            console.log("Initiate Payment Payload:", initiatePayload);

            const initiateResponse = await AuthApi.initiatePayment(initiatePayload);
            if (!initiateResponse?.data?.status || !initiateResponse?.data?.accessKey) {
                throw new Error(initiateResponse?.data?.message || "Failed to initiate payment. Please try again.");
            }
            console.log(initiateResponse.data);
            const { payMode, hash } = initiateResponse.data;
            accessKey = initiateResponse.data.accessKey;

            // --- STEP 2: PROCESS PAYMENT WITH SDK ---
            paymentResult = await processEasebuzzPayment(accessKey, payMode || "test");
            if (!paymentResult.success || !paymentResult.payment_response) {
                throw new Error(paymentResult.error || "Payment failed or was cancelled.");
            }

            // --- STEP 3: CALL CUSTOM WEBHOOK FOR VERIFICATION ---
            await processWebhookAndPlaceOrder(paymentResult, accessKey);

        } catch (error: any) {
            console.error("Payment Process Error:", error);
            
            // Handle case where payment was successful but there was an error in processing
            if (error?.error === "Transaction is successful." && paymentResult && accessKey) {
                try {
                    await processWebhookAndPlaceOrder(paymentResult, accessKey);
                    return; // Exit successfully
                } catch (retryError: any) {
                    console.error("Retry Error:", retryError);
                    ToastAndroid.show(retryError.message || "Payment verification failed. Please contact support.", ToastAndroid.LONG);
                    return;
                }
            }
            
            ToastAndroid.show(error.message || "An unexpected error occurred during payment.", ToastAndroid.LONG);
        } finally {
            // Loader is managed within handleOrderPlacement for the final step
            // but we turn it off here in case of early failure.
            setLoaderSubmit(false);
        }
    };

    // Helper function to process webhook and place order
    const processWebhookAndPlaceOrder = async (paymentResult: any, accessKey: string) => {
        const paymentDetails = paymentResult.payment_response;
        const webhookPayload = {
            status: paymentDetails.status,
            email: paymentDetails.email || profileInfo?.email,
            firstname: paymentDetails.firstname || profileInfo?.client_name?.split(' ')[0],
            productinfo: "Demo Product", // Static as per requirement
            amount: paymentDetails.amount,
            txnid: paymentDetails.txnid,
            key: accessKey,
            hash: paymentDetails.hash,
            client_id: decodedToken?.data?.client_id,
            easepayid: paymentDetails.easepayid
        };
        console.log("webhookPayload", webhookPayload);

        const webhookResponse = await AuthApi.webhookPayment(webhookPayload);
        // Check for successful response from webhook which must contain transaction_id
        if (!webhookResponse?.data?.transaction_id || !webhookResponse?.data?.payment_id) {
            throw new Error(webhookResponse?.data?.message || "Payment verification failed. Please contact support.");
        }
        const { transaction_id, payment_id } = webhookResponse.data;

        // --- STEP 4: PLACE ORDER ---
        await handleOrderPlacement(true, paymentResult.payment_response, transaction_id, payment_id);
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
        <SafeAreaView style={[CheckOutStyle.container, { paddingBottom: insets.bottom, paddingTop: insets.top }]}>
            <TopHeaderFixed
                leftIconSize={20}
                gobackText={t("CHECK")}
                topHeight={100}
                onGoBack={() => navigation.goBack()} />
            {isLoader ? (
                <LoaderScreen />
            ) : (
                <>
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
                        {/* Shipping Address Section */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleContainer}>
                                    <View style={styles.sectionNumberBadge}>
                                        <Text style={styles.sectionNumber}>1</Text>
                                    </View>
                                    <TextPoppinsSemiBold style={styles.sectionTitle}>
                                        {t("SHIPPING_ADDRESS")}
                                    </TextPoppinsSemiBold>
                                </View>
                                {selectedShippingAddress?.shipping_addres_id ? (
                                    <Pressable onPress={onPressEditAdd} style={styles.changeButton}>
                                        <Text style={styles.changeButtonText}>CHANGE</Text>
                                    </Pressable>
                                ) : (
                                    <Pressable onPress={onPressPlus} style={styles.addButton}>
                                        <Text style={styles.addButtonText}>ADD</Text>
                                    </Pressable>
                                )}
                            </View>

                            <View style={styles.addressContainer}>
                                {selectedShippingAddress?.shipping_addres_id ? (
                                    <>
                                        <TextPoppinsSemiBold style={styles.customerName}>
                                            {selectedShippingAddress?.full_name || "NA"}
                                        </TextPoppinsSemiBold>
                                        <Text style={styles.addressText}>
                                            {`${selectedShippingAddress?.address}, ${selectedShippingAddress?.city}, ${selectedShippingAddress?.district}, ${selectedShippingAddress?.country} - ${selectedShippingAddress?.zipcode}`}
                                        </Text>
                                        <View style={styles.addressBadge}>
                                            <Text style={styles.addressBadgeText}>HOME</Text>
                                        </View>
                                    </>
                                ) : (
                                    <View style={styles.noAddressContainer}>
                                        <Text style={styles.noAddressText}>Please select a delivery address</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Payment Method Section */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleContainer}>
                                    <View style={styles.sectionNumberBadge}>
                                        <Text style={styles.sectionNumber}>2</Text>
                                    </View>
                                    <TextPoppinsSemiBold style={styles.sectionTitle}>
                                        Payment Method
                                    </TextPoppinsSemiBold>
                                </View>
                            </View>

                            <View style={styles.paymentMethodContainer}>
                                <Pressable
                                    style={[
                                        styles.paymentOption,
                                        paymentMethod === "Online Payment" && styles.selectedPaymentOption
                                    ]}
                                    onPress={() => handlePaymentSelection("Online Payment")}
                                >
                                    <View style={styles.paymentOptionContent}>
                                        <View
                                            style={[
                                                styles.radioOuterCircle,
                                                paymentMethod === "Online Payment" && styles.radioOuterCircleSelected,
                                            ]}
                                        >
                                            {paymentMethod === "Online Payment" && <View style={styles.radioInnerCircle} />}
                                        </View>
                                        <View style={styles.paymentMethodInfo}>
                                            <TextPoppinsSemiBold style={styles.paymentMethodTitle}>
                                                Online Payment
                                            </TextPoppinsSemiBold>
                                            <Text style={styles.paymentMethodSubtitle}>
                                                UPI, Cards, Netbanking & More
                                            </Text>
                                        </View>
                                    </View>
                                    {paymentMethod === "Online Payment" && (
                                        <View style={styles.recommendedBadge}>
                                            <Text style={styles.recommendedText}>RECOMMENDED</Text>
                                        </View>
                                    )}
                                </Pressable>

                                <Pressable
                                    style={[
                                        styles.paymentOption,
                                        paymentMethod === "Cash on Delivery" && styles.selectedPaymentOption
                                    ]}
                                    onPress={() => handlePaymentSelection("Cash on Delivery")}
                                >
                                    <View style={styles.paymentOptionContent}>
                                        <View
                                            style={[
                                                styles.radioOuterCircle,
                                                paymentMethod === "Cash on Delivery" && styles.radioOuterCircleSelected,
                                            ]}
                                        >
                                            {paymentMethod === "Cash on Delivery" && <View style={styles.radioInnerCircle} />}
                                        </View>
                                        <View style={styles.paymentMethodInfo}>
                                            <TextPoppinsSemiBold style={styles.paymentMethodTitle}>
                                                Cash on Delivery
                                            </TextPoppinsSemiBold>
                                            <Text style={styles.paymentMethodSubtitle}>
                                                Pay when you receive
                                            </Text>
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                        </View>

                        {/* Order Summary Section */}
                        <View style={[styles.sectionContainer, styles.orderSummaryContainer]}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionTitleContainer}>
                                    <View style={styles.sectionNumberBadge}>
                                        <Text style={styles.sectionNumber}>3</Text>
                                    </View>
                                    <TextPoppinsSemiBold style={styles.sectionTitle}>
                                      Bill Details
                                    </TextPoppinsSemiBold>
                                </View>
                            </View>
                            <View style={styles.orderSummaryCard}>
                                <View style={styles.orderSummaryRow}>
                                    <Text style={styles.summaryLabel}>{t('PRICE')}</Text>
                                    <Text style={styles.summaryValue}>₹{totalAmount}</Text>
                                </View>
                                
                                {promoCodeDiscount > 0 && (
                                    <View style={styles.orderSummaryRow}>
                                        <Text style={styles.summaryLabel}>{t('PROMO_CODE_DISCOUNT')}</Text>
                                        <Text style={[styles.summaryValue, styles.discountValue]}>-₹{promoCodeDiscount}</Text>
                                    </View>
                                )}
                                
                                {walletUsed?.use_wallet_amount > 0 && (
                                    <View style={styles.orderSummaryRow}>
                                        <Text style={styles.summaryLabel}>{t('WALLET_DISCOUNT')}</Text>
                                        <Text style={[styles.summaryValue, styles.walletValue]}>-₹{walletUsed?.use_wallet_amount}</Text>
                                    </View>
                                 )} 
                                
                                <View style={styles.orderSummaryRow}>
                                    <Text style={styles.summaryLabel}>{t('Delivery_Charge')}</Text>
                                    <Text style={[styles.summaryValue, styles.freeValue]}>{t('FREE')}</Text>
                                </View>
                                
                                <View style={styles.dividerLine} />
                                
                                <View style={[styles.orderSummaryRow, styles.totalRow]}>
                                    <Text style={styles.totalLabel}>{t('TOTAL')}</Text>
                                    <TextPoppinsSemiBold style={styles.totalValue}>₹{finalAmount}</TextPoppinsSemiBold>
                                </View>
                                
                                <Text style={styles.taxIncludedText}>
                                    देय रक्कमध्ये जीएसटी व अन्य कराचा समावेश
                                </Text>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>

                    {/* Fixed Bottom Section */}
                    <View style={styles.bottomContainer}>
                        <View style={styles.totalContainer}>
                            {promoCodeDiscount > 0 && (
                                <Text style={styles.savingsText}>You save ₹{promoCodeDiscount}</Text>
                            )}
                        </View>
                        {PressableB(
                            isLoaderSubmit ? `${t("LOADING")}` :
                                paymentMethod === "Online Payment" ? `${t("Pay_Now")} (₹${finalAmount})` : `${t("SUBMIT_ORDER")}`,
                            submitOnPress,
                            isLoaderSubmit
                        )}
                    </View>
                </>
            )}
        </SafeAreaView>
    )
}

export default CheckOutScreen

export const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    sectionContainer: {
        backgroundColor: '#fff',
        marginBottom: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionNumberBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: ORANGE,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sectionNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    sectionTitle: {
        paddingTop: 2,
        fontSize: 16,
        color: BLACK,
        fontWeight: '600',
    },
    changeButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: ORANGE,
        borderRadius: 4,
    },
    changeButtonText: {
        fontSize: 12,
        color: ORANGE,
        fontWeight: '600',
    },
    addButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: ORANGE,
        borderRadius: 4,
    },
    addButtonText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    addressContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    customerName: {
        fontSize: 16,
        color: BLACK,
        marginBottom: 6,
    },
    addressText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 10,
    },
    addressBadge: {
        backgroundColor: '#e8f5e8',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    addressBadgeText: {
        fontSize: 12,
        color: '#2e7d2e',
        fontWeight: '600',
    },
    noAddressContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    noAddressText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
    paymentMethodContainer: {
        paddingVertical: 8,
    },
    paymentOption: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        position: 'relative',
    },
    selectedPaymentOption: {
        backgroundColor: '#fff8f0',
        borderLeftWidth: 3,
        borderLeftColor: ORANGE,
    },
    paymentOptionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuterCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
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
    paymentMethodInfo: {
        flex: 1,
    },
    paymentMethodTitle: {
        fontSize: 16,
        color: BLACK,
        marginBottom: 2,
    },
    paymentMethodSubtitle: {
        fontSize: 13,
        color: '#666',
    },
    recommendedBadge: {
        position: 'absolute',
        top: 8,
        right: 16,
        backgroundColor: ORANGE,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
    },
    recommendedText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
    },
    orderSummaryContainer: {
        marginBottom: 100, // Space for fixed bottom section
    },
    orderSummaryCard: {
        margin: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    orderSummaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    summaryLabel: {
        fontSize: 15,
        color: '#4CAF50',
        flex: 1,
    },
    summaryValue: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
        textAlign: 'right',
    },
    discountValue: {
        color: '#4CAF50',
    },
    walletValue: {
        color: '#4CAF50',
    },
    freeValue: {
        color: '#4CAF50',
    },
    dividerLine: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 8,
        borderStyle: 'dashed',
    },
    totalRow: {
        paddingTop: 4,
        paddingBottom: 8,
    },
    totalLabel: {
        fontSize: 16,
        color: BLACK,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        color: BLACK,
        fontWeight: 'bold',
    },
    taxIncludedText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 16,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    totalContainer: {
        marginBottom: 12,
    },
    savingsText: {
        fontSize: 13,
        color: '#4CAF50',
        textAlign: 'right',
        fontWeight: '500',
    },
})