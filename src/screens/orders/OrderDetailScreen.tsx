import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import TopHeaderFixed from '../../components/headerview/TopHeaderFixed';
import { RootStackParamList } from '../../routes/AppRouter';
import { BLACK, GREY, LIGHTGREY, MDBLUE, WHITE } from '../../shared/common-styles/colors';
import { ProductListStyle } from '../productlist/ProductListStyle';
import { ProductStyle } from '../productlist/ProductStyle';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import { calculateTotal, RenderItem } from '../../shared/components/CommonUtilities';
import { MyOrdersStyle } from './MyOrdersStyle';
import React from 'react';
import { useState } from 'react';
import { regexImage } from '../../shared/utilities/String';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OrderDetailScreen = ({ route }: any) => {
    const [imageError, setImageError] = useState(false);
    const insets = useSafeAreaInsets()

    const navigation: any = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { ordered_updated_data } = route.params;
    const { t } = useTranslation();
    const renderItem = (title: any, value: any) => {
        return (
            <TextPoppinsMediumBold style={style.itemTitle}>{title}: <TextPoppinsSemiBold style={style.itemTxt}>{value}</TextPoppinsSemiBold></TextPoppinsMediumBold>
        )
    }
    const formatAddress = (address: any) => {
        if (!address) return '';
        const regex = /(\d{5,})|([a-zA-Z\s]+)(?=\d+|$)/g;
        const parts = address.match(regex);
        return parts ? parts.join('\n') : address;
    };


    const renderOrders = (orderData: any) => {
        return (
            <>
                <RenderItem item={ordered_updated_data} />
                {orderData?.shipping_address ?
                    <>
                        <TextPoppinsMediumBold style={style.itemTitle}>{t('DELIVERY_ADDRESS')}:</TextPoppinsMediumBold>
                        <View style={style.cartItem1}>
                            <TextPoppinsMediumBold style={style.itemTitle1}>{formatAddress(orderData.shipping_address)}</TextPoppinsMediumBold>
                        </View>
                    </> : null
                }
                <TextPoppinsMediumBold style={style.itemTitle}>{t('Product_Details')}:</TextPoppinsMediumBold>

                {orderData?.order_details.map((item: any, index: any) => (
                    <View style={style.cartItem1} key={index}>
                        <View>
                            <Image
                                source={
                                    item?.product_image && regexImage.test(item?.product_image)
                                        ? { uri: item?.product_image }
                                        : require("../../assets/IconFertilizer.png")
                                }
                                style={style.productImage}
                                onError={() => setImageError(true)}
                            />
                        </View>
                        <View>
                            <View style={style.itemDetails}>
                                <TextPoppinsMediumBold style={style.itemTitle1}>{item.product_marathi_name ? item.product_marathi_name : item.product_name}</TextPoppinsMediumBold>
                            </View>
                            <TextPoppinsSemiBold style={{ ...MyOrdersStyle.titleStyle, color: GREY }}>{t('Quantity')}: <TextPoppinsSemiBold style={MyOrdersStyle.titleStyle}>{item?.quantity || "0"}</TextPoppinsSemiBold></TextPoppinsSemiBold>
                            <TextPoppinsSemiBold style={{ ...MyOrdersStyle.titleStyle, color: GREY }}>{t('PRICE')}: <TextPoppinsSemiBold style={MyOrdersStyle.titleStyle}>₹{item?.grand_amount || "0"}</TextPoppinsSemiBold></TextPoppinsSemiBold>
                        </View>

                    </View>
                ))}
            </>
        )
    }
    return (
        <SafeAreaView style={[ProductListStyle.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <TopHeaderFixed
                leftIconSize={20}
                headerTxt={t('ORDER_DETAIL')}
                gobackText={true}
                onGoBack={() => navigation.goBack()}
                topHeight={100} />

            <ScrollView style={{ marginHorizontal: 20 }}>
                {renderOrders(ordered_updated_data)}
            </ScrollView>
        </SafeAreaView>
    );
};

export default OrderDetailScreen;

const style = StyleSheet.create({
    couponCard: {
        elevation: 8,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        backgroundColor: WHITE,
        paddingVertical: 10,
        marginBottom: 15,
        borderRadius: 8,
        marginHorizontal: 5,
        paddingHorizontal: 15
    },
    itemTitle: {
        fontSize: 15,
        lineHeight: 30,
        color: GREY
    },
    itemTxt: {
        fontSize: 14,
        lineHeight: 26,
        color: BLACK,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginVertical: 8,
        elevation: 4,
        backgroundColor: WHITE,
        borderRadius: 10,
    },
    cartItem1: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginVertical: 8,
        elevation: 4,
        backgroundColor: WHITE,
        borderRadius: 10,
        margin: 2
    },
    productImage: {
        width: 60,
        height: 60,
        marginRight: 16,
    },
    itemDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 2,
    },
    itemTitle1: {
        fontSize: 14,
        lineHeight: 24,
        fontWeight: 'bold',
        color: GREY,
        marginBottom: 5,
        marginLeft: -3
    },
    itemVolume: {
        fontSize: 14,
        color: '#666',
    },
    itemPrice: {
        fontSize: 16,
        color: BLACK,
        alignSelf: 'flex-end',
        lineHeight: 22
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 5
    },
    quantityButton: {
        backgroundColor: MDBLUE,
        borderRadius: 2,
        height: 24,
        width: 24,
        alignItems: 'center',
        justifyContent: 'center'
    },
    quantityText: {
        marginHorizontal: 8,
        fontSize: 16,
        color: BLACK,
        lineHeight: 21
    },
    priceView: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    minusIcon: {
        fontSize: 16,
        lineHeight: 22,
        color: BLACK,
        textAlign: 'center'
    }
})
