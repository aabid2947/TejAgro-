import React, { useEffect, useState, useTransition } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import { Image } from 'react-native';
import { PromoCodeStyle } from './PromoCodeStyle';
import PressableClick from '../../components/pressablebutton/PressableClick';
import { ActivityIndicator } from 'react-native';
import { BGRED, BLACK, GREY, MDBLUE, ORANGE, WHITE } from '../../shared/common-styles/colors';
import TopHeaderFixed from '../../components/headerview/TopHeaderFixed';
import { ProductListStyle } from '../productlist/ProductListStyle';
import { LoaderScreen } from '../../components/loaderview/LoaderScreen';
import NoRecordFound from '../../components/noRecordFound/NoRecordFound';
import { DashboardStyle } from '../dashboard/DashboardStyle';

import IconProfile from '../../svg/IconProfile';
import { getDateFormat, PressableB } from '../../shared/components/CommonUtilities';
import AuthApi from '../../api/AuthApi';
import TimeIcon from '../../svg/TimeIcon';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { jwtDecode } from 'jwt-decode';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { selectedPromoCode } from '../../reduxToolkit/counterSlice';
import moment from 'moment';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import { useTranslation } from 'react-i18next';
import { MYCART_SCREEN } from '../../routes/Routes';

const voucher = [
    { id: 1, "code": "EFJG1234", "detail": "Apply only for one person", "expire": "26 oct 2025" },
    { id: 2, "code": "ASED7575", "detail": "get 50% off", "expire": "26 oct 2024" },
    { id: 3, "code": "HRTED456", "detail": "get 30% off", "expire": "26 Jan 2025" },
    { id: 4, "code": "VDEDEE73", "detail": "get upto 500 off", "expire": "26 Feb 2025" }
]

