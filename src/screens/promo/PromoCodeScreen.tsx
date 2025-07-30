import React, { useEffect, useState, useTransition } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
export const PromoCodeScreen = ({ navigation }: any) => {
    const { t } = useTranslation()
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
                    dispatch(selectedPromoCode({ ...value, ...response?.data }));
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
            const res = await AuthApi.getPromoCodeList();
            console.log(res)
            setLoader(false);
            if(res?.data?.status === false) {
                ToastAndroid.show(res?.data?.message || 'No Promo Codes Available', ToastAndroid.SHORT);
                return
            }
            if (res?.data) {
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
        <SafeAreaView style={ProductListStyle.main}>
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
                                                    <View style={{
                                                        marginHorizontal: 20, flex: 1, flexDirection: "row", elevation: 4, backgroundColor: WHITE, borderRadius: 8, marginVertical: 10, padding: 10, paddingBottom: -10
                                                    }} key={index}>
                                                        <View style={{
                                                            flexDirection: "row",
                                                            borderWidth: 1,
                                                            backgroundColor: WHITE,
                                                            width: widthPercentageToDP(35),
                                                            height: 130,
                                                            borderColor: ORANGE,
                                                            marginVertical: 15,
                                                            borderRadius: 18,
                                                            zIndex: 999,
                                                        }} key={index}>
                                                            <View style={{
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                width: "20%",
                                                                backgroundColor: ORANGE,
                                                                borderTopLeftRadius: 12,
                                                                borderBottomLeftRadius: 12
                                                            }}>
                                                                <Text style={{
                                                                    color: WHITE,
                                                                    fontSize: 14,
                                                                    transform: [{ rotate: '-90deg' }],
                                                                    width: 200,
                                                                    textAlign: "center",
                                                                    position: 'absolute',
                                                                }}>{item.promo_code}</Text>
                                                            </View>
                                                            <View style={{
                                                                justifyContent: "space-around",
                                                                width: "70%",
                                                                // left: "15%",
                                                                flexDirection: "column"
                                                            }}>
                                                                <View>
                                                                    <TextPoppinsSemiBold style={{ fontSize: 18, lineHeight: 30, alignSelf: "center", color: BLACK, }} >{item.discount || "0"}% OFF</TextPoppinsSemiBold>
                                                                    <TextPoppinsSemiBold style={{ fontSize: 14, lineHeight: 22, alignSelf: "center", color: GREY, left: 5 }} >Valid upto {getDateFormat(item.end_date)}</TextPoppinsSemiBold>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={{
                                                            flexDirection: "row",
                                                            backgroundColor: WHITE,
                                                            width: widthPercentageToDP(50),
                                                            height: 150,
                                                            marginVertical: 15,
                                                            // zIndex: 999,
                                                        }}>
                                                            <View style={{ width: "65%" }}>
                                                                <TextPoppinsSemiBold style={{ fontSize: 16, lineHeight: 24, color: ORANGE, left: 10 }} >{item.promo_code_title || ""}</TextPoppinsSemiBold>
                                                                <TextPoppinsSemiBold style={{ fontSize: 12, lineHeight: 20, color: GREY, left: 10 }}>{item.promo_code_description || ""}</TextPoppinsSemiBold>
                                                                <Pressable onPress={() =>
                                                                    ClaimPromoCode(item)
                                                                }>
                                                                    <TextPoppinsSemiBold style={PromoCodeStyle.textApply} >Apply</TextPoppinsSemiBold>
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
