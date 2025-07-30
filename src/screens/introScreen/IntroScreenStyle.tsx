import { StyleSheet } from "react-native";
import { BLACK, MD_GRAY, MDBLUE, TEXT_COLOR, WHITE } from "../../shared/common-styles/colors";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

export const IntroScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoContainer: {
        // paddingTop: heightPercentageToDP(0),
        // marginStart: widthPercentageToDP(0)
    },
    logo: {
        width: "100%", // Adjust as necessary
        height: 200, // Adjust as necessary
        // resizeMode: 'contain',
    },
    contentContainer: {
        flex: 1,
        position: 'relative',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        resizeMode: 'cover',
    },
    textOverlay: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'flex-end',
        marginBottom: 10
    },
    title: {
        color: TEXT_COLOR,
        fontSize: 27,
        lineHeight: 38, // Adjust to increase spacing between lines

    },
    getStartedButton: {
        flexDirection: 'row',
        backgroundColor: MDBLUE,
        paddingVertical: 10,
        borderRadius: 50,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    buttonText: {
        color: BLACK,
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 21,
        marginHorizontal: 10
    },
    arrow: {
        fontSize: 22,
        color: '#fff',
        marginLeft: 10,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,

    },
    loginText: {
        color: BLACK,
        fontWeight: '500',
        lineHeight: 19
    },
    loginTextAlready: {
        color: MD_GRAY,
        fontWeight: '400',
        lineHeight: 19
    },
});