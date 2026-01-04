import { StyleSheet } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { BLACK, MD_GRAY_Dark, MDBLUE, Poppins, PoppinsMedium, PoppinsSemibold, WHITE } from "../../shared/common-styles/colors";

export const ProductListStyle = StyleSheet.create({
    main: {
        flex: 1,
    },
    searchView: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        marginBottom: 20
    },
    pressablCross: {
        position: 'absolute',
        right: 5,
        backgroundColor: BLACK,
        padding: 5,
        borderRadius: 10
    },
    titleSelectText: {
        fontSize: 16,
        lineHeight: 35,
        color: BLACK,
        marginTop: -10,

    },
    titleText: {
        fontSize: 16,
        lineHeight: 19,
        fontWeight: '500',
        color: BLACK,
        marginTop: 15
    },
    container: {
        flex: 1,
        // borderWidth: 2,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    horizontalContainer: {
        flex: 1,
        paddingLeft: 10,
        backgroundColor: '#fff',
    },
    logo: {
        width: 164,
        height: 121,
        borderRadius: 5,
        resizeMode: 'cover',
    },
    noDataTxt: {
        marginTop: heightPercentageToDP(20)
    },
    searchBar: {
        height: 45,
        borderRadius: 8,
        paddingHorizontal: 10,
        flex: 1
    },
    searchBarView: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        flex: 1,
        borderColor: '#CFCFCF',
        flexDirection: 'row',
        alignItems: 'center'
    },
    noResults: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#888',
    },
    headerTextCommon: {
        alignSelf: "center"
    },
    headerText: {
        color: BLACK,
        fontSize: 18,
        fontFamily: PoppinsSemibold,
        fontWeight: 'semibold',
        lineHeight: 30,
        paddingBottom: 10
    },
    addToCartButton: {
        flex: 1,
        justifyContent: 'flex-end',
        bottom: 5
    },
    titletxt: {
        color: BLACK,
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '500'
    },
    headerView: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 20,
        gap: 10,
        alignItems: 'center'
    },
    subtitleText: {
        color: MD_GRAY_Dark,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '500'
    },
    textCrop: {
        color: BLACK,
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        marginHorizontal: 8,
        maxWidth: 70,
        flexWrap: 'wrap'
    },
    dividerStyle: {
        borderBottomColor: "#C4C4C4",
        borderBottomWidth: 1,
        marginBottom: 10,
        marginHorizontal: 10,
        width: widthPercentageToDP(85)
    }
});