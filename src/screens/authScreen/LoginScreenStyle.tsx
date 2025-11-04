import { StyleSheet } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { BAckGround, BGRED, BLACK, GRAY_BORDER, GRAY_SHADE, MDBLUE, WHITE } from "../../shared/common-styles/colors";


export const LogInScreenStyle = StyleSheet.create({
    mainView: {
        flex: 1
    },
    buttonSigninStyle: {
        fontSize: 20,
        textAlign: 'center'
    },
    buttonStyle: {
        // marginBottom:heightPercentageToDP(10)
    },
    backgroundImage: {
        width: '50%',
        height: '80%',
        position: 'absolute',
        top: 0,
        // left: 0,
        resizeMode: 'contain',
        marginHorizontal: 50
    },
    welcomeText: {
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 25,
        color: BLACK,
        marginHorizontal: 20,
    },
    loginText: {
        fontSize: 24,
        lineHeight: 34,
        color: BLACK,
        marginHorizontal: 20,
        marginTop: 30,
        textAlign: 'center'
    },
    logoView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainBody: {
        marginVertical: 10,
        marginHorizontal: 20,
        marginBottom: 20
    },
    mainBody1: {
        marginTop: 10,
        marginHorizontal: 20,
    },
    dataView: {
        backgroundColor: BAckGround,
        height: 50,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: GRAY_SHADE,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputText: {
        marginHorizontal: 10,
        paddingStart: 10,
        height: 50,
        fontSize: 15,
        lineHeight: 15,
        color: BLACK,
        borderLeftWidth: 1,
        borderLeftColor: GRAY_SHADE
    },
    errorFormText: {
        color: BGRED,
        fontSize: 12,
        lineHeight: 30,
        // marginTop: -30
    },
    errorFormTextLogin: {
        color: BGRED,
        fontSize: 12,
        lineHeight: 30,
        marginTop: -30,
        marginBottom: 10,
        marginHorizontal: 20
    },
    titleStyle: {
        position: 'absolute',
        marginHorizontal: 40,
        backgroundColor: 'transparent',
        paddingHorizontal: 10,
        color: GRAY_BORDER,
        // fontFamily: WorkSansMedium,
        elevation: 1.2
    },
    inputView: {
        flex: 1,
       
      
    },
    txtPrivacy: {
        color: MDBLUE,
        fontSize: 14,
        lineHeight: 18
    },

    profileContents: {
        height: 54,
        width: widthPercentageToDP(90),
        borderWidth: 2,
        alignSelf: "center",
        color: BLACK,
        marginTop: 10,
        borderRadius: 10,
        borderColor: BLACK,
    },
    contryCodeStyle: {
        color: BLACK,
        fontSize: 16,
        paddingHorizontal: 10,
        borderEndWidth: 1,
        borderColor: BLACK,
        paddingBottom: 3
    },
    inputElement: {
        marginTop: 10,
        borderColor: BLACK,
        color: WHITE,
        borderWidth: 0.5,
        borderRadius: 10,
        height: 45,
        justifyContent: 'center',
    },
})