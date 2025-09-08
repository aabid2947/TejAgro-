import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { BGRED, BLACK, MDBLUE, ORANGE, WHITE } from "../../shared/common-styles/colors";

export const ReferralCodeStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
        // paddingTop: insets.top,
    },
    backIcon: {
        position: "absolute",
        left: 15,
        top: 20
    },
    skipBtn: {
        position: "absolute",
        right: 30,
        top: 15
    },
    skipBtnTxt: {
        color: ORANGE,
        textAlign: "right",
        fontSize: 16,
        lineHeight: 22,
        textDecorationLine: "underline"
    },
    formContainer: {
        marginHorizontal: 10,
        marginTop: 50
    },
    formFieldsRow: {
        marginTop: 10,
        paddingHorizontal: 25,
        marginHorizontal: 10
    },
    contentFirstTxt: {
        marginVertical: 10,
        paddingHorizontal: 25,
        marginHorizontal: 10,
    },
    contentSecondTxt: {
        marginTop: 10,
        paddingHorizontal: 15,
        marginLeft: 40,
    },
    formTxt: {
        marginBottom: 6
    },
    headerFormTxt: {
        fontSize: 24,
        lineHeight: 30,
        color: BLACK
    },
    commonFormTxt: {
        fontSize: 10,
        lineHeight: 13,
        color: BLACK
    },
    userNameTxt: {
        fontSize: 14,
        lineHeight: 20
    },
    image: {
        width: wp(60),
        height: hp(35),
        borderRadius: 10,
        resizeMode: 'contain',
    },
    imagee: {
        width: wp(26),
        height: hp(13),
        borderRadius: 10,
        marginVertical: 6
    },
    imageReferral: {
        width: wp(60),
        height: hp(40),
        borderRadius: 10,
        marginVertical: 6,
        resizeMode: "cover",
    },
    inputElement: {
        borderRadius: 8,
        backgroundColor: WHITE,
        elevation: 6,
        borderWidth: 0.5,
        borderColor: ORANGE
    },
    errorMsgTxt: {
        marginTop: 10,
        justifyContent: "center",
        paddingHorizontal: 25,
        marginHorizontal: 10
    },
    erroFormTxt: {
        color: BGRED,
        fontSize: 8.6,
        lineHeight: 13
    },
    recieverTxt: {
        fontSize: 14,
        lineHeight: 20
    },
    buttonsContainer: {
        backgroundColor: MDBLUE,
        borderRadius: 50,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        height: 52,
        marginBottom: 10
    },
    verifyBtn: {
        paddingVertical: 15,
        width: wp(77),
        alignItems: "center",
    },
    submitBtn: {
        paddingVertical: 15,
        paddingHorizontal: 135
    },
    verifyBtnTxt: {
        color: BLACK,
        fontSize: 18,
        lineHeight: 24
    }
})