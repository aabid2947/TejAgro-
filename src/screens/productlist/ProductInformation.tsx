import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { BLACK, PoppinsLight, PoppinsMedium, WHITE } from '../../shared/common-styles/colors';
import MinusButtonIcon from '../../svg/MinusButtonIcon';
import PlusButtonIcon from '../../svg/PlusButtonIcon';
import { ProductStyle } from './ProductStyle';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import { t } from 'i18next';
import { clearSelectedPromoCode } from '../../reduxToolkit/counterSlice';
import { useDispatch } from 'react-redux';

const ProductInformationScreen = ({ productDetail, quantity, setQuantity }: any) => {
    const dispatch = useDispatch()
    const item = productDetail;
    const volumeRegex = /(\d+)\s*(ml|ltr|lit|gram|gm|kg)/i;
    console.log(item)
    const productsWithVolume = item.map((product: any) => {
        const match = product.product_name.match(volumeRegex);
        return {
            product_name: product.product_name,
            volume: match ? match[0] : "Volume not found"
        };
    });

    const onIncrement = (value: number) => {
        setQuantity((prevCount: any) => Math.max(1, prevCount + value));
        dispatch(clearSelectedPromoCode());
    };

    const onChangeInput = (text: string) => {
        const num = Number(text.replace(/\D/g, ""));
        setQuantity(Math.max(1, num));
    };

    return (
        <View style={ProductStyle.subBody}>
            {item.map((item: any, index: any) => (
                <View key={index}>
                    {/* <TextPoppinsSemiBold style={ProductStyle.productName}>{item.product_name}</TextPoppinsSemiBold> */}
                    <TextPoppinsSemiBold style={ProductStyle.productName}>{item.product_marathi_name ? item.product_marathi_name : item.product_name}</TextPoppinsSemiBold>
                    <View style={ProductStyle.subBodyView}>
                        <View style={{ flexDirection: "column" }}>
                            {item.total_amount !== Number(item.mrp).toFixed(2) && item.mrp && (<TextPoppinsSemiBold style={styles.mrpText}> {t("MRP")}: ₹{item.mrp}</TextPoppinsSemiBold>)}
                            <TextPoppinsSemiBold style={styles.sellingPriceText}> {t("SELLING_PRICE")}: ₹{item.total_amount ? item.total_amount : item.selling_price}</TextPoppinsSemiBold>
                        </View>
                        <View style={ProductStyle.iconView}>
                            <Pressable onPress={() => onIncrement(-1)}>
                                <MinusButtonIcon width={40} height={40}></MinusButtonIcon>
                            </Pressable>
                            <View style={ProductStyle.countCard}>
                                <TextInput
                                    editable={false}
                                    style={ProductStyle.textView}
                                    allowFontScaling={false}
                                    keyboardType="numeric"
                                    maxLength={2}
                                    value={String(quantity)}
                                    onChangeText={(text) => onChangeInput(text)}
                                />
                            </View>
                            <Pressable onPress={() => onIncrement(1)}>
                                <PlusButtonIcon width={40} height={40} color={WHITE}></PlusButtonIcon>
                            </Pressable>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};
const styles = StyleSheet.create({
    mrpText: {
        fontSize: 16,
        fontFamily: PoppinsLight,
        color: 'gray',
        textDecorationLine: 'line-through',
        marginRight: 8,
        lineHeight: 30
    },
    sellingPriceText: {
        fontSize: 16,
        fontFamily: PoppinsMedium,
        color: BLACK,
        marginRight: 5,
        lineHeight: 30
    },
})

export default ProductInformationScreen;
