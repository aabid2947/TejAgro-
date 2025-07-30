import { StyleSheet } from "react-native";
import { BLACK, DARK_GREEN_New, MD_GRAY_Dark, MDBLUE, PINK_GREY, Poppins, PoppinsMedium, WHITE, WHITE_GRAY } from "../../shared/common-styles/colors";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

export const DashboardStyle = StyleSheet.create({
    mainCardView: {
        flex: 1,
    },
    headerText: {
        color: BLACK,
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 27,
        paddingBottom: 10
    },
    columnView: {
        justifyContent: 'flex-start',
        gap: 20
    },
    noDataTxt: {
        marginTop: heightPercentageToDP(10)
    },
    subtitleStyle: {
        color: MD_GRAY_Dark,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '500'
    },
    subtitleStyleReferral: {
        color: WHITE_GRAY,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '500'
    },
    titleSytle: {
        color: BLACK,
        fontSize: 16,
        lineHeight: 21
    },
    titleSytleReferral: {
        color: WHITE,
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '500'
    },
    mainViewHeader: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 20,
        gap: 10,
        alignItems: 'center'
    },
    categoryText: {
        color: DARK_GREEN_New,
        fontSize: 12,
        lineHeight: 18,
        fontFamily: Poppins
    },
    categoryTextSelected: {
        color: WHITE,
        fontSize: 12,
        lineHeight: 18,
        fontFamily: Poppins
    },
    productImage: {
        borderRadius: 30,
        alignItems: "center",
        paddingHorizontal: 20,
        marginHorizontal: 3,
        borderWidth: 1,
        borderColor: DARK_GREEN_New,
        height: 36
    },
    productImage1: {
        borderRadius: 30,
        alignItems: "center",
        alignSelf: 'center',
        paddingHorizontal: 20,
        marginHorizontal: 6,
        borderWidth: 1,
        borderColor: DARK_GREEN_New,
        height: 50,
        width: 50,
        backgroundColor: PINK_GREY
    },
    logo: {
        width: 98,
        height: 70,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        resizeMode: 'cover',
    },
    productContainer1: {
        padding: 5,
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: PINK_GREY,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderRightColor: PINK_GREY,
        borderLeftColor: PINK_GREY,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 98,
    },
    productContainerSelected: {
        padding: 10,
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: MDBLUE,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderRightColor: MDBLUE,
        borderLeftColor: MDBLUE,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        backgroundColor: MDBLUE,
        width: 98,
        alignItems: 'center',
        justifyContent: 'center'
    },
    productContainer: {
        marginBottom: 16,
        // borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: WHITE,
        width: widthPercentageToDP(25)
    },
    productName: {
        fontSize: 14,
        color: BLACK,
        lineHeight: 22,
        textAlign: 'center'
    },
})