import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import CartSvg from "../../svg/CartSvg"
import RupayIconSvg from "../../svg/RupayIconSvg"
import { BLACK, MDBLUE, PoppinsLight, PoppinsMedium, WHITE } from "../../shared/common-styles/colors"
import { widthPercentageToDP } from "react-native-responsive-screen"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../routes/AppRouter"
import { PRODUCT_SCREEN } from "../../routes/Routes"
import TextPoppinsSemiBold from "../../shared/fontFamily/TextPoppinsSemiBold"
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold"
import { useTranslation } from "react-i18next"
import { regexImage } from "../../shared/utilities/String"

export const ProductItem = ({ data, index }: any) => {
    const navigation: any = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { i18n } = useTranslation();
    const volumeRegex = /(\d+)\s*(ml|ltr|lit|gram|gm|kg)/i;
    const extractVolume = (item: any) => {
        const match = item?.product_name?.match(volumeRegex);
        return match ? match[0]?.trim() : null;
    };
    const volume = extractVolume(data);
    // const productName = i18n.language === "en" && data.product_marathi_name ? data.product_marathi_name : data.product_name;
    const productName = data.product_marathi_name || data.product_name;
    return (
        <Pressable key={index} style={style.productContainer} onPress={() => navigation.navigate(PRODUCT_SCREEN, { data })}>
            <Image
                source={
                    data?.product_image && regexImage.test(data.product_image)
                        ? { uri: data.product_image }
                        : require('../../assets/defaultProduct.png')
                }
                style={style.logo}
            />
            <View style={style.productContainer1}>
                <TextPoppinsSemiBold style={style.productName}>{productName}</TextPoppinsSemiBold>
                <TextPoppinsSemiBold style={style.productDescription}>{data.category_name}</TextPoppinsSemiBold>
                <View style={style.priceRow}>
                    <Text style={style.sellingPriceText}>₹{data.total_amount ? data.total_amount : data.selling_price}</Text>
                    {data.total_amount !== Number(data.mrp).toFixed(2) && data.mrp && (<Text style={style.mrpText}>₹{data.mrp}</Text>)}
                </View>
            </View>
            <Pressable style={style.cartButtonStyle} onPress={() => navigation.navigate(PRODUCT_SCREEN, { data })}>
                <TextPoppinsMediumBold style={style.productName}>{i18n.t('Buy_Now')}</TextPoppinsMediumBold>
            </Pressable>
        </Pressable>
    )
}

const style = StyleSheet.create({
    productContainer: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: WHITE,
        width: widthPercentageToDP(41),
        overflow: 'hidden',
    },
    productContainer1: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        flex: 1,
    },
    logo: {
        width: '100%',
        height: 121,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    productName: {
        fontSize: 14,
        color: BLACK,
        fontFamily: PoppinsMedium,
        lineHeight: 21,
        marginBottom: 4,
    },
    productDescription: {
        fontSize: 12,
        fontFamily: PoppinsLight,
        lineHeight: 18,
        color: '#131A0C',
        marginVertical: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    mrpText: {
        fontSize: 14,
        fontFamily: PoppinsLight,
        color: 'gray',
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    sellingPriceText: {
        fontSize: 16,
        fontFamily: PoppinsMedium,
        color: BLACK,
        marginRight: 5
    },
    cartButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: MDBLUE,
        height: 50,
        marginHorizontal: 10,
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 16,
    },
})