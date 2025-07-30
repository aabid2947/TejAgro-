import { Image, View } from 'react-native';
import { ProductStyle } from './ProductStyle';
import { regexImage } from '../../shared/utilities/String';

const ProductImageScreen = (productDetail: any) => {
    const item = productDetail?.productDetail
    return (
        <View style={ProductStyle.subBody}>
            {(regexImage.test(item[0]?.product_image)) ?
                <Image borderRadius={12}
                    source={{ uri: item[0]?.product_image }}
                    style={ProductStyle.imgView} />
                :
                <Image borderRadius={12}
                    source={require("../../assets/defaultProduct.png")}
                    style={ProductStyle.imgView} />}
        </View>
    );
};

export default ProductImageScreen;