export const SLIDER_WIDTH = Dimensions.get('window').width + 45;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
export const ITEM_HEIGHT = Dimensions.get('window').width + 0;
export const PromoCodeScreen = ({ navigation, route }: any) => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const [selectedOption, setSelectedOption]: any = useState(null);
    const [selectedPromo, setSelectedPromo]: any = useState(null);
    const [promoCodeList, setPromoCodeList] = useState([]);
    const [isLoader, setLoader] = useState(false);
    const { width } = useWindowDimensions();
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [show, setShow] = useState(-1);
    const [shouldShow, setShouldShow] = useState(-1);
    const [itemIndex, setItemIndex] = React.useState(0);
    const userData: any = useSelector((state: RootState) => state.counter.isUserinfo)
    const [errorMsg, setErrorMsg] = useState("");
    const dispatch = useDispatch()
    const decodeToken = (token: string) => {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.log('Error decoding JWT token:', error);
            return null;
        }
    };

    const token = userData?.jwt;
    const decodedToken: any = decodeToken(token);

    useEffect(() => {
        getPromoCodes();
        return () => {
            setLoader(false)
        }
    }, [])

    const ClaimPromoCode = async (value: any) => {
        if (!isLoader) {
            try {
                const payload = {
                    "client_id": decodedToken?.data?.client_id,
                    "promo_code": value?.promo_code
                }
                setLoader(true);
                const response = await AuthApi.updatePromoCode(payload);
                setLoader(false);
                if (response?.data?.status === true) {
                    const discountVal = Number(value.discount) || 0;
                    const totalAmt = Number(response?.data?.total_amount) || 0;

                    let calculatedDeduction = 0;
                    if (value.discount_type === 'Percentage') {
                        calculatedDeduction = (totalAmt * discountVal) / 100;
                    } else {
                        calculatedDeduction = discountVal;
                    }

                    const correctFinalAmount = (totalAmt - calculatedDeduction).toFixed(2);
                    dispatch(selectedPromoCode({
                        ...value,
                        ...response?.data,
                        promo_code_discount: String(calculatedDeduction),
                        final_amount: correctFinalAmount,
                    }));
                    navigation.navigate(MYCART_SCREEN, { showPromoCodePopup: true })
                    // navigation.goBack()                    
                } else {
                    ToastAndroid.show(response?.data?.message || 'Code Not Found', ToastAndroid.SHORT);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const getPromoCodes = async () => {
        try {
            setLoader(true);
            const { grand_total, wallet_amt, promocode_amt, remaining_amt } = route?.params || {};
            const res = await AuthApi.getPromoCodeList({ grand_total, wallet_amt, promocode_amt, remaining_amt });
            console.log(res)
            setLoader(false);
            if(res?.data?.status === false) {
                ToastAndroid.show(res?.data?.message || 'No Promo Codes Available', ToastAndroid.SHORT);
                return
            }
            if (res?.data) {
                const demo = [{
            "promo_code_id": "1",
            "promo_code": "1STPURCHASE500",
            "promo_code_title": "Welcome Offer",
            "promo_code_description": "Get 10% off on your first purchase",
            "start_date": "2026-02-24 00:00:00",
            "end_date": "2026-05-31 00:00:00",
            "discount_type": "Percentage",
            "discount": "50",
        }];
                setPromoCodeList(res?.data)
            }
        } catch (error) {
            setLoader(false);
        }
    }

    const onGoBack = () => {
        navigation.goBack();
    }
    const CkeckDisabled = (item: any) => {
        if (item?.isPercentage == 0) {
            if ((!item.resetClaim?.active || (10 < item?.percentageAmount))) {
                return { opacity: 0.5 };
            } else {
                return { opacity: 1 };
            }
        } else {
            if (!item.resetClaim?.active) {
                return { opacity: 0.5 };
            }
            return { opacity: 1 };
        }
    }

    const onSnapToItem = (itemIndex: any) => {
        setItemIndex(itemIndex);
    }

    const activeSearchData = filteredData.filter((item: any) => item.isClaim == true)

    const existSearchData = filteredData.filter((item: any) => item.isClaim == false)

    const handleFilter = (value: any) => {
        setSearchText(value);
        const newFilter = promoCodeList.filter((x: any) => {
            return x?.promo_code?.toLowerCase().includes(value.toLowerCase());
        });
        setFilteredData(newFilter);
    };

    const applyDisabledUseNow = (item: any) => {
        if (item?.voucherTypeId == 2) {
            if (!item.nonPick?.active) {
                return true;
            } else {
                return false;
            }
        }
        if (item.resetAvail?.active) {
            return false;
        } else {
            return true;
        }
    }
    const applyDisabledApply = (item: any) => {
        if (item.resetClaim?.active) {
            return false;
        } else {
            return true;
        }
    }
    const checkNonPickMessage = (item: any) => {
        if (item?.nonPick?.message) {
            return true;
        } else {
            return false;
        }
    }
    const handleSelect = (id: any) => {
        setSelectedOption(id)
    };
    const handleSelectPromo = (id: any) => {
        setSelectedPromo(id)
    };

    return (
        <SafeAreaView style={{ ...ProductListStyle.main, paddingTop: insets.top }}>
            <TopHeaderFixed
                leftIconSize={20}
                headerTxt={t('PROMO_CODE')}
                gobackText={true}
                onGoBack={() => navigation.goBack()}
                topHeight={100} />
            {
                isLoader ? <LoaderScreen /> :
                    <ScrollView>
                        {
                            promoCodeList.length == 0 ?
                                <View>
                                    <NoRecordFound style={DashboardStyle.noDataTxt} />
                                </View> :
                                <React.Fragment>
                                    <View>
                                        {promoCodeList.length != 0 && (
                                            (promoCodeList || []).map((item: any, index: any) => {
                                                return (
                                                    <View key={index} style={styles.cardWrapper}>

                                                        {/* ── Left orange sidebar with rotated promo code ── */}
                                                        <View style={styles.leftSidebar}>
                                                            <Text style={styles.rotatedCode} numberOfLines={1}>
                                                                {item.promo_code}
                                                            </Text>
                                                        </View>

                                                        {/* ── Dashed vertical separator ── */}
                                                        <View style={styles.dashedDivider} />

                                                        {/* ── Right: all content ── */}
                                                        <View style={styles.rightContent}>

                                                            {/* Discount amount — primary info, big and orange */}
                                                            <TextPoppinsSemiBold style={styles.discountText}>
                                                                {item.discount_type === 'Amount'
                                                                    ? `₹${item.discount || '0'} OFF`
                                                                    : `${item.discount || '0'}% OFF`}
                                                            </TextPoppinsSemiBold>

                                                            {/* Title — secondary info */}
                                                            {!!item.promo_code_title && (
                                                                <TextPoppinsSemiBold style={styles.titleText} numberOfLines={1}>
                                                                    {item.promo_code_title}
                                                                </TextPoppinsSemiBold>
                                                            )}

                                                            {/* Description */}
                                                            {!!item.promo_code_description && (
                                                                <Text style={styles.descText} numberOfLines={2}>
                                                                    {item.promo_code_description}
                                                                </Text>
                                                            )}

                                                            {/* Footer row: expiry left, apply button right */}
                                                            <View style={styles.footerRow}>
                                                                <Text style={styles.expiryText}>
                                                                    Valid upto {getDateFormat(item.end_date)}
                                                                </Text>
                                                                <Pressable
                                                                    onPress={() => ClaimPromoCode(item)}
                                                                    style={({ pressed }) => [
                                                                        styles.applyBtn,
                                                                        pressed && { opacity: 0.75 }
                                                                    ]}
                                                                >
                                                                    <TextPoppinsSemiBold style={styles.applyBtnText}>
                                                                        Apply
                                                                    </TextPoppinsSemiBold>
                                                                </Pressable>
                                                            </View>

                                                        </View>
                                                    </View>
                                                )
                                            })
                                        )}
                                    </View>
                                </React.Fragment>
                        }
                    </ScrollView>
            }
        </SafeAreaView >
    )
}
export default PromoCodeScreen;

const styles = StyleSheet.create({
    // ── Card ──────────────────────────────────────────────────
    cardWrapper: {
        marginHorizontal: 16,
        marginVertical: 8,
        flexDirection: 'row',
        elevation: 4,
        backgroundColor: WHITE,
        borderRadius: 12,
        overflow: 'hidden',
        minHeight: 110,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },

    // ── Left orange sidebar ────────────────────────────────────
    leftSidebar: {
        width: 44,
        backgroundColor: ORANGE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rotatedCode: {
        color: WHITE,
        fontSize: 8,
        fontWeight: '700',
        letterSpacing: 1.2,
        transform: [{ rotate: '-90deg' }],
        width: 100,
        textAlign: 'center',
    },

    // ── Dashed divider ─────────────────────────────────────────
    dashedDivider: {
        width: 1,
        borderLeftWidth: 1,
        borderColor: ORANGE,
        borderStyle: 'dashed',
        marginVertical: 10,
    },

    // ── Right content ──────────────────────────────────────────
    rightContent: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 12,
        justifyContent: 'space-between',
    },
    discountText: {
        fontSize: 20,
        color: ORANGE,
        lineHeight: 26,
    },
    titleText: {
        fontSize: 13,
        color: BLACK,
        lineHeight: 20,
        marginTop: 2,
    },
    descText: {
        fontSize: 12,
        color: GREY,
        lineHeight: 17,
        marginTop: 4,
    },

    // ── Footer ─────────────────────────────────────────────────
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    expiryText: {
        fontSize: 11,
        color: GREY,
        lineHeight: 16,
    },
    applyBtn: {
        backgroundColor: ORANGE,
        paddingHorizontal: 18,
        paddingVertical: 5,
        borderRadius: 20,
    },
    applyBtnText: {
        color: WHITE,
        fontSize: 13,
    },

    // ── Legacy styles (kept as-is) ─────────────────────────────
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: ORANGE,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedCircle: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: ORANGE,
    },
    optionText: {
        fontSize: 18,
        color: BLACK,
        lineHeight: 22
    },
    labelText: {
        fontSize: 14,
        lineHeight: 20,
        color: BLACK,
    },
});