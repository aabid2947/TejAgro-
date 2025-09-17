import React, { useState } from 'react';
import { Image, Text, View, Pressable } from 'react-native';
import { ProductStyle } from './ProductStyle';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import { useTranslation } from 'react-i18next';
import { MDBLUE, BLACK } from '../../shared/common-styles/colors';

const ProductDescription = (productId: any) => {
    const item = productId?.productDetail?.description;
    const { t, i18n } = useTranslation();
    const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});

    const toggleExpanded = (index: number) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <View style={ProductStyle.subBody}>
            {(item || []).map((item: any, index: any) => {
                const isExpanded = expandedItems[index] || false;
                
                return (
                    <View key={index} style={{ marginVertical: 15 }}>
                        {item.product_description &&
                            <View> 
                                <TextPoppinsMediumBold style={ProductStyle.productName}>Description</TextPoppinsMediumBold>
                                <TextPoppinsSemiBold style={ProductStyle.productDescription}>{item.product_description}</TextPoppinsSemiBold>
                            </View>
                        }
                        <View style={{ marginVertical: 15 }}>
                            <TextPoppinsMediumBold style={ProductStyle.productName}> {t('Measurement')}</TextPoppinsMediumBold>
                            <TextPoppinsSemiBold style={ProductStyle.productDescription}>{item.use} {item?.quantity}</TextPoppinsSemiBold>
                            <TextPoppinsSemiBold style={ProductStyle.productDescription}>{item.marathi_use}- {item?.marathi_quantity}</TextPoppinsSemiBold>
                        </View>
                        
                        <View style={{ marginVertical: 15 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TextPoppinsMediumBold style={ProductStyle.productName}> {t('Work')}</TextPoppinsMediumBold>
                                <Pressable 
                                    onPress={() => toggleExpanded(index)}
                                    style={viewMoreButtonStyle}
                                >
                                    <TextPoppinsSemiBold style={viewMoreTextStyle}>
                                        {isExpanded ? t('View_Less') : t('View_More')}
                                    </TextPoppinsSemiBold>
                                </Pressable>
                            </View>
                            
                            {isExpanded && (
                                <View style={{ marginTop: 10 }}>
                                    <Text numberOfLines={8} style={ProductStyle.productDescription}>{item.work}</Text>
                                    <Text numberOfLines={8} style={ProductStyle.productDescription}>{item.marathi_work}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )
            })}
        </View>
    );
};

const viewMoreButtonStyle = {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: MDBLUE,
    borderRadius: 6,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
};

const viewMoreTextStyle = {
    color: BLACK,
    fontSize: 12,
    lineHeight: 16,
};

export default ProductDescription;
