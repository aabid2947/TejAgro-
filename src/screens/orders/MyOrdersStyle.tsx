import { StyleSheet } from "react-native";
import { BLACK, MD_GRAY, MDBLUE, WHITE } from "../../shared/common-styles/colors";
import { widthPercentageToDP } from "react-native-responsive-screen";

export const MyOrdersStyle = StyleSheet.create({
    renderView: {
        marginVertical: 10,
        gap: 10,
        borderWidth: 1,
        borderColor: MD_GRAY,
        padding: 10,
        borderRadius: 10,
        elevation: 4,
        backgroundColor: WHITE 
    },
    renderView2: {
        marginVertical: 10,
        gap: 10,
        borderWidth: 1,
        borderColor: MD_GRAY,
        padding: 10,
        borderRadius: 10,
        elevation: 4,
        backgroundColor: WHITE,
        marginHorizontal:20
    },
    subBody: {
        // flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center'
    },
    titleStyle: {
        fontSize: 12,
        lineHeight: 18,
        color: BLACK,
    },
    titleStyle1: {
        fontSize: 14,
        lineHeight: 18,
        color: BLACK,
    },
    dividerStyle: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        borderBottomColor: "#C4C4C4",
        borderBottomWidth: 0.5,
        marginBottom: 10,
        width: widthPercentageToDP(85),
        position: 'relative'
    },
    detailButton: {
        backgroundColor: BLACK,
        borderRadius: 4,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
    },
    itemView: {
        marginHorizontal: 24,
        marginVertical: 10
    },
    bgColor: {
        backgroundColor: "#FBAB32"
    },
    bgColorSelected: {
        backgroundColor: WHITE
    },
    textStyle: {
        fontSize: 16,
        lineHeight: 22,
        textAlign: "center"
    }
})