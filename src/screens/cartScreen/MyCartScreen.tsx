import { useFocusEffect } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import AuthApi from '../../api/AuthApi';
import AlertModal from '../../components/alertmodal/AlertModal';
import ConfirmModal from '../../components/alertmodal/ConfirmModal';
import { CartItemView } from '../../components/commonComponent/CartItemView';
import { SubtotalCart } from '../../components/commonComponent/SubtotalCart';
import TopHeaderFixed from '../../components/headerview/TopHeaderFixed';
import { LoaderScreen } from '../../components/loaderview/LoaderScreen';
import { RootState } from '../../reduxToolkit/store';
import { ADD_NEW_SHIPPING_SCREEN, CHECKOUT_SCREEN, PROMO_CODE_SCREEN, SHIPPING_ADDRESS_SCREEN } from '../../routes/Routes';
import { BGRED, BLACK, LIGHT_SILVER, MDBLUE, ORANGE, WHITE } from '../../shared/common-styles/colors';
import { PressableB } from '../../shared/components/CommonUtilities';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import ArrowIcon from '../../svg/ArrowIcon';
import TimeIcon from '../../svg/TimeIcon';
import { MyOrdersStyle } from '../orders/MyOrdersStyle';
import { PromoCodeStyle } from '../promo/PromoCodeStyle';
import { MyCartStyle } from './MyCartStyle';
import { useTranslation } from 'react-i18next';
import { clearSelectedPromoCode, profileDetail, selectedPromoCode, setTotalItems, walletDetails, setOrderPlaced, setReferralCode } from '../../reduxToolkit/counterSlice';
import CartSvg from '../../svg/CartSvg';
// import CheckBox from '@react-native-community/checkbox';
import { CheckBox } from 'react-native-elements';
import UnCheckbox from '../../svg/UnCheckbox';
import CheckBoxSvg from '../../svg/CheckboxSvg';
import ConfirmOrderModal from '../../components/alertmodal/ConfirmOrderModal';
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CHAT_SCREEN } from '../../routes/Routes';

interface WalletBoxProps {
    walletOpening: number;
    minOrderValue: number;
    totalCartPrice: number;
}

interface WalletInfo {
    min_order_value: number;
    status: number;
    wallet_max_amount: number;
    wallet_opening: number;
}

