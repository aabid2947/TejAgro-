import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import AuthApi from '../../api/AuthApi';
import { LoaderScreen } from '../../components/loaderview/LoaderScreen';
import NoRecordFound from '../../components/noRecordFound/NoRecordFound';
import { RootStackParamList } from '../../routes/AppRouter';
import { MENUBAR_SCREEN, PRODUCT_SCREEN } from '../../routes/Routes';
import { headerView } from '../../shared/components/CommonUtilities';
import BackButtonIcon from '../../svg/BackButtonIcon';
import { ProductListStyle } from '../productlist/ProductListStyle';
import { CropSelectedStyle } from './CropSelectedStyle';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import { regexImage } from '../../shared/utilities/String';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CropMapScreen = (params: any) => {
    const navigation: any = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo)
    const totalItems = useSelector((state: RootState) => state.counter.totalItems);
    const { t } = useTranslation();
    const insets = useSafeAreaInsets()
    const [isLoader, setLoader] = useState(false);
    const [productData, setProductData]: any = useState({});
    const cropData = params.route.params.selectedCrop
    const cropId = cropData[0].crop_id;
    const [refreshing] = React.useState(false);

    const onRefresh = () => {
        setTimeout(() => {
            selectedCropProduct()
        }, 1000)
    }
    useEffect(() => {
        selectedCropProduct()
    }, [])
    const selectedCropProduct = async () => {
        const payload = {
            "crop_id": cropId,
            "stage_id": params.route.params.data?.crop_stage_id
        }
        try {
            setLoader(true)
            const response = await AuthApi.cropMapping(payload)
            setProductData(response?.data)
            setLoader(false)
        } catch (error: any) {
            console.log(error.response.data.error, "errorerror");
            setLoader(false)
        }
    };
    const onPressSide = () => {
        navigation.navigate(MENUBAR_SCREEN)
    }
    const renderProductItem = (item: any) => {
        return (
            <Pressable style={CropSelectedStyle.productCard} key={item?.index} onPress={() => navigation.navigate(PRODUCT_SCREEN, item?.item)}>
                {(regexImage.test(item.item?.product_image)) ?
                    <Image
                        source={{ uri: item.item?.product_image }}
                        style={CropSelectedStyle.productImage}
                    /> :
                    <Image
                        source={require('../../assets/defaultProduct.png')}
                        style={CropSelectedStyle.productImage}
                    />
                }

                <TextPoppinsSemiBold style={CropSelectedStyle.productName}>{item.item?.product_marathi_name || item.item?.product_name}</TextPoppinsSemiBold>
                <View style={{ marginTop: 'auto' }}>
                    <View style={[CropSelectedStyle.priceContainer]}>
                        <TextPoppinsSemiBold style={CropSelectedStyle.sellingPriceText}>₹{item.item?.total_amount ? item.item?.total_amount : item.item?.total_amount}</TextPoppinsSemiBold>
                        {item.item?.total_amount !== Number(item.item?.mrp).toFixed(2) && item.item?.mrp && (<TextPoppinsSemiBold style={CropSelectedStyle.mrpText}>₹{item.item?.mrp}</TextPoppinsSemiBold>)}
                    </View>

                    <Pressable style={CropSelectedStyle.cartButtonStyle} onPress={() => navigation.navigate(PRODUCT_SCREEN, item?.item)}>
                        <TextPoppinsMediumBold style={CropSelectedStyle.buyButtonText}>{t('Buy_Now')}</TextPoppinsMediumBold>
                    </Pressable>
                </View>
            </Pressable>
        )
    }

    const renderStage = (stage: any) => (
        <View key={stage.marathi_stage_description}>
            <TextPoppinsSemiBold style={CropSelectedStyle.stageHeader}>{stage.marathi_stage_description}</TextPoppinsSemiBold>
            <FlatList
                horizontal
                data={stage.product_details}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.product_id}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
    console.log(productData)

    return (
        <SafeAreaView style={[ProductListStyle.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {headerView(`Hi, ${profileDetail?.client_name || ""}`, "Enjoy our services", onPressSide, totalItems, navigation)}
            {productData?.message ?
                <NoRecordFound style={ProductListStyle.noDataTxt} /> :
                <>
                    {
                        isLoader ?
                            <LoaderScreen /> :
                            <>
                                <View style={CropSelectedStyle.backIcon}>
                                    <Pressable onPress={() => navigation.goBack()}>
                                        <BackButtonIcon height={28} width={28} />
                                    </Pressable>
                                    <View >
                                        <TextPoppinsMediumBold style={CropSelectedStyle.header}>
                                            {productData.marathi_crop_stage_name}
                                        </TextPoppinsMediumBold>
                                    </View>
                                </View>
                                <View style={ProductListStyle.horizontalContainer}>
                                    <ScrollView style={CropSelectedStyle.container} refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={onRefresh}
                                        />
                                    }>

                                        <View>
                                            {(productData?.description || []).map((stage: any) => renderStage(stage))}
                                        </View>
                                    </ScrollView>
                                </View>
                            </>
                    }
                </>
            }
        </SafeAreaView>
    );
};

export default CropMapScreen;
