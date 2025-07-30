import { StyleSheet } from "react-native";
import { BAckGround, BACKGROUND, BGRED, BLACK, Black_Pearl, GRAY_BORDER, GRAY_SHADE, WHITE } from "../../shared/common-styles/colors";
import { widthPercentageToDP } from "react-native-responsive-screen";

export const RegistrationStyle = StyleSheet.create({
    logoView: {
        marginTop: widthPercentageToDP(20),
    },
    signUpText: {
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 30,
        color: BLACK,
        marginHorizontal: 20,
        marginVertical: 20,
        textAlign:'center'
    },
    titleText: {
        fontSize: 16,
        color: BLACK,
        fontWeight: '500',
        lineHeight: 21,
        padding: 5
    },
    inputText: {
        marginHorizontal: 10,
        paddingStart: 10,
        height: 50,
        fontSize: 15,
        lineHeight: 15,
        color: BLACK,
    },
    dataViewDropDown: {
        backgroundColor: BACKGROUND,
        justifyContent: 'space-between',
        borderRadius: 10,
        borderColor: GRAY_BORDER,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderWidth: StyleSheet.hairlineWidth
    },
    inputTextDrop: {
        fontSize: 15,
        color: BLACK,
    },
    errorFormText: {
        color: BGRED,
        fontSize: 12,
        lineHeight: 15
    },
    titleStyle: {
        position: 'absolute',
        marginHorizontal: 40,
        backgroundColor: 'transparent',
        paddingHorizontal: 10,
        color: GRAY_BORDER,
    },
    formFirstRow: {
        width: 360,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20
    },
    inputTextFeild: {
        borderRadius: 6,
        backgroundColor: BACKGROUND,
        marginTop: 10,
        width: widthPercentageToDP(100),
        color: BLACK,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: GRAY_BORDER,
    },
    mainBody1: {
        marginVertical: 10,
        marginHorizontal: 20,
    },
    dataView: {
        backgroundColor: WHITE,
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: GRAY_BORDER,
        flexDirection: 'row',
        alignItems: 'center'
    },
    dataView1: {
        backgroundColor: WHITE,
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: GRAY_SHADE,
        flexDirection: 'row',
        alignItems: 'center',
    },
    txtPrivacyPolicy: {
        fontSize: 14,
        lineHeight: 18,
        color: BLACK,
        marginHorizontal: 12,
        fontWeight: '500'
    },
    checkbox: {
        borderColor: BLACK,
        borderWidth: 1,
        borderRadius: 3,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20
    },
})