import { StyleSheet } from "react-native";
import { BLACK, GRAY_BORDER, MD_GRAY, WHITE,  } from "../../shared/common-styles/colors";

export const NotifcationScreenStyle = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    messageStyle: {
        fontSize: 12,
        lineHeight: 15,
        color: BLACK,
        fontWeight: '400'
    },
    logo: {
        width: 65, 
        height: 73, 
        resizeMode: 'contain',
    },
    titleStyle: {
        fontSize: 14,
        lineHeight: 18,
        color: BLACK,
        fontWeight: '700'
    },
    renderView: {
        marginVertical: 10,
        flexDirection: 'row',
        gap: 10,
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: MD_GRAY,
        padding: 10,
        borderRadius: 10,
        elevation:4,
        backgroundColor:WHITE
    },
    titleView: {
        flex: 1,
        marginEnd: 10
    },
    circleView: {
        height: 15,
        width: 15,
        borderRadius: 20,
        marginTop: 5
    }
})