const MyCartScreen = ({ navigation, route }: any) => {
    const { t, i18n } = useTranslation()
    const isUserData = useSelector((state: RootState) => state.counter.isUserinfo)
    const selectedShippingAddress: any = useSelector((state: RootState) => state.counter.selectAddress)
    const selectedPromoCodeValue: any = useSelector((state: RootState) => state.counter.promoCodeId)
    const profileInfo: any = useSelector((state: RootState) => state.counter.isProfileInfo)
    console.log("ll",profileInfo)
    const orderPlaced = useSelector((state: RootState) => state.counter.orderPlaced)
    const referredUserReferralCode = useSelector((state: RootState) => state.counter.referred_user_referral_code)
    const [isLoader, setLoader] = useState(true);
    const [cartData, setCartData] = useState<any[]>([]);
    const [refresh, setRefresh] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [promoModalVisible, setPromoModalVisible] = useState(false);
    const [promoCodeApplied, setPromoCodeApplied] = useState(false);
    const walletInfo = useSelector((state: RootState) => state.counter.wallet) as WalletInfo;
    const [isChecked, setIsChecked] = useState(false); // Track checkbox state
    const [isLoading, setIsLoading] = useState(false);
    const [totalCartPrice, settotalCartPrice] = useState(0)
    const [walletUsed, setWalletUsed] = useState<any>(null)
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [referralCodeInput, setReferralCodeInput] = useState('');
    const [orderHistory, setOrderHistory] = useState<any[]>([]);
    const [hasOrders, setHasOrders] = useState(false);
    const [showReferralField, setShowReferralField] = useState(false);
    const insets = useSafeAreaInsets();

    const dispatch = useDispatch()
    const calculateTotalItems = () => {
        return cartData.reduce((total: number, item: any) => total + Number(item.quantity), 0);
    };
    let totalItemsCount = calculateTotalItems()
       useEffect(() => {
//    console.log("e",profileInfo?.min_order_value)
    }, []);
    useEffect(() => {
        dispatch(setTotalItems(totalItemsCount));
    }, [cartData, dispatch]);
    useFocusEffect(
        useCallback(() => {
            getCartDetail()
            getProfile();
            getOrderHistory();
        }, [])
    );
    useEffect(() => {
        if ((Object.keys(selectedPromoCodeValue).length > 0)) {
            const timer = setTimeout(() => {
                setPromoModalVisible(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
        setIsChecked(false);
        setWalletUsed(null);
       
    }, [selectedPromoCodeValue]);
    const getProfile = async () => {
        try {
            const resp = await AuthApi.getProfileDetails();
            if (resp && resp.data) {
                dispatch(profileDetail(resp?.data));
            } else {
                console.log("Error: getProfileDetails response is empty.");
            }
        } catch (error) {

        }

    }

    const getOrderHistory = async () => {
        const payload = {
            "client_id": decodedToken?.data?.client_id
        }
        try {
            const response = await AuthApi.orderHistory(payload);
            console.log('Order History Response:', response?.data);
            const orders = response?.data || [];
            setOrderHistory(orders);
            
            // Check if user has any delivered orders
            const hasDeliveredOrders = orders.some((order: any) => 
                order.status && order.status.toLowerCase() === 'delivered'
            );
            
            // Show referral field only if:
            // 1. User has no orders at all, OR
            // 2. User has orders but none with 'delivered' status
            // AND referral code exists in Redux
            const shouldShowReferral = !hasDeliveredOrders && !!referredUserReferralCode;
            
            setHasOrders(orders.length > 0);
            setShowReferralField(shouldShowReferral);
            
            if (shouldShowReferral) {
                setReferralCodeInput(referredUserReferralCode);
            } else {
                setReferralCodeInput('');
            }
        } catch (error: any) {
            console.log('Error fetching order history:', error);
            setOrderHistory([]);
            setHasOrders(false);
            
            // If API fails, show referral field only if referral code exists
            const shouldShowReferral = !!referredUserReferralCode;
            setShowReferralField(shouldShowReferral);
            
            if (shouldShowReferral) {
                setReferralCodeInput(referredUserReferralCode);
            } else {
                setReferralCodeInput('');
            }
        }
    }

    const onRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false)
            getCartDetail()
            getOrderHistory()
        }, 1000)
    }
    const decodeToken = (token: string) => {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.log('Error decoding JWT token:', error);
            return null;
        }
    };

    const token = isUserData?.jwt;
    const decodedToken: any = decodeToken(token);

    const incrementQuantity = async (itemId: any) => {
        setPromoCodeApplied(false);
        removeCode();
        const updatedCartData = cartData.map((item: any) => {
            if (item.cart_id === itemId) {
                const newQuantity = Number(item.quantity) + 1;
                const newTotalPrice = (Number(item.total_amount) * newQuantity).toFixed(2);
                updateCartItemQuantity(item?.cart_id, item?.product_id, newQuantity);
                return { ...item, quantity: newQuantity, totalPrice: newTotalPrice };
            }
            return item;
        });
        setCartData(updatedCartData);
    };

    const decrementQuantity = async (itemId: any) => {
        setPromoCodeApplied(false);
        removeCode();
        const item = cartData.find((item: any) => item.cart_id === itemId);
        if (item && Number(item.quantity) === 1) {
            try {
                const payload = { "cart_id": itemId };
               
                const response = await AuthApi.removeCartItem(payload,token);
                if (response && response.data) {
                    setCartData(cartData.filter((item: any) => item.cart_id !== itemId));
                    ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
                    getCartDetail();
                }
            } catch (error: any) {
                ToastAndroid.show(error?.response?.data?.message || 'Error removing item from cart', ToastAndroid.SHORT);
            }
        } else {
            const updatedCartData = cartData.map((item: any) => {
                if (item.cart_id === itemId) {
                    const newQuantity = Number(item.quantity) - 1;
                    const newTotalPrice = (Number(item.total_amount) * newQuantity).toFixed(2);
                    updateCartItemQuantity(item?.cart_id, item?.product_id, newQuantity);
                    return { ...item, quantity: newQuantity, totalPrice: newTotalPrice };
                }
                return item;
            });
            setCartData(updatedCartData);
        }
    };

    const calculateTotalPriceGST = () => {
        const total = cartData.reduce((acc: any, item: any) => {
            const itemTotal = Number(item.total_amount);
            const itemGST = Number(item.gst_amount);
            let final = (((acc + itemTotal) * (100 - Number(selectedPromoCodeValue?.promo_code_discount))) / 100);
            return final;
        }, 0);
        return total.toFixed(2);
    };
    let totalCartPriceGST = calculateTotalPriceGST();
    const calculateTotalGST = () => {
        const totalGST = cartData.reduce((acc: any, item: any) => {
            return acc + Number(item.gst_amount);
        }, 0);
        return totalGST.toFixed(2);
    };

    let totalGSTAmount = calculateTotalGST();
    const onCancel = () => {
        setModalVisible(false);
    };

    const getAddresses = async () => {
        const payload = {
            "client_id": decodedToken?.data?.client_id
        }
        try {
            setLoader(true);
            const response = await AuthApi.getShppingAddress(payload);
            if (response && response.data) {
                if (response.data.length > 0) {
                    navigation.navigate(SHIPPING_ADDRESS_SCREEN, { cartData, totalCartPrice, totalCartPriceGST })
                } else {
                    navigation.navigate(ADD_NEW_SHIPPING_SCREEN)
                }
            }
            setLoader(false);
        } catch (error: any) {
            setLoader(false);
        }
    };
    const onProceed = async () => {

        await getAddresses();

    }

    useEffect(() => {
        if (selectedPromoCodeValue && Object.keys(selectedPromoCodeValue).length > 0 && route?.params?.showPromoCodePopup) {
            setPromoModalVisible(true);
            setPromoCodeApplied(true)
        }

    }, [selectedPromoCodeValue, route?.params?.showPromoCodePopup]);

    const closePromoModal = () => {
        setPromoModalVisible(false);
    };
    useEffect(() => {
        const calculateTotalPrice = () => {
            const total = cartData.reduce((acc: any, item: any) => {
                return acc + Number(item.total_amount);
            }, 0);

            return total.toFixed(2);
        };

        let totalCartPrice = calculateTotalPrice();
        settotalCartPrice(totalCartPrice)


    }, [cartData]);
    useEffect(() => {
        getCartDetail()
        getProfile()
        getOrderHistory()
    }, [])
    
    // Watch for changes in referred_user_referral_code from Redux
    useEffect(() => {
        // Check if user has any delivered orders
        const hasDeliveredOrders = orderHistory.some((order: any) => 
            order.status && order.status.toLowerCase() === 'delivered'
        );
        
        // Show referral field only if:
        // 1. User has no delivered orders AND
        // 2. Referral code exists in Redux
        const shouldShowReferral = !hasDeliveredOrders && !!referredUserReferralCode;
        
        setShowReferralField(shouldShowReferral);
        
        if (shouldShowReferral) {
            setReferralCodeInput(referredUserReferralCode);
        } else {
            setReferralCodeInput('');
        }
    }, [referredUserReferralCode, orderHistory])
    const getCartDetail = async () => {
        const payload = {
            "client_id": decodedToken?.data?.client_id
        };
        try {
            setLoader(true);

    
    // Add a small delay to see logs clearly
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await AuthApi.getCartDetails(payload, token);
            // const walletData = await AuthApi.getWalletDetails({},token)
            if (response && response.data && response.data.length > 0) {
                setCartData(response.data);
            } else {
                setCartData([]);
            }
            // dispatch(walletDetails(walletData.data token|| []));
        } catch (error: any) {
            console.info('Error fetching cart details:', error);
            setCartData([]);
            const d: any = [];
            dispatch(walletDetails(d));
        } finally {
            setLoader(false);
        }
    };

    const onApply = () => {
        removeCode();
        setPromoCodeApplied(true);
        navigation.navigate(PROMO_CODE_SCREEN)
    }
    const updateCartItemQuantity = async (itemId: any, productId: any, quantity: number) => {
        try {
           const response= await AuthApi.updateCart({ cart_id: itemId, product_id: productId, quantity: quantity },token);
        
            getCartDetail();
        } catch (error) {
            console.log('Failed to update quantity on backend', error);
        }
    };
    const checkOutOnPress = () => {
        if (!selectedShippingAddress || Object.keys(selectedShippingAddress).length === 0) {
            setModalVisible(true);
        } else {
            navigation.navigate(CHECKOUT_SCREEN, { 
                cartData, 
                totalCartPrice, 
                promo: selectedPromoCodeValue?.promo_code_discount, 
                totalCartPriceGST: totalCartPrice, 
                walletUsed,
                referralCode: showReferralField ? referralCodeInput.trim() : '' // Pass referral code from Redux if user has no orders
            });
        }
    };
    const removeCode = () => {
        setPromoCodeApplied(false)
        dispatch(clearSelectedPromoCode());
    }

    const WalletBox: React.FC<WalletBoxProps> = ({ walletOpening, minOrderValue, totalCartPrice }) => {
        const isCheckboxEnabled = minOrderValue <= totalCartPrice;
        // console.log("e",isCheckboxEnabled)

        const payload = {
            "client_id": decodedToken?.data?.client_id,
            "grand_total": totalCartPrice,
        };

        const handleCheckboxChange = async (newValue: boolean) => {
            try {
                if (!isCheckboxEnabled) return; // Do nothing if checkbox is disabled

                setIsChecked(newValue);

                setWalletUsed(null)

                if (newValue) {
                    setIsLoading(true); // Show loader
                    const response = await AuthApi.useWallet(payload);
                    console.log("API Response::::", response.data);
                    setIsLoading(false); // Show loader
                    if (response.data?.status) {
                        // totalCartPrice = response.data.grand_amount;
                        setWalletUsed(response.data)
                        // grandTotal = response.data.grand_amount
                        console.log("grandTotal after checked : : ", response.data.grand_amount);
                    }
                }

            } catch (error) {
                console.log("API Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <View style={styles.walletBox}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#FBAB32" />
                ) : (
                    <>
                        <CheckBox
                            disabled={!isCheckboxEnabled || isLoading} // Disable checkbox while loading
                            checked={isChecked}
                            onPress={() => handleCheckboxChange(!isChecked)}
                            checkedIcon={<CheckBoxSvg />}
                            uncheckedIcon={<UnCheckbox fill={isCheckboxEnabled ? undefined : LIGHT_SILVER} />}
                            title={<Text style={[styles.walletOpening]}>
                                {`  ${t("WALLET")} ₹ ${walletOpening}`}
                            </Text>}
                        />
                        <Text style={styles.minOrderValue}>
                            {`${t("MIN_ORDER")}₹ ${minOrderValue}`}
                        </Text>
                    </>
                )}
            </View>
        );
    };

    const OrderSummaryComponent = () => {
        const totalAmount = selectedPromoCodeValue?.total_amount || totalCartPrice;
        const finalAmount = walletUsed?.use_wallet_amount > 0 ? walletUsed?.grand_amount : (selectedPromoCodeValue?.final_amount || totalCartPrice);
        const promoCodeDiscount = selectedPromoCodeValue?.promo_code_discount || 0;
        
        return (
            <View style={cartStyles.orderSummaryContainer}>
                <View style={cartStyles.orderSummaryHeader}>
                    <TextPoppinsSemiBold style={cartStyles.orderSummaryTitle}>
                        {t('Order_Summary')}
                    </TextPoppinsSemiBold>
                </View>
                <View style={cartStyles.orderSummaryCard}>
                    <View style={cartStyles.orderSummaryRow}>
                        <Text style={cartStyles.summaryLabel}>{t('PRICE')}</Text>
                        <Text style={cartStyles.summaryValue}>₹{totalAmount}</Text>
                    </View>
                    
                    {promoCodeDiscount > 0 && (
                        <View style={cartStyles.orderSummaryRow}>
                            <Text style={cartStyles.summaryLabel}>{t('PROMO_CODE_DISCOUNT')}</Text>
                            <Text style={[cartStyles.summaryValue, cartStyles.discountValue]}>-₹{promoCodeDiscount}</Text>
                        </View>
                    )}
                    
                    {walletUsed?.use_wallet_amount > 0 && (
                        <View style={cartStyles.orderSummaryRow}>
                            <Text style={cartStyles.summaryLabel}>{t('WALLET_DISCOUNT')}</Text>
                            <Text style={[cartStyles.summaryValue, cartStyles.walletValue]}>-₹{walletUsed?.use_wallet_amount}</Text>
                        </View>
                    )}
                    
                    <View style={cartStyles.orderSummaryRow}>
                        <Text style={cartStyles.summaryLabel}>{t('Delivery_Charge')}</Text>
                        <Text style={[cartStyles.summaryValue, cartStyles.freeValue]}>{t('FREE')}</Text>
                    </View>
                    
                    <View style={cartStyles.dividerLine} />
                    
                    <View style={[cartStyles.orderSummaryRow, cartStyles.totalRow]}>
                        <Text style={cartStyles.totalLabel}>{t('TOTAL')}</Text>
                        <TextPoppinsSemiBold style={cartStyles.totalValue}>₹{finalAmount}</TextPoppinsSemiBold>
                    </View>
                    
                    <Text style={cartStyles.taxIncludedText}>
                        देय रक्कमध्ये जीएसटी व अन्य कराचा समावेश
                    </Text>
                </View>
            </View>
        );
    };

    const listFooterComponent = () => {
        return (
            <>
                {/* Compact Options Container */}
                <View style={styles.compactOptionsContainer}>
                    {/* Promo Code Section */}
                    {(!selectedPromoCodeValue || Object.keys(selectedPromoCodeValue).length === 0) ? (
                        <Pressable style={styles.compactPromoBox} onPress={onApply}>
                            <View style={styles.compactPromoContent}>
                                <TimeIcon width={20} height={20} color="#EE2324" />
                                <TextPoppinsSemiBold style={styles.compactPromoText}>
                                    {t("APPLY_PROMO")}
                                </TextPoppinsSemiBold>
                                <ArrowIcon width={14} height={16} color="#FFF" />
                            </View>
                        </Pressable>
                    ) : (
                        <View style={styles.compactAppliedPromoBox}>
                            <TextPoppinsSemiBold style={styles.compactAppliedPromoText} numberOfLines={1}>
                                {selectedPromoCodeValue?.promo_code}
                            </TextPoppinsSemiBold>
                            <Pressable onPress={() => removeCode()}>
                                <Text style={styles.compactRemoveText}>×</Text>
                            </Pressable>
                        </View>
                    )}

                    {/* Referral Code Section - Only show if user has no orders and referral code exists in Redux */}
                    {showReferralField && (
                        <View style={styles.compactReferralBox}>
                            <Text style={styles.referralTitle}>{t("REFERRAL_CODE")}</Text>
                            <View style={[styles.compactReferralInputContainer, { backgroundColor: '#f0f0f0' }]}>
                                <TextInput
                                    style={[styles.compactReferralInput, { color: '#666' }]}
                                    placeholder={t("REFERRAL_CODE")}
                                    value={referralCodeInput}
                                    editable={false} // Make it non-editable
                                    autoCapitalize="characters"
                                    maxLength={10}
                                    placeholderTextColor="#999"
                                />
                            </View>
                            {/* <Text style={styles.referralHelpText}>
                                {t("AUTO_FILLED_REFERRAL_MESSAGE") || "Referral code auto-filled from login"}
                            </Text> */}
                        </View>
                    )}

                    {/* Wallet Section */}
                    {cartData.length > 0 && Number(profileInfo?.my_wallet) > 0 && (
                        <View style={styles.compactWalletBox}>
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#FBAB32" />
                            ) : (
                                <CheckBox
                                    disabled={!(profileInfo?.min_order_value <= Number(selectedPromoCodeValue?.final_amount || totalCartPrice)) || isLoading}
                                    checked={isChecked}
                                    onPress={() => {
                                        const newValue = !isChecked;
                                        const isCheckboxEnabled = profileInfo?.min_order_value <= Number(selectedPromoCodeValue?.final_amount || totalCartPrice);
                                        
                                        if (!isCheckboxEnabled) return;

                                        setIsChecked(newValue);
                                        setWalletUsed(null);

                                        if (newValue) {
                                            setIsLoading(true);
                                            const payload = {
                                                "client_id": decodedToken?.data?.client_id,
                                                "grand_total": Number(selectedPromoCodeValue?.final_amount || totalCartPrice),
                                            };
                                            
                                            AuthApi.useWallet(payload).then(response => {
                                                setIsLoading(false);
                                                if (response.data?.status) {
                                                    setWalletUsed(response.data);
                                                }
                                            }).catch(error => {
                                                console.log("API Error:", error);
                                                setIsLoading(false);
                                            });
                                        }
                                    }}
                                    checkedIcon={<CheckBoxSvg />}
                                    uncheckedIcon={<UnCheckbox fill={!(profileInfo?.min_order_value <= Number(selectedPromoCodeValue?.final_amount || totalCartPrice)) ? LIGHT_SILVER : undefined} />}
                                    title={<Text style={styles.compactWalletText}>
                                        {`${t("WALLET")} ₹${profileInfo?.my_wallet}`}
                                    </Text>}
                                    containerStyle={styles.compactWalletCheckboxContainer}
                                    textStyle={styles.compactWalletTextStyle}
                                />
                            )}
                        </View>
                    )}
                </View>

                <OrderSummaryComponent />
            </>
        )
    }
    useEffect(() => {
        if (orderPlaced) {
            setIsConfirmModalVisible(true);
            setTimeout(() => {
                setIsConfirmModalVisible(false);
                dispatch(setOrderPlaced(false));
            }, 2000);
        }
    }, [orderPlaced]);

    const onShopMore = () => {
        navigation.navigate('Product');
    };

   const ShopMoreComponent = () => (
    <TouchableOpacity
        onPress={onShopMore}
        style={{
            backgroundColor: MDBLUE,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <TextPoppinsSemiBold style={{ color: BLACK, fontSize: 14, lineHeight: 24 }}>
            {t('SHOP_MORE')}
        </TextPoppinsSemiBold>
    </TouchableOpacity>
);

    return (
        <SafeAreaView style={{ ...MyCartStyle.container, paddingTop: insets.top ,paddingBottom:insets.bottom}} >
            <TopHeaderFixed
                leftIconSize={20}
                headerTxt={t("MY_CART")}
                topHeight={100}
                rightComponent={<ShopMoreComponent />}
           
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {isLoader ?
                    <LoaderScreen /> :
                    <>
                        <FlatList
                            data={cartData}
                            renderItem={({ item, index }: any) => <CartItemView item={item} decrementQuantity={decrementQuantity} incrementQuantity={incrementQuantity} index={index} />}
                            keyExtractor={(item: any) => item.cart_id}
                            ListEmptyComponent={
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '50%' }}>
                                    <CartSvg width={100} height={100} />
                                    <Text style={{ marginTop: 20, fontSize: 18, color: '#777' }}>
                                        {t('cart_empty')}
                                    </Text>
                                </View>
                            }
                            showsVerticalScrollIndicator={false}
                            refreshing={refresh}
                            ListFooterComponent={cartData.length > 0 ? listFooterComponent : null}
                            onRefresh={onRefresh}
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="interactive"
                        />
                    </>
                }
            </KeyboardAvoidingView>
            {/* My wallet code */}
            {/* {cartData.length > 0 && (
                <WalletBox
                    walletOpening={walletOpening}
                    minOrderValue={minOrderValue}
                    totalCartPrice={totalCartPrice}
                />
            )} */}
            {cartData.length > 0 && PressableB(`${t("CHECKOUT")}`, checkOutOnPress)}
            <AlertModal modalVisible={modalVisible} setModalVisible={setModalVisible}
                firstLineContent="Please select shipping address"
                btn="Proceed"
                no={"Cancel"}
                btnCancel={"Cancel"}
                onProceed={() => onProceed()}
                onCancel={() => onCancel()}
                closeIcon={true}
            />
            {promoModalVisible && (
                <ConfirmModal
                    modalVisible={promoModalVisible}
                    onClose={closePromoModal}
                />
            )}
            <ConfirmOrderModal
                modalVisible={isConfirmModalVisible}
                onClose={() => {
                    setIsConfirmModalVisible(false);
                    dispatch(setOrderPlaced(false));
                }}
            />
        </SafeAreaView>
    );
};

