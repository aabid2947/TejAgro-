import { StyleSheet } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { BGRED, BLACK, DARK_GREEN, GRAY_BORDER, GREEN, JPURPLE, LIGHTGREY, MDBLUE, WHITE } from "../../shared/common-styles/colors";

export const otpstyles = StyleSheet.create({
    dashboardContainer: {
        flex: 1,
        // backgroundColor: WHITE
    },
    otpTitle: {
        marginHorizontal: 20,
        color: BLACK,
        fontSize: 16,
        lineHeight: 22
    },
    mobileNumber: {
        marginHorizontal: 20,
        color: BLACK,
        fontSize: 16,
        lineHeight: 30
    },
    parentView: {
        flex: 1,
        marginHorizontal: 0,
        // marginTop: 50
    },
    parentViewOt: {
        // flex: 1,
        marginHorizontal: 0,
        // marginTop:50
    },
    countDown: {
        alignSelf: "center",
        flex: 1
    },
    contentHeaderWrapper: {
        marginHorizontal: 5,
        marginVertical: 25,
        borderRadius: 5,
    },

    textHeader: {
        fontSize: 24,
        lineHeight: 28,
        color: MDBLUE,
        textAlign: 'center',
        marginTop: 8
    },
    textHeaderSelect: {
        fontSize: 20,
        lineHeight: 24,
        alignSelf: 'center',
        color: DARK_GREEN,
    },
    loginInformation: {
        // alignItems: 'center',
        marginTop: 5,
        // marginHorizontal: 20
    },
    otpInformation: {
        fontSize: 11,
        lineHeight: 17,
        color: LIGHTGREY,
        marginHorizontal: 30,
    },
    phoneNumber: {
        fontSize: 13,
        lineHeight: 20,
        color: BLACK,
        marginTop: 5,
        marginHorizontal: 20,
    },
    textInformation: {
        fontSize: 14,
        marginHorizontal: 2,
        lineHeight: 20,
        color: BLACK,
    },
    mobileText: {
        fontSize: 14,
        color: WHITE,
        paddingLeft: 10,
        height: 38,
    },
    profileContent: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5,
        marginVertical: 20,
        marginHorizontal: 10,
        borderColor: GREEN,
        backgroundColor: GREEN
    },
    resOtp: {
        marginTop: 10,
        flexDirection: 'row',
        // justifyContent: 'center'
        marginHorizontal: 20,
        alignItems: 'center',
        gap: 10
    },
    resendOTPTxt: {
        color: BLACK,
        fontSize: 16,
        lineHeight: 21
    },

    otpFormTxt: {
        textAlign: "center",
        marginHorizontal: 10
    },
    otpErroFormTxt: {
        color: BGRED,
        lineHeight: 20,
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
    },
    inputStyle: {
        color: BLACK,
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    verifyInput: {
        marginTop: 20,
        // alignItems: 'center'
        marginHorizontal: 50
    },
    otpBox: {
        borderRadius: 5,
        marginHorizontal: 5,
        justifyContent: "center",
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: GRAY_BORDER,
        color: WHITE,
        width: 43,
        height: 43,
        padding: 7
    },

    txtCurrentRide: {
        fontSize: 20,
        lineHeight: 50,
        color: JPURPLE,
        marginHorizontal: 15
    },
    resendOtp: {
        marginHorizontal: 15
    },
    //Select Type style
    btnOr: {
        alignSelf: 'center',
        width: 60,
        height: 30,
        marginBottom: 25
    },
    txtDistributorView: {
        borderColor: DARK_GREEN,
        borderWidth: 1,
        marginTop: 10,
        width: widthPercentageToDP(87),
        alignSelf: 'center',
        padding: 15,
        backgroundColor: WHITE,
        borderRadius: 8,
    },
    txtFarmerView: {
        borderColor: MDBLUE,
        borderWidth: 1, width: 230,
        alignSelf: 'center',
        padding: 10,
        marginTop: 10,
        backgroundColor: MDBLUE,
        borderRadius: 8
    },
    farmerView: {
        borderColor: GRAY_BORDER,
        borderWidth: 1,
        width: 200,
        alignSelf: 'center',
        padding: 7,
        marginBottom: 10
    },
    contentHeader: {
        marginHorizontal: 5,
        borderRadius: 5
    },
    txtOr: {
        fontSize: 17,
        lineHeight: 25,
        marginTop: 10,
        color: BLACK,
        textAlign: 'center'
    },
    imageContainer: {
        borderWidth: 0.2,
        flex: 1.5,
        alignSelf: 'flex-end',
        borderRadius: 4,
        paddingVertical: 10,
        width: 100,
    },
    mainContainerView: {
        flex: 1, justifyContent: 'center'
    },
    topHeaderText: {
        fontSize: 25,
        lineHeight: 32,
        color: DARK_GREEN,
        textAlign: "center",
        marginHorizontal: 50,
        paddingVertical: 20
    },
    distributorIcon: {
        alignSelf: "center",
        marginTop: 20
    },
    cropIcon: {
        alignSelf: "center",
        marginTop: 30
    }
}
);