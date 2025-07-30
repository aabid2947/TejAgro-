
import { StyleSheet } from 'react-native';
import { BACKGROUND, BGRED, BLACK, BLUE_ALICE, BROWN, GREEN, JPURPLE, LIGHTGREY, WHITE } from '../../shared/common-styles/colors';

export const DropdownStyle = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: WHITE
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginVertical: 10
    },
    productText: {
        marginVertical: 5,
        fontSize: 14,
        color: BLACK,
        lineHeight: 20
    },
    inputText: {
        height: 40,
        fontSize: 14,
        lineHeight: 20,
    },
    formYesTxt: {
        color: WHITE,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: 'bold'
    },
    formNoTxt: {
        color: JPURPLE,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: 'bold'
    },
    formbutton: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20
    },
    buttonYesStyle: {
        backgroundColor: BROWN,
        width: '45%',
        marginVertical: 0,
        marginHorizontal: 0

    },
    updateButton: {
        marginBottom: 0,
        marginHorizontal: 0
    },
    buttonNoStyle: {
        backgroundColor: BLUE_ALICE,
        width: '45%',
        borderWidth: 1,
        borderColor: GREEN,
        marginVertical: 0,
        marginHorizontal: 0
    },
    flexView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },

    userTypeView: {
        height: 42,
        marginTop: 5,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        borderColor: LIGHTGREY,
    },

    userTypeViewRbsheet: {
        height: 42,
        marginBottom: 20
    },
    userTypeViewRbsheet1: {
        marginBottom: 5,
        // fontFamily: WorkSansRegular
    },
   
    errorFormText : {
        color: BGRED,
        fontSize: 12,
        lineHeight: 13
    },
    state: {
        height: 40,
        fontSize: 14,
    },
    searchPlace: {
        fontSize: 16,
        backgroundColor: WHITE,
        marginHorizontal: 10
        // fontFamily: WorkSansRegular
    },
    pressbleView: {
        height: 40,
        justifyContent: "center",
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: BACKGROUND,
    },
    nodataText: {
        color: BLACK,
        textAlign: 'center',
        paddingTop: 20
    }
})