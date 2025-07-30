/* eslint-disable prettier/prettier */
import { StyleSheet } from "react-native";
import { BLACK, GREY, MD_GRAY, PoppinsMedium, PoppinsSemibold, WHITE, GRAY_SHADE, Black_Pearl } from "../../shared/common-styles/colors";

export const settingStyle = StyleSheet.create({
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
    imageView: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textNameStyle: {
        fontSize: 20,
        color: BLACK,
        lineHeight: 32,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10
    },
    headerTextContainer: {
        color: BLACK,
        fontSize: 24,
        lineHeight: 28,
        marginTop: 20,
    },
    userMenuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8
    },
    profileContents: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15
    },
    dividerLine: {
        marginVertical: 8,
        borderWidth: 0.2,
        borderColor: MD_GRAY
    },
    textContainer: {
        justifyContent: "flex-start",
        width: "72%"
    },
    textContainerView: {
        width: "60%",
        alignSelf: "center",
        paddingLeft: 10
    },
    commonTxt: {
        fontSize: 16,
        lineHeight: 22,
        color: BLACK
    },
    bottomContainer: {
        marginTop: "5%"
    },
    logOutView: {
        alignSelf: "center",
        marginBottom: 20,
        flexDirection: 'row',
        gap: 5
    },
    logoutTxt: {
        color: GREY,
        fontSize: 12,
        textDecorationLine: 'underline'
    },
    versionTxt: {
        color: BLACK,
        fontSize: 12,
        lineHeight: 14,
    },
    updateIcon: {
        marginLeft: 30,
    },
    content: {
        width: "10%"
    },
    deleteAccountView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 30,
        marginBottom: 10
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 58,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 20,
        borderWidth: 1,
        borderColor: BLACK
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
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    subText: {
        fontSize: 14,
        lineHeight: 18,
        color: GREY,
        fontFamily: PoppinsMedium
    },
    commonText: {
        // fontWeight: "bold"
        lineHeight: 20
    },
    emailTxt: {
        marginVertical: 6,
    },
    iconView: {
        top: 6,
        width: "10%"
    },
    profileDetailsContainer: {
        backgroundColor: WHITE,
        // paddingVertical: 20,
        // mar: 20,
        borderRadius: 12,
        marginHorizontal: 20,
        marginBottom: 20,
        // marginTop: 25,
        flexDirection: 'row'
    },
    languageTitle: {
        fontSize: 14,
        // fontWeight: "600",
        lineHeight: 22,
        color: "#333",
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: GRAY_SHADE,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 12,
        marginVertical: 8,
        backgroundColor: "#fff",
    },
    dropdownRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    selectedLanguage: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        textAlign: "left",
        marginHorizontal: 4,
        flexShrink: 1,
    },
    boldText: {
        fontSize: 15,
        // lineHeight: 18,
        color: Black_Pearl,
        fontFamily: PoppinsMedium,
        fontWeight:"900"
    },

});