export default MyCartScreen;

const styles = StyleSheet.create({
    optionContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        marginBottom: 10,
    },
    optionText: {
        fontSize: 15,
        color: BLACK,
        lineHeight: 22,
        top: 5
    },
    labelText: {
        fontSize: 14,
        lineHeight: 20,
        color: BLACK,
    },
    walletBox: {
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: 10,
        padding: 10,
        backgroundColor: WHITE,
        borderRadius: 8,
        elevation: 3,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
    },
    walletInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletOpening: {
        fontSize: 16,
        color: BLACK,
        marginLeft: 0,
        fontWeight: "bold"
    },
    disabledText: {
        color: '#888',
    },
    minOrderValue: {
        fontSize: 12,
        color: '#888',
        marginTop: 0,
        marginLeft: 8
        
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
        fontWeight: "bold"
    },
    referralBox: {
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: 10,
        padding: 16,
        backgroundColor: WHITE,
        borderRadius: 8,
        elevation: 3,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
    },
    referralTitle: {
        fontSize: 16,
        color: BLACK,
        marginBottom: 12,
        fontWeight: "600"
    },
    referralInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        marginBottom: 8,
    },
    referralInput: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 14,
        fontSize: 16,
        color: BLACK,
        fontFamily: 'Poppins-Medium',
    },
    clearButton: {
        paddingHorizontal: 12,
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonText: {
        fontSize: 20,
        color: '#999',
        fontWeight: 'bold',
    },
    referralHelpText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
    },
    // New compact styles
    compactOptionsContainer: {
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 10,
        backgroundColor: WHITE,
        borderRadius: 8,
        elevation: 3,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        padding: 12,
    },
    compactPromoBox: {
        flexDirection: "row",
        backgroundColor: '#f8f9fa',
        borderRadius: 6,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden',
    },
    compactPromoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 10,
        flex: 1,
    },
    compactPromoText: {
        fontSize: 13,
        color: BLACK,
        flex: 1,
        marginLeft: 8,
    },
    compactAppliedPromoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#e8f5e8',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    compactAppliedPromoText: {
        fontSize: 13,
        color: '#2E7D32',
        fontWeight: '600',
        flex: 1,
    },
    compactRemoveText: {
        fontSize: 18,
        color: BGRED,
        fontWeight: 'bold',
        paddingHorizontal: 5,
    },
    compactReferralBox: {
        marginBottom: 8,
    },
    compactReferralInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        backgroundColor: '#f9f9f9',
        height: 40,
    },
    compactReferralInput: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 13,
        color: BLACK,
        fontFamily: 'Poppins-Medium',
    },
    compactClearButton: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    compactClearButtonText: {
        fontSize: 16,
        color: '#999',
        fontWeight: 'bold',
    },
    compactWalletBox: {
        backgroundColor: '#f8f9fa',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    compactWalletCheckboxContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        margin: 0,
    },
    compactWalletText: {
        fontSize: 13,
        color: BLACK,
        fontWeight: '600',
        marginLeft: 5,
    },
    compactWalletTextStyle: {
        fontSize: 13,
        color: BLACK,
        fontWeight: '600',
    },
});

const cartStyles = StyleSheet.create({
    orderSummaryContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: 10,
        elevation: 3,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        borderRadius: 8,
    },
    orderSummaryHeader: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    orderSummaryTitle: {
        paddingTop:2,
        fontSize: 16,
        color: BLACK,
        fontWeight: '600',
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
});