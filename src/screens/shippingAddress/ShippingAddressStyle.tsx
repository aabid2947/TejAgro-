import { StyleSheet } from "react-native";
import { BACKGROUND_BORDER, BLACK, GRAY, WHITE } from "../../shared/common-styles/colors";


export const ShippingAddressStyle = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    iconView: {
        borderWidth: 1,
        borderColor: BLACK,
        height: 25,
        width: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    tickText: {
        color: BLACK,
        fontSize: 16,
        lineHeight: 22
    },
    tickTextDisable: {
        color: GRAY,
        fontSize: 16,
        lineHeight: 22
    },
    secondView: {
        backgroundColor: WHITE,
        elevation: 4,
        marginVertical: 10,
        paddingVertical: 10,
        borderRadius: 10
    },
    nameStyle: {
        fontSize: 16,
        lineHeight: 21,
        color: BLACK
    },
    nameViewParent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: BACKGROUND_BORDER
    },
    iconView1: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    addressText: {
        marginHorizontal: 20,
        color: GRAY,
        fontSize: 14,
        lineHeight: 21
    },
    mainViewRender: {
        marginHorizontal: 20,
        paddingVertical: 10,
        gap: 10
    },
    plusIconView: {
        position: 'absolute',
        bottom: 20,
        right: 20
    },
    plusIconViewCheckout: {
        alignItems:'center'
    }
})