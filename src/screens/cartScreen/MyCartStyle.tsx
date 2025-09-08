import { StyleSheet } from "react-native";
import { BLACK, GRAY_BORDER, MDBLUE, WHITE } from "../../shared/common-styles/colors";
import { heightPercentageToDP } from "react-native-responsive-screen";


export const MyCartStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
   
    itemDetails: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color:BLACK,
        lineHeight:21
    },
    itemVolume: {
        fontSize: 14,
        color: '#666',
    },
    itemPrice: {
        fontSize: 16,
        color: '#000',
        marginTop: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        padding: 8,
        backgroundColor: '#ddd',
        borderRadius: 4,
    },
    quantityText: {
        marginHorizontal: 8,
        fontSize: 16,
    },
    noDataTxt: {
        marginTop: heightPercentageToDP(30)
    },
    
   
    checkoutButton: {
        backgroundColor: '#8BC34A',
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});