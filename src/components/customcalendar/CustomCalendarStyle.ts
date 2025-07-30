import { StyleSheet } from 'react-native'
import { BGRED } from '../../shared/common-styles/colors'

export const Calendarstyle = StyleSheet.create({
    inputText: {
        height: 40,
        fontSize: 14,
        lineHeight: 20,
    },
    erroFormTxt: {
        color: BGRED,
        fontSize: 8,
        lineHeight: 13
    },
    viewIcon: {
        alignSelf: "center",
        right: 35,
        top: 5
    }
}) 