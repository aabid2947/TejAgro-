// import { StyleSheet } from "react-native";
// import { BLACK, MDBLUE, PoppinsLight, PoppinsMedium, WHITE } from "../../shared/common-styles/colors";
// import { widthPercentageToDP } from "react-native-responsive-screen";

import { StyleSheet } from "react-native";
import { BLACK, MDBLUE, PoppinsLight, PoppinsMedium, WHITE } from "../../shared/common-styles/colors";
import { widthPercentageToDP } from "react-native-responsive-screen";

// export const CropSelectedStyle = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: WHITE,
//         marginBottom: 10
//     },
//     backIcon: {
//         flexDirection: "row",
//         backgroundColor: MDBLUE,
//         padding: 15,
//         alignItems: 'center',
//     },
//     header: {
//         fontSize: 20,
//         lineHeight: 28,
//         textAlign: 'center',
//         color: BLACK,
//         width: "100%"
//     },
//     stageHeader: {
//         fontSize: 16,
//         alignSelf: "center",
//         color: BLACK,
//         marginVertical: 10,
//         lineHeight: 28,
//         fontFamily:PoppinsMedium
//     },
//     productCard: {
//         marginBottom: 10,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 8,
//         backgroundColor: WHITE,
//         marginHorizontal: 5,
//         width: widthPercentageToDP(42),
//         position: 'relative',
//         paddingBottom: 70,
//     },
//     productImage: {
//         width: "100%",
//         height: 121,
//         borderRadius: 5,
//         resizeMode: 'cover',
//     },
//     productName: {
//         fontSize: 13,
//         lineHeight: 20,
//         textAlign: 'center',
//         marginBottom: 5,
//         color: BLACK,
//         fontFamily:PoppinsLight
//     },
//     buyButton: {
//         backgroundColor: '#FF9F1C',
//         paddingVertical: 5,
//         paddingHorizontal: 10,
//         borderRadius: 5,
//         marginTop: 10,
//     },
//     buyButtonText: {
//         color: WHITE,
//         fontWeight: 'bold',
//     },
//     productPrice: {
//         fontSize: 16,
//         color: BLACK,
//         marginVertical: 4,
//     },
//     cartButtonStyle: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-around',
//         backgroundColor: MDBLUE,
//         height: 50,
//         borderRadius: 10,
//         position: 'absolute',
//         bottom: 10,
//         left: 10,
//         right: 10,
//     },
// });
export const CropSelectedStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
        marginBottom: 10
    },
    backIcon: {
        flexDirection: "row",
        backgroundColor: MDBLUE,
        padding: 15,
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        lineHeight: 28,
        textAlign: 'center',
        color: BLACK,
        width: "100%",
        fontFamily: PoppinsMedium
    },
    stageHeader: {
        fontSize: 14,
        alignSelf: "center",
        color: BLACK,
        marginVertical: 10,
        lineHeight: 28,
    },
    productCard: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: WHITE,
        marginHorizontal: 5,
        width: widthPercentageToDP(42),
        position: 'relative',
        paddingBottom: 10,
    },
    productImage: {
        width: "100%",
        height: 121,
        borderRadius: 5,
        resizeMode: 'cover',
    },
    productName: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 5,
        color: BLACK,
        fontFamily: PoppinsLight
    },
    buyButton: {
        backgroundColor: '#FF9F1C',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buyButtonText: {
        color: BLACK,
        lineHeight: 20,
        fontSize: 13
    },
    productPrice: {
        fontSize: 16,
        color: BLACK,
        marginVertical: 4,
    },
    cartButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: MDBLUE,
        height: 50,
        borderRadius: 10,
        marginHorizontal:8
        // position: 'absolute',
        // bottom: 10,
        // left: 10,
        // right: 10,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    // priceContainer: {
    //     flexDirection: 'row', // Places prices horizontally
    //     alignItems: 'center', // Vertically aligns the text
    //     justifyContent: 'flex-start', // Ensures prices align to the left
    //     marginVertical: 5, // Adds spacing around the container
    //     paddingHorizontal: 10, // Adds some padding inside the container
    // },

    mrpText: {
        fontSize: 14,
        fontFamily: PoppinsLight,
        color: 'gray',
        textDecorationLine: 'line-through',
        lineHeight: 18,
        marginLeft: 10
    },
    sellingPriceText: {
        fontSize: 16,
        fontFamily: PoppinsMedium,
        color: BLACK,
        lineHeight: 22,
        marginLeft: 10
    },
});