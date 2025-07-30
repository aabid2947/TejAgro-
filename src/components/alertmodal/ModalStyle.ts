import { StyleSheet } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { BGRED, BLACK, BLUE_ALICE, DARK_GRAY, JPURPLE, LIGHTBLACK, LIGHTGREY, MDBLUE, ORANGE, WHITE } from '../../shared/common-styles/colors';

export const ModalStyle = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: LIGHTBLACK
    },
    modalView: {
        backgroundColor: WHITE,
        shadowColor: BLACK,
        shadowOpacity: 0.25,
        borderRadius: 5,
        paddingTop: 20,
        // paddingBottom: 40,
        width: widthPercentageToDP(80)
    },
    modalText: {
        fontSize: 14,
        color: DARK_GRAY,
        lineHeight: 20,
        fontWeight: '400',
        marginBottom:5,
        marginHorizontal:20
    },
    modalTextAlign: {
        fontSize: 20,
        color: BLACK,
        lineHeight: 20,
        alignSelf: 'center'
    },
    modalTextView: {
        fontSize: 18,
        lineHeight: 20,
        color: BLACK,
        // alignSelf: 'center'
    },
    modalTextViewDes: {
        fontSize: 14,
        lineHeight: 20,
        // color: DARK_GRAY,
        // alignSelf: 'center'
    },
    parentBtnView: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    buttonView: {
        width: widthPercentageToDP(20),
    },
    button: {
        borderRadius: 12,
        padding: 10,
        elevation: 2
    },
    buttonYesNo: {
        backgroundColor: BGRED,
        marginTop: 20,
        marginBottom: 10,
    },
    textStyle: {
        color: "white",
        fontSize: 16,
        lineHeight: 22,
        textAlign: "center"
    },
    formbutton: {
        flexDirection: "row",
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingBottom:15
    },
    formbuttonau: {
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical:20,
        paddingHorizontal:10,
    },
    buttonYesStyle: {
        borderRadius: 10,
        elevation: 2,
        backgroundColor: MDBLUE,
        marginBottom: 10,
        marginTop: 20,
        height: 42,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    formYesTxt: {
        color: BLACK,
        fontSize: 14,
        lineHeight: 22,
        fontWeight:'600'
    },
    buttonNoStyle: {
        borderRadius: 10,
        elevation: 2,
        backgroundColor: WHITE,
        height: 42,
        width: '40%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: BLACK,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonNoStyleAudio: {
        borderRadius: 5,
        elevation: 2,
        backgroundColor: WHITE,
        height: 40,
        width: '67%',
        marginTop: 20,
        borderWidth: 1,
        borderColor: MDBLUE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formNoTxt: {
        color: BLACK,
        fontSize: 16,
        lineHeight: 22,
    },
    formNoTxtAu: {
        color: BLACK,
        fontSize: 16,
        lineHeight: 22,
    },
    modalViewDocument: {
        backgroundColor: WHITE,
        shadowColor: BLACK,
        shadowOpacity: 0.25,
        padding: 10,
        borderRadius: 5,
        width: widthPercentageToDP(75)
    },
    imageViewIcon: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    divider: {
        color: LIGHTGREY,
        height: 2,
        marginHorizontal: -10,
        marginVertical: 10
    },
    imageView: {
        height: 300
    },
    modalPresableViewDocument: {
        borderRadius: 5,
        elevation: 2,
        backgroundColor: BLUE_ALICE,
        marginVertical: 5,
        height: 40,
        width: '45%',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: LIGHTGREY,
        borderWidth: 1
    },
    modalTextViewDocument: {
        color: JPURPLE,
        fontSize: 14,
        lineHeight: 22,
        fontWeight: '500'
    },
})
