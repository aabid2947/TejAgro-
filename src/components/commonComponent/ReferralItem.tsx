import { StyleSheet, View } from "react-native"
import { widthPercentageToDP } from "react-native-responsive-screen"
import { BLACK, GREY, MDBLUE, PoppinsMedium, WHITE } from "../../shared/common-styles/colors"
import TextPoppinsSemiBold from "../../shared/fontFamily/TextPoppinsSemiBold"

export const ReferralItem = ({ data, index }: any) => {
    return (
        <View key={index} style={style.productContainer}>
            <View style={style.productContainer1}>
                <TextPoppinsSemiBold style={style.productName}>{data.name}</TextPoppinsSemiBold>
                <TextPoppinsSemiBold style={style.productDescription}>{data.price}</TextPoppinsSemiBold>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    productContainer: {
        marginBottom: 16,
        borderWidth: 1,
        padding: 5,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: WHITE,
        width: widthPercentageToDP(40)
    },
    productContainer1: {
        padding: 10,
        flex: 1,
    },
    productName: {
        fontSize: 16,
        color: BLACK,
        lineHeight: 21,
        alignSelf: "center"
    },
    productDescription: {
        fontSize: 14,
        fontFamily: PoppinsMedium,
        alignSelf: "center",
        lineHeight: 20,
        color: GREY,
        paddingTop: 7
    }
})