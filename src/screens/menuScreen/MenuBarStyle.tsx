import { StyleSheet } from "react-native";
import { BLACK, PINK_GREY, WHITE } from "../../shared/common-styles/colors";


export const MenuBarStyle = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    txtAccountName: {
        fontSize: 16,
        color: BLACK,
        lineHeight: 21,
        marginHorizontal: 10,
        fontWeight:'700'
    },
    accountDetailsName: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: PINK_GREY,
        borderRadius: 4,
        // elevation: 4,
        backgroundColor: WHITE,
        height:80,
        alignItems:'center',
        paddingHorizontal:20,
        justifyContent:'space-between'
    },
})