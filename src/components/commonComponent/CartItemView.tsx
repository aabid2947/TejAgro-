import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BLACK, MDBLUE, WHITE } from "../../shared/common-styles/colors";
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold";
import TextPoppinsSemiBold from "../../shared/fontFamily/TextPoppinsSemiBold";
import { useState } from "react";

export const CartItemView = ({ item, decrementQuantity, incrementQuantity, index }: any) => {
    const [imageError, setImageError] = useState(false);
    const volumeRegex = /(\d+)\s*(ml|ltr|lit|gram|gm|kg)/i;
    const extractVolume = (item: any) => {
        const match = item.product_name.match(volumeRegex);
        return match ? match[0].trim() : null;
    };
    const volume = extractVolume(item);
    return (
        <View style={style.cartItem} key={index}>
            <Image
                source={
                    imageError || !item?.product_image
                        ? require("../../assets/IconFertilizer.png")
                        : { uri: item?.product_image }
                }
                style={style.productImage}
                onError={() => setImageError(true)}
            />
            <View style={style.itemDetails}>
                <TextPoppinsMediumBold style={style.itemTitle}> {item.product_marathi_name || item.product_name}</TextPoppinsMediumBold>
                <TextPoppinsSemiBold style={style.itemVolume}>{volume || "0"}</TextPoppinsSemiBold>
                <TextPoppinsSemiBold style={style.itemVolume}>MRP: ₹{item?.mrp || "0"}</TextPoppinsSemiBold>
            </View>
            <View>
                <View style={style.quantityContainer}>
                    <TouchableOpacity onPress={() => decrementQuantity(item?.cart_id)} style={style.quantityButton}>
                        <TextPoppinsSemiBold style={style.minusIcon}>-</TextPoppinsSemiBold>
                    </TouchableOpacity>
                    <TextPoppinsSemiBold style={style.quantityText}>{item.quantity}</TextPoppinsSemiBold>
                    <TouchableOpacity onPress={() => incrementQuantity(item?.cart_id)} style={style.quantityButton}>
                        <TextPoppinsSemiBold style={style.minusIcon}>+</TextPoppinsSemiBold>
                    </TouchableOpacity>
                </View>
                <View style={style.priceView}>
                    <TextPoppinsMediumBold style={style.itemPrice}>₹ {item?.total_amount || "0"}</TextPoppinsMediumBold>
                </View>
            </View>
        </View>
    );
}


export const style = StyleSheet.create({
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginVertical: 8,
        elevation: 4,
        backgroundColor: WHITE,
        borderRadius: 10,
        marginHorizontal: 20
    },
    productImage: {
        width: 60,
        height: 60,
        marginRight: 16,
    },
    itemDetails: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 13,
        color: BLACK,
        lineHeight: 21
    },
    itemVolume: {
        fontSize: 14,
        color: '#666',
    },
    itemPrice: {
        fontSize: 16,
        color: BLACK,
        alignSelf: 'flex-end',
        lineHeight: 22
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 5
    },
    quantityButton: {
        backgroundColor: MDBLUE,
        borderRadius: 2,
        height: 24,
        width: 24,
        alignItems: 'center',
        justifyContent: 'center'
    },
    quantityText: {
        marginHorizontal: 8,
        fontSize: 16,
        color: BLACK,
        lineHeight: 21
    },
    priceView: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    minusIcon: {
        fontSize: 16,
        lineHeight: 22,
        color: BLACK,
        textAlign: 'center'
    }
})