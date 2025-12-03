import { StyleSheet } from "react-native";
import { BLACK, DARK_GREEN_New, MD_GRAY_Dark, MDBLUE, PINK_GREY, Poppins, PoppinsMedium, WHITE, WHITE_GRAY, RED } from "../../shared/common-styles/colors";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

export const DashboardStyle = StyleSheet.create({
    mainCardView: {
        flex: 1,
        
    },
    headerText: {
        color: BLACK,
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 27,
        paddingBottom: 10
    },
    // removeCropButton: {
    //     position: 'absolute',
    //     top: 5,
    //     right: 5,
    //     backgroundColor: RED,
    //     borderRadius: 12,
    //     width: 24,
    //     height: 24,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     zIndex: 10,
    //     elevation: 5,
    // },
    columnView: {
        justifyContent: 'flex-start',
        gap: 20
    },
    noDataTxt: {
        marginTop: heightPercentageToDP(10)
    },
    subtitleStyle: {
        color: MD_GRAY_Dark,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '500'
    },
    subtitleStyleReferral: {
        color: WHITE_GRAY,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '500'
    },
    titleSytle: {
        color: BLACK,
        fontSize: 16,
        lineHeight: 21
    },
    titleSytleReferral: {
        color: WHITE,
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '500'
    },
    mainViewHeader: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 20,
        gap: 10,
        alignItems: 'center'
    },
    categoryText: {
        color: DARK_GREEN_New,
        fontSize: 12,
        lineHeight: 18,
        fontFamily: Poppins
    },
    categoryTextSelected: {
        color: WHITE,
        fontSize: 12,
        lineHeight: 18,
        fontFamily: Poppins
    },
    productImage: {
        borderRadius: 30,
        alignItems: "center",
        paddingHorizontal: 20,
        marginHorizontal: 3,
        borderWidth: 1,
        borderColor: DARK_GREEN_New,
        height: 36
    },
    productImage1: {
        borderRadius: 30,
        alignItems: "center",
        alignSelf: 'center',
        paddingHorizontal: 20,
        marginHorizontal: 6,
        borderWidth: 1,
        borderColor: DARK_GREEN_New,
        height: 50,
        width: 50,
        backgroundColor: PINK_GREY
    },
    logo: {
        width: widthPercentageToDP('28%'),
        height: 70,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        resizeMode: 'cover',
    },
    productContainer: {
        marginHorizontal: 5,
        marginVertical: 5,
        width: widthPercentageToDP('28%'),
    },
    productContainer1: {
        padding: 8,
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: PINK_GREY,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderRightColor: PINK_GREY,
        borderLeftColor: PINK_GREY,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: widthPercentageToDP('28%'),
        minHeight: 50,
    },
    productContainerSelected: {
        padding: 8,
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: MDBLUE,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderRightColor: MDBLUE,
        borderLeftColor: MDBLUE,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: widthPercentageToDP('28%'),
        backgroundColor: '#E3F2FD',
        minHeight: 50,
    },
    productName: {
        fontSize: 11,
        color: BLACK,
        textAlign: 'center',
        fontFamily: PoppinsMedium,
        // numberOfLines: 2,
        lineHeight: 14,
        paddingHorizontal: 2,
    },
    // My Crops Section Styles
    myCropsSection: {
        // borderWidth: 1,
        backgroundColor: WHITE,
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        // paddingTop: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    myCropsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginBottom: 5,
        paddingHorizontal: 5,
    },
    myCropsTitle: {
        fontSize: 16,
        color: BLACK,
        fontWeight: '600',
        lineHeight: 24,
        fontFamily: PoppinsMedium
    },
    editButton: {
        backgroundColor: DARK_GREEN_New,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    editButtonText: {
        color: WHITE,
        fontSize: 12,
        fontWeight: '500',
        fontFamily: Poppins
    },
    editActions: {
        flexDirection: 'row',
        gap: 10,
    },
    cancelButton: {
        // backgroundColor: LIGHT_GRAY,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    cancelButtonText: {
        color: BLACK,
        fontSize: 12,
        fontWeight: '500',
        fontFamily: Poppins
    },
    myCropsList: {
        // borderWidth: 1,
        // paddingHorizontal: 5,
        paddingTop: 10,
        // overflow:'visible'
    },
    myCropContainer: {
        position: 'relative',
        alignItems: 'center',
        width: 80,
        paddingHorizontal: 5,
    },
    removeCropButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: RED,
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        elevation: 3,
    },
    removeCropText: {
        color: WHITE,
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20,
    },
    myCropImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover',
        marginBottom: 5,
    },
    myCropName: {
        fontSize: 10,
        color: BLACK,
        textAlign: 'center',
        fontFamily: Poppins,
        // numberOfLines: 2,
        lineHeight: 12,
        paddingHorizontal: 2,
    },
    noMyCropsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        margin: 5,
    },
    noMyCropsText: {
        fontSize: 14,
        color: MD_GRAY_Dark,
        textAlign: 'center',
        fontFamily: Poppins,
    },
    // Submit button at bottom
    submitButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: DARK_GREEN_New,
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    submitButtonText: {
        color: WHITE,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: PoppinsMedium
    },
});