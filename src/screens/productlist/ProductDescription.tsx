import { Image, Text, View } from 'react-native';
import { ProductStyle } from './ProductStyle';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import {useTranslation} from 'react-i18next'

const ProductDescription = (productId: any) => {
    const item = productId?.productDetail?.description
    const { t, i18n } = useTranslation(); 
    return (
        <View style={ProductStyle.subBody}>
            {(item || []).map((item: any, index: any) => {
                return (
                    <View key={index} style={{ marginVertical: 15 }}>
                        {item.product_description &&
                            <View> <TextPoppinsMediumBold style={ProductStyle.productName}>Description</TextPoppinsMediumBold>
                                <TextPoppinsSemiBold style={ProductStyle.productDescription}>{item.product_description}</TextPoppinsSemiBold>
                            </View>}
                        <View style={{ marginVertical: 15 }}>
                            <TextPoppinsMediumBold style={ProductStyle.productName}> {t('Measurement')}</TextPoppinsMediumBold>
                            <TextPoppinsSemiBold style={ProductStyle.productDescription}>{item.use} {item?.quantity}</TextPoppinsSemiBold>
                            <TextPoppinsSemiBold style={ProductStyle.productDescription}>{item.marathi_use}- {item?.marathi_quantity}</TextPoppinsSemiBold>
                        </View>
                        <View style={{ marginVertical: 15 }}>
                            <TextPoppinsMediumBold style={ProductStyle.productName}> {t('Work')}</TextPoppinsMediumBold>
                            <TextPoppinsSemiBold style={ProductStyle.productDescription}>{item.work}</TextPoppinsSemiBold>
                            <TextPoppinsSemiBold style={ProductStyle.productDescription}>{item.marathi_work}</TextPoppinsSemiBold>
                        </View>
                    </View>
                )
            }
            )}
        </View>
    );
};

export default ProductDescription;
