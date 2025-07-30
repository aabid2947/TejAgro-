import { heightPercentageToDP } from "react-native-responsive-screen";
import { MID_GREY, WHITE, WHITE_BACKGROUND } from "../../shared/common-styles/colors";
import { StyleSheet } from "react-native";

export const ReferralStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    tabViewmain: {
        borderWidth: 1,
        height: 50,
        borderColor: WHITE_BACKGROUND,
        borderRadius: 50,
        flexDirection: 'row',
        marginHorizontal: 20,
    },
    tabTextstyle: {
        fontSize: 12,
        color: WHITE,
        fontWeight: '500',
        lineHeight: 16
    },
    backgroundImage: {
        width: '100%',
        height: heightPercentageToDP(48),
    },
    onPressTab: {
        flex: 1,
        borderEndWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderEndColor: MID_GREY
    },
    onPressTabFirst: {
        flex: 1,
        borderEndWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderEndColor: MID_GREY,
        borderStartEndRadius: 24,
        borderStartStartRadius: 24
    },
    onPressViewLast: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopEndRadius: 24,
        borderBottomEndRadius: 24
    },
    greeting: {
        color: WHITE,
        fontSize: 24,
        fontWeight: 'bold',
    },
    serviceText: {
        color: WHITE,
        fontSize: 16,
    },
    overlayImageContainer: {
        position: 'absolute',
        bottom: 0, // adjust this to position the image
        right: 10, // adjust this to position the image
    },
    overlayImageContainerAllPrice: {
        position: 'absolute',
        bottom: -70, // adjust this to position the image
        right: 10, // adjust this to position the image
    },
    overlayImage: {
        width: 200,
        height: 182,
        borderRadius: 10, // make it circular
    },
    overlayImageTractor: {
        width: 300,
        height: 250,
        borderRadius: 10, // make it circular
    },
    referralContainer: {
        marginTop: 10,
        marginHorizontal: 20
    },
    referralText: {
        fontSize: 25,
        fontWeight: '300',
        lineHeight: 35,
        color: WHITE
    },
    referralFirstText: {
        fontSize: 15,
        fontWeight: '300',
        lineHeight: 21,
        color: WHITE
    },
    referralCount: {
        fontSize: 52,
        fontWeight: '900',
        color: WHITE,
        lineHeight: 70
    },
    referralCount1: {
        fontSize: 35,
        fontWeight: '900',
        color: WHITE,
        lineHeight: 45
    },
    membersJoined: {
        fontSize: 15,
        color: WHITE,
        lineHeight: 21,
        fontWeight: '300'
    },
    datestyle: {
        fontSize: 17,
        color: WHITE,
        lineHeight: 21,
        fontWeight: '500'
    },
    
});