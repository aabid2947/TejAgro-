import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, SafeAreaView, ToastAndroid, View } from 'react-native';
import { useSelector } from 'react-redux';
import AuthApi from '../../api/AuthApi';
import TopHeaderFixed from '../../components/headerview/TopHeaderFixed';
import { RootState } from '../../reduxToolkit/store';
import { RootStackParamList } from '../../routes/AppRouter';
import { CustomButton } from '../../shared/components/CommonUtilities';
import ProductDescription from './ProductDescription';
import ProductImageScreen from './ProductImageScreen';
import ProductInformationScreen from './ProductInformation';
import { ProductListStyle } from './ProductListStyle';
import { jwtDecode } from 'jwt-decode';
import { LoaderScreen } from '../../components/loaderview/LoaderScreen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { clearSelectedPromoCode, setTotalItems } from '../../reduxToolkit/counterSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProductScreen = (props: any) => {
    const { t } = useTranslation();
    const [isLoader, setLoader] = useState(false);
    const insets = useSafeAreaInsets()
    const [productDetail, setProductDetail]: any = useState([]);
    const [quantity, setQuantity] = useState(1);
    const navigation: any = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const userData: any = useSelector((state: RootState) => state.counter.isUserinfo)
    const totalItems: any = useSelector((state: RootState) => state.counter.totalItems)
    const profileInfo: any = useSelector((state: RootState) => state.counter.isProfileInfo)
    const dispatch = useDispatch();
    const [productDescription, setProductDescription]: any = useState({});

    const productId = props?.route.params?.data?.product_id || props?.route.params?.product_id
    useEffect(() => {
        getList()
        getProductDescription();
    }, [])

    const decodeToken = (token: string) => {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.log('Error decoding JWT token:', error);
            return null;
        }
    };

    const token = userData?.jwt;
    const decodedToken: any = decodeToken(token);
    const getList = async () => {
        const payload = {
            "product_id": productId
        }
        try {
            setLoader(true)
            const response = await AuthApi.getProductDetailById(payload, userData?.jwt)
            // console.log(response?.data)
            setProductDetail(response?.data)
            setLoader(false)
        } catch (error: any) {
            setLoader(false)
        }
    };
    const onAddToCart = async () => {
        const payload = {
            "product_id": productDetail[0]?.product_id,
            "quantity": quantity || 1,
            "client_id": decodedToken?.data?.client_id || "412809"
        }
        try {
            dispatch(clearSelectedPromoCode());
            setLoader(true)
            const response = await AuthApi.addToCart(payload, userData?.jwt)
            console.log(response)
            if (response && response?.data) {
                dispatch(setTotalItems(totalItems + quantity))
                navigation.goBack()
                ToastAndroid.show("Product added to cart !", ToastAndroid.SHORT)
            } else { navigation.goBack() }
            setLoader(false)
        } catch (error: any) {
            setLoader(false)
            ToastAndroid.show(error?.response?.data?.message || 'Product Not Found', ToastAndroid.SHORT);
        }
    }
    const getProductDescription = async () => {
        const payload = {
            "product_id": productId
        }
        try {
            setLoader(true)
            const response = await AuthApi.productDescription(payload)
            setProductDescription(response?.data)
            setLoader(false)
        } catch (error: any) {
            console.log(error.response.data.error, "errorerror");
            setLoader(false)
        }
    };

    return (
        <SafeAreaView style={[ProductListStyle.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <TopHeaderFixed
                leftIconSize={20}
                headerTxt={t('DETAIL')}
                gobackText={true}
                onGoBack={() => navigation.goBack()}
                topHeight={100} />
            <View style={ProductListStyle.container}>
                {isLoader ?
                    <LoaderScreen />
                    :
                    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}
                        style={{ marginBottom: 50 }}>
                        <ProductImageScreen productDetail={productDetail} />
                        <ProductInformationScreen productDetail={productDetail}
                            quantity={quantity}
                            setQuantity={setQuantity} />
                        {productDescription?.description && <ProductDescription productDetail={productDescription} />}
                    </KeyboardAwareScrollView>
                }
                <View style={ProductListStyle.addToCartButton}>
                    {CustomButton(`${t("ADD_CART")}`, onAddToCart)}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ProductScreen;
