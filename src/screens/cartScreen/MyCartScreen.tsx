import { useFocusEffect } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
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
import { clearSelectedPromoCode, profileDetail, selectedPromoCode, setTotalItems, walletDetails, setOrderPlaced } from '../../reduxToolkit/counterSlice';
import CartSvg from '../../svg/CartSvg';
// import CheckBox from '@react-native-community/checkbox';
import { CheckBox } from 'react-native-elements';
import UnCheckbox from '../../svg/UnCheckbox';
import CheckBoxSvg from '../../svg/CheckboxSvg';
import ConfirmOrderModal from '../../components/alertmodal/ConfirmOrderModal';


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
    const orderPlaced = useSelector((state: RootState) => state.counter.orderPlaced)
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


    const dispatch = useDispatch()
    const calculateTotalItems = () => {
        return cartData.reduce((total: number, item: any) => total + Number(item.quantity), 0);
    };
    let totalItemsCount = calculateTotalItems()
       useEffect(() => {
   console.log("e",profileInfo?.min_order_value)
    }, []);
    useEffect(() => {
        dispatch(setTotalItems(totalItemsCount));
    }, [cartData, dispatch]);
    useFocusEffect(
        useCallback(() => {
            getCartDetail()
            getProfile();
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

    const onRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false)
            getCartDetail()
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
               
                const response = await AuthApi.removeCartItem(payload);
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
    }, [])
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
           console.log(response)
            getCartDetail();
        } catch (error) {
            console.log('Failed to update quantity on backend', error);
        }
    };
    const checkOutOnPress = () => {
        if (!selectedShippingAddress || Object.keys(selectedShippingAddress).length === 0) {
            setModalVisible(true);
        } else {
            navigation.navigate(CHECKOUT_SCREEN, { cartData, totalCartPrice, promo: selectedPromoCodeValue?.promo_code_discount, totalCartPriceGST: totalCartPrice, walletUsed });
        }
    };
    const removeCode = () => {
        setPromoCodeApplied(false)
        dispatch(clearSelectedPromoCode());
    }

    const WalletBox: React.FC<WalletBoxProps> = ({ walletOpening, minOrderValue, totalCartPrice }) => {
        const isCheckboxEnabled = minOrderValue <= totalCartPrice;
        console.log("e",isCheckboxEnabled)

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

    const listFooterComponent = () => {
        return (
            <>
                {(!selectedPromoCodeValue || Object.keys(selectedPromoCodeValue).length === 0) ?
                    <>
                        {
                            <Pressable style={{ flexDirection: "row", elevation: 3, backgroundColor: WHITE, height: 60, borderRadius: 8, marginBottom: 10, marginTop: 20, marginHorizontal: 20, shadowColor: "#737373", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.6 }} onPress={onApply}>
                                <View style={{ justifyContent: "center", alignItems: "center", width: "15%" }}>
                                    <TimeIcon width={25} height={25} color="#EE2324" />
                                </View>
                                <View style={{ justifyContent: "center", alignSelf: "center", width: "70%" }}>
                                    <TextPoppinsSemiBold style={{ fontSize: 14, lineHeight: 24, color: BLACK }} numberOfLines={2}>
                                        {t("APPLY_PROMO")}
                                    </TextPoppinsSemiBold>
                                </View>
                                <View style={{ justifyContent: "center", alignItems: "center", width: "15%", backgroundColor: ORANGE, borderTopRightRadius: 10, borderBottomEndRadius: 10 }}>
                                    <ArrowIcon width={18} height={20} color="#FFF" />
                                </View>
                            </Pressable >
                        }
                    </> :
                    <View style={PromoCodeStyle.couponCard}>
                        <View style={styles.optionContainer}>
                            <View style={{ width: widthPercentageToDP(70) }}>
                                <TextPoppinsSemiBold style={styles.optionText}>
                                    {selectedPromoCodeValue?.promo_code || "No Promo Code Applied"}
                                </TextPoppinsSemiBold>
                            </View>
                            <Pressable onPress={() => removeCode()}>
                                <TextPoppinsSemiBold style={{ color: BGRED, top: 5 }}>
                                    Remove
                                </TextPoppinsSemiBold>
                            </Pressable>
                        </View>
                    </View>
                }
                {/* {cartData.length > 0 && walletInfo.min_order_value && Number(profileInfo?.my_wallet) > 0 && ( */}
                {cartData.length > 0 && Number(profileInfo?.my_wallet) > 0 && (

                    <WalletBox
                        walletOpening={profileInfo?.my_wallet}
                        minOrderValue={profileInfo?.min_order_value}
                        totalCartPrice={Number(selectedPromoCodeValue?.final_amount || totalCartPrice)}
                    />
                )}
                <View style={MyOrdersStyle.renderView2}>
                    {(!selectedPromoCodeValue || Object.keys(selectedPromoCodeValue).length === 0)
                        ? SubtotalCart(totalCartPrice, walletUsed?.use_wallet_amount > 0 ? walletUsed?.grand_amount : totalCartPrice, 0, walletUsed?.use_wallet_amount)
                        : SubtotalCart(selectedPromoCodeValue.total_amount,
                            walletUsed?.use_wallet_amount > 0 ? walletUsed?.grand_amount : selectedPromoCodeValue.final_amount,
                            selectedPromoCodeValue.promo_code_discount, walletUsed?.use_wallet_amount)}
                </View>
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
        <SafeAreaView style={MyCartStyle.container}>
            <TopHeaderFixed
                leftIconSize={20}
                headerTxt={t("MY_CART")}
                topHeight={100}
                rightComponent={<ShopMoreComponent />}
            />
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
                    />
                </>
            }
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
});