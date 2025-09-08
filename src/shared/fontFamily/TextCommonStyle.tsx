import { StyleSheet, Platform } from 'react-native';
import { BLACK, LIGHTGREY, Poppins, PoppinsBlack, PoppinsBold, PoppinsExtraBold, PoppinsLight, PoppinsMedium, PoppinsSemibold } from '../common-styles/colors';

export const TextCommonStyle = StyleSheet.create({
    customFontText: {
        fontSize: 14,
        lineHeight: 16,
        color: BLACK,
        fontFamily: "bold",
       
    },
    textPoppinsBold: {
        fontSize: 14,
        lineHeight: 16,
        color: LIGHTGREY,
        fontFamily: Poppins,
       
    },
    textPoppinsSemiBold: {
        fontSize: 11,
        lineHeight: 20,
        color: LIGHTGREY,
        fontFamily: PoppinsSemibold,
       
    },
    textPoppinsSemiBold1: {
        fontSize: 11,
        lineHeight: 20,
        color: LIGHTGREY,
        fontFamily: PoppinsSemibold,
       
    },
    textPoppinsMediumBold: {
        fontSize: 14,
        lineHeight: 18,
        color: BLACK,
        fontFamily: PoppinsSemibold,
        // width:'100%'
       
    },
    textPoppinsExtraBold: {
        fontSize: 11,
        lineHeight: 16,
        color: LIGHTGREY,
        fontFamily: PoppinsExtraBold,
       
    },
    fontSizeMd: {
        fontSize: 14,
        lineHeight: 18
    },
    fontSizeXs: {
        fontSize: 10,
        lineHeight: 12
    },
    fontSizeSm: {
        fontSize: 12,
        lineHeight: 14
    },
    fontSizeXxl: {
        fontSize: 20,
        lineHeight: 24
    },
});