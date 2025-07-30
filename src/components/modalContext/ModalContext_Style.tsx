import { StyleSheet } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { BLACK, LIGHTBLACK, LIGHT_SILVER, PINK_GREY, WHITE, } from '../../shared/common-styles/colors';


export const ModalContext_Style = StyleSheet.create({
    modalViewParent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: LIGHTBLACK
    },
    modalCard: {
        paddingTop: 20,
        shadowColor: LIGHT_SILVER,
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.6,
        borderRadius: 6,
        backgroundColor: PINK_GREY,
        elevation: 8,
        marginHorizontal: 15,
        paddingHorizontal: 15,
        borderColor: LIGHT_SILVER,
        borderWidth: 1,
        paddingBottom: 15,
        width: widthPercentageToDP(80)
    },
    textStyle: {
        alignSelf: 'center',
        color: BLACK,
        fontSize: 15,
        lineHeight: 20
    },
    okButton: {
        borderRadius: 10,
        marginHorizontal: 20,
        height: 40,
        alignSelf: 'center',
        width: widthPercentageToDP(40),
        marginTop: 20
    },
    okTextStyle: {
        fontSize: 18,
        color: WHITE,
        textAlign: 'center',
        lineHeight: 30,
    },
})