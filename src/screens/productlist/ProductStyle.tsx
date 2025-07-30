import { Platform, StyleSheet } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { BLACK, PoppinsMedium, WHITE } from "../../shared/common-styles/colors";

export const ProductStyle = StyleSheet.create({
    subBody: {
        marginHorizontal: 5
    },
    imgView: {
        height: heightPercentageToDP(25),
        width: widthPercentageToDP(87),
        borderRadius: 12,
        marginBottom: 10,
    },
    productName: {
        fontSize: 15,
        color: BLACK,
        lineHeight: 26
    },
    productDescription: {
        fontSize: 14,
        fontFamily: PoppinsMedium,
        lineHeight: 24,
        color: '#131A0C'
    },
    countCard: {
        elevation: 5,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        backgroundColor: WHITE,
        paddingHorizontal: 5,
        paddingVertical: Platform.OS == "ios" ? 10 : 0,
        borderRadius: 10,
        width: 40,
        alignItems: 'center',
        marginHorizontal: 10,
        height: 40
    },
    subBodyView: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    iconView: {
        flexDirection: "row"
    },
    textView: {
        textAlign: "center",
        color: BLACK,
        top: 4,
        fontFamily: PoppinsMedium
    }
});