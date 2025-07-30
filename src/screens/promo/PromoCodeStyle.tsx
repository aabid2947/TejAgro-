import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { BLACK, DARK_GREEN, GRAY, GREEN, MDBLUE, ORANGE, WHITE } from "../../shared/common-styles/colors";

export const PromoCodeStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE
    },
    formSecondRow: {
        marginVertical: 15,
        marginHorizontal: 20,
    },
    useTextApply: {
        color: WHITE,
        textAlign: "center",
        fontSize: 14,
        marginVertical: 15
    },
    weekDaysMsgTxt: {
        color: ORANGE,
        fontSize: 12,
        marginVertical: 20,
        textAlign: "center",
        top: 10,
        lineHeight: 16,
    },
    activeBtnContainer: {
        borderRadius: 14,
        backgroundColor: ORANGE,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        marginHorizontal: 14,
        marginBottom: -40,
    },
    activeDisableBtnContainer: {
        borderRadius: 12,
        backgroundColor: GRAY,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        marginBottom: -40,
    },
    couponCard: {
        elevation: 8,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        marginHorizontal: 20,
        backgroundColor: WHITE,
        paddingVertical: 10,
        marginBottom: 15,
        borderRadius: 8,
        paddingHorizontal: 15
    },
    activeCouponCard: {
        flexDirection: "row",
        elevation: 10,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        backgroundColor: WHITE,
        height: 170,
        marginVertical: 5,
        paddingHorizontal: 15,
        marginHorizontal: 9,
        borderRadius: 12,
    },
    cookingIcon: {
        justifyContent: "center",
        alignItems: "center",
        width: "15%"
    },
    bookingTxtContainer: {
        justifyContent: "flex-start",
        width: "70%",
        left: "15%",
        flexDirection: "column"
    },
    dividerStyle: {
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        borderColor: '#C4C4C4',
        borderStyle: 'dashed',
        borderWidth: 1,
        width: wp(66),
        // borderRadius: 1,
        position: 'relative',
    },
    rightArrowIcon: {
        justifyContent: "center",
        alignItems: "center",
        width: "12%",
        fontSize: 12,
        backgroundColor: DARK_GREEN,
        color: WHITE,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12
    },
    tableBookingMsgTxt: {
        fontSize: 12,
        lineHeight: 16,
        top: 4,
        color: GREEN,
        right: "20%"
    },
    MsgTxt: {
        color: GREEN,
        fontSize: 12,
        lineHeight: 16,
        bottom: 10
    },
    offerText: {
        color: BLACK,
        fontSize: 14,
        transform: [{ rotate: '-90deg' }],
        width: 200,
        textAlign: "center",
        position: 'absolute',
    },
    textSm: {
        fontSize: 14,
        lineHeight: 15,
        alignSelf: "flex-start",
        right: "17%",
        color: BLACK
    },
    textApply: {
        color: GREEN,
        fontSize: 16,
        lineHeight: 24,
        textAlign: "right",
        textDecorationLine: "underline"
        // left: "15%"
    },
    viewDetailText: {
        color: ORANGE,
        fontSize: 14,
    },
    viewText: {
        fontSize: 10,
        lineHeight: 15,
        marginVertical: 5
    },
    maximumDisount: {
        color: "#303342",
        fontSize: 10,
        lineHeight: 15,
        alignItems: "flex-start"
    },
    formFirstRow: {
        flexDirection: "row",
        top: 2,
        marginVertical: 15,
        textAlign: "left",
        // paddingHorizontal: 25,
        marginHorizontal: 2,
    },
    SquareIcon: {
        alignItems: "flex-start",
        marginRight: 25,
        right: "40%",
        textAlign: "left"

    },
    textSms: {
        fontSize: 14,
        lineHeight: 15,
        // textAlign:"left",
        alignSelf: "flex-start",
        // marginRight:3,
        right: "30%"
    },
    CouponContainer: {
        backgroundColor: WHITE,
        elevation: 8,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        top: -30,
    },
    tableBookingMsgTxt1: {
        fontSize: 12,
        lineHeight: 14,
        top: 16,
        width: wp(50),
        color: GREEN,
        right: "60%"
    },
    // formFirstRow: {
    //     flexDirection: "row",
    //     marginVertical: 15,
    //     // paddingHorizontal: 25,
    //     marginHorizontal: 20,
    // },
    // formSecondRow: {
    //     marginVertical: 25,
    //     marginHorizontal: 26,
    // },
    TermsCondition: {
        fontSize: 14,
        marginTop: 10
    },
    termsContionText: {
        color: "#303342",
        fontSize: 12,
        paddingHorizontal: 20,
        textAlign: "left",
        top: 35,
        // position:"absolute"
        marginVertical: 10
    },
    termsContionsubText: {
        color: "#303342",
        fontSize: 14,
        lineHeight: 10,
        paddingVertical: 25,
        paddingHorizontal: 20
    },
    // formFirstRow: {
    //     flexDirection: "row",
    //     marginVertical: 15,
    //     // paddingHorizontal: 25,
    //     marginHorizontal: 20,
    // },
    // formSecondRow: {
    //     marginVertical: 25,
    //     marginHorizontal: 25,
    // },
    viewElement: {
        borderRadius: 10,
        backgroundColor: WHITE,
        elevation: 5,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        bottom: 20
    },
    paymentApplyCard: {
        elevation: 3,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        backgroundColor: WHITE,
        height: 90,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 20,
        marginHorizontal: 25,
        justifyContent: "center"
    },

    textCouponDiscount: {
        fontSize: 14,
        lineHeight: 18,
        color: GREEN
    },
    // viewElement: {
    //     borderRadius: 10,
    //     backgroundColor: WHITE,
    //     elevation: 5,
    //     ...boxStyle,
    //     marginHorizontal: 25,
    //     backgroundColor: "#303342"
    // },
    activeCouponContainer: {
        backgroundColor: WHITE,
        elevation: 8,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        zIndex: 999,
        bottom: 80,
        borderRadius: 12
    },
    existingText: {
        lineHeight: 30,
        marginHorizontal: 30,
        color: BLACK,
        marginVertical: 15,
        fontSize: 18,
        textAlign: "center"
    },
    activeMsgTxt: {
        fontSize: 14,
        lineHeight: 20,
        bottom: 10
    },
    activedividerStyle: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        borderColor: '#C4C4C4',
        borderStyle: 'dashed',
        borderWidth: 1,
        width: wp(80),
        position: 'relative',
    },
    activesubMsgTxt: {
        fontSize: 14,
        lineHeight: 18,
        color: "#303342"
    },
    activeExistingviewElement: {
        backgroundColor: WHITE,
        marginHorizontal: 26,
        // marginVertical: 15,
    },
    existingviewElement: {
        borderRadius: 10,
        backgroundColor: WHITE,
        elevation: 5,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        // top: 20,
        marginHorizontal: 26,
        marginVertical: 10
    },
    ActiveCardContainer: {
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: WHITE,
        borderRadius: 20,
        elevation: 8,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        marginBottom: 10,
        paddingTop: 70
    },
    mainBody: {
        marginVertical: 15,
        marginHorizontal: 10
    },
    offerIcon: {
        justifyContent: "center",
        alignItems: "center",
        width: "15%"
    },
    expirytextSm: {
        color: "#303342",
        fontSize: 10,
        alignItems: "flex-start"
    },
    btnContainer: {
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: WHITE,
        borderRadius: 20,
        elevation: 8,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        marginBottom: -25,
    },
    RestoMenu: {
        fontStyle: "normal",
        fontSize: 10,
        marginTop: hp(1),
        marginLeft: 20,
        alignItems: "center"
    },
    // weekDaysMsgTxt: {
    //     color: BGRED,
    //     fontSize: 12,
    //     marginVertical: 1,
    //     textAlign: "center",
    //     lineHeight: 16,
    // },
    imageContainer: {
        // marginLeft: 20,
        // marginRight: 20,
        marginTop: 20,
        borderRadius: 20,
        elevation: 8,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        marginBottom: -70,
        // width: wp(87),
        alignSelf: "center",
        zIndex: 999
    },
    RestoImageConatiner: {
        alignSelf: "center",
        backgroundColor: BLACK,
        borderRadius: 20,
    },
    voucherImage: {
        height: 150,
        width: wp(80),
        borderRadius: 20,
        resizeMode: "contain",
    },
    SliderImage: {
        height: hp(40),
        width: wp(60),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: "contain"
    },
    SliderImgContainer: {
        width: wp(60),
        height: hp(40),
        alignSelf: "center",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: BLACK,
    },
    SliderBottomText: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        bottom: 0,
        paddingLeft: 8,
        padding: 4,
        alignSelf: "center",
        justifyContent: "center",
        position: "absolute",
        backgroundColor: BLACK,
        // opacity:0.9,
        width: wp(60),
        height: 45
    },
    RestoContainer: {
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: WHITE,
        borderRadius: 20,
        width: wp(84),
        elevation: 8,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        marginBottom: 10,
        paddingTop: 70
    },
    RestoHeading: {
        fontSize: 14,
        color: BLACK,
        paddingHorizontal: 10
    },
    activeVoucherHeading: {
        fontSize: 14,
        color: BLACK,
        paddingHorizontal: 25
    },
    activeMaximumDisount: {
        color: "#303342",
        fontSize: 12,
        paddingVertical: 8,
        alignItems: "flex-start",
        paddingHorizontal: 25
    },
    activeVoucher: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventDetailContainer: {
        // marginLeft: 20,
        // marginRight: 20,
        backgroundColor: WHITE,
        borderRadius: 20,
        width: wp(87),
        elevation: 8,
        shadowColor: "#737373",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        marginBottom: 10,
        paddingTop: 70
    },
    voucherCard: {
        marginBottom: 30, alignItems: "center"
    }
}
);
