import { StyleSheet } from "react-native";
import { BACKGROUND, BGRED, BLACK, Black_Pearl, GRAY_BORDER, GREY, Poppins, PoppinsMedium, WHITE } from "../../shared/common-styles/colors";
import { widthPercentageToDP } from "react-native-responsive-screen";

export const ProfileScreenStyle = StyleSheet.create({
    mainCardView: {
        flex: 1,
    },
    headerview: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        marginStart: 30,
        marginTop: 10
    },
    headerTextContainer: {
        color: BLACK,
        fontSize: 24,
        lineHeight: 28,
        marginTop: 20,
    },
    imageView: {
        alignSelf: 'center',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 58,
        marginLeft: "auto",
        marginRight: "auto",
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: GREY,
        paddingHorizontal: 26,
        borderRadius: 10,
        borderBottomLeftRadius: 25,
        borderBottomEndRadius: 25,
        paddingVertical: 3
    },
    mainBody: {
        marginVertical: 10,
        marginHorizontal: 20,
    },
    dataViewDropDown: {
        backgroundColor: BACKGROUND,
        height: 50,
        justifyContent: 'space-between',
        borderRadius: 10,
        borderColor: Black_Pearl,
        flexDirection: 'row',
        alignItems: 'center',
        paddingEnd: 10
        // ...boxStyle,
    },
    inputTextDrop: {
        marginVertical: 5,
        marginStart: 20,
        height: 40,
        fontSize: 15,
        lineHeight: 20,
        fontFamily: Poppins,
        color: BLACK,
    },
    errorFormText: {
        color: BGRED,
        fontSize: 12,
        lineHeight: 30
    },
    titleStyle: {
        position: 'absolute',
        marginHorizontal: 40,
        backgroundColor: 'transparent',
        paddingHorizontal: 10,
        color: GRAY_BORDER,
        elevation: 1.2
    },
    formFirstRow: {
        flexDirection: "row",
        marginHorizontal: 20,
        justifyContent: "space-between",
        marginBottom: 20
    },
    inputTextFeild: {
        borderRadius: 6,
        backgroundColor: BACKGROUND,
        elevation: 5,
        marginTop: 10,
        width: widthPercentageToDP(90),
        color: BLACK,
        paddingStart: 20
    },
    titleStyleText: {
        marginHorizontal: 20,
        color: BLACK,
        paddingTop: 10
    },
    mainBodyView: {
        marginVertical: 10,
        marginHorizontal: 20,
    },
    dataView: {
        backgroundColor: BACKGROUND,
        height: 50,
        justifyContent: 'center',
        elevation: 1,
        borderRadius: 10,
        borderColor: Black_Pearl,
        flexDirection: 'row',
        alignItems: 'center',
        paddingEnd: 10
    },
    inputText: {
        marginHorizontal: 5,
        height: 40,
        fontSize: 15,
        lineHeight: 15,
        color: BLACK,
        fontFamily: PoppinsMedium
    }
})