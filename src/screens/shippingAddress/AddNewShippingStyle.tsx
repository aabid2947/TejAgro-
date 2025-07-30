import { StyleSheet } from "react-native";
import { BGRED, BLACK, GRAY_BORDER, PoppinsMedium, WHITE } from "../../shared/common-styles/colors";

export const AddNewShippingStyle = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    titleText: {
        fontSize: 16,
        color: BLACK,
        lineHeight: 21,
        padding: 5
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
    inputText: {
        marginHorizontal: 10,
        paddingStart: 10,
        height: 50,
        fontSize: 15,
        lineHeight: 15,
        fontFamily: PoppinsMedium,
        color: BLACK,
    },
    errorFormText: {
        color: BGRED,
        fontSize: 12,
        lineHeight: 15
    },
})