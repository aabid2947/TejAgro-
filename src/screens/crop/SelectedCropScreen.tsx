import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import AuthApi from '../../api/AuthApi';
import { CropItem } from '../../components/commonComponent/CropItem';
import { LoaderScreen } from '../../components/loaderview/LoaderScreen';
import NoRecordFound from '../../components/noRecordFound/NoRecordFound';
import SearchInput from '../../components/searchInput/SearchInput';
import { RootState } from '../../reduxToolkit/store';
import { MENUBAR_SCREEN } from '../../routes/Routes';
import { headerView } from '../../shared/components/CommonUtilities';
import { DashboardStyle } from '../dashboard/DashboardStyle';
import { ProductListStyle } from '../productlist/ProductListStyle';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import React from 'react';
const SelectedCropScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [refresh, setRefresh] = useState(false)
    const [isLoader, setLoader] = useState(false);
    const [productData, setProductData]: any = useState([]);
    const selectedCrop: any = useSelector((state: RootState) => state.counter.selectedCrop)
    const userData: any = useSelector((state: RootState) => state.counter.isUserinfo)
    const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo)
    const totalItems = useSelector((state: RootState) => state.counter.totalItems);

    const onRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false)
            selectedCropProduct()
        }, 1000)
    }
    const cropIdObject = selectedCrop.reduce((obj: any, item: any) => {
        obj[`crop_id`] = String(item.crop_id);
        return obj;
    }, {});

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query) {
            const filtered = productData?.stages?.filter((item: any) =>
                item.crop_stage_name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    };
    useEffect(() => {
        selectedCropProduct()
    }, [])
    const selectedCropProduct = async () => {
        try {
            setLoader(true)
            const response = await AuthApi.cropStages(cropIdObject)
            setProductData(response?.data)
            setLoader(false)
        } catch (error: any) {
            console.log(error.response.data.error, "errorerror");
            setLoader(false)
        }
    };

    const renderCategory = (item: any, index: any) => {
        return (
            <View style={{ marginTop: 10 }} key={item?.id + index}>
                <View style={{
                    ...DashboardStyle.productImage1
                }}
                >
                    <Image source={{ uri: item?.crop_image }} style={{ height: 45, width: 45, resizeMode: "contain", borderRadius: 40, overflow: "hidden" }} alt='img' />
                </View>
                <TextPoppinsSemiBold style={ProductListStyle.textCrop}>{item?.crop_marathi_name}</TextPoppinsSemiBold>
            </View>
        )
    }

    const onPressSide = () => {
        navigation.navigate(MENUBAR_SCREEN)
    }

    return (
        <SafeAreaView style={ProductListStyle.main}>
            {headerView(`Hi, ${profileDetail?.client_name || ""}`, "Enjoy our services", onPressSide, totalItems, navigation
            )}
            <View style={ProductListStyle.container}>
                {/* <SearchInput
                    placeholder={t('SEARCH_HERE')}
                    value={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                    onChangeText={handleSearch} /> */}
                {selectedCrop?.length > 0 &&
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <TextPoppinsMediumBold style={ProductListStyle.titleSelectText}>{t('SELECTED')}</TextPoppinsMediumBold>
                            <FlatList
                                style={{ marginLeft: 0 }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                initialNumToRender={4}
                                data={selectedCrop}
                                renderItem={({ item, index }: any) => renderCategory(item, index)}
                            />
                        </View>
                        <View style={{ marginLeft: '-10%', marginBottom: '-8%' }}>
                            {productData?.message ? null :
                                <Text style={[ProductListStyle.headerText, ProductListStyle.headerTextCommon]}>
                                    पीक वाढीची अवस्था निवडा
                                </Text>
                            }
                        </View>
                    </View>
                }
                <View style={ProductListStyle.dividerStyle}></View>
                {isLoader ?
                    <LoaderScreen /> :
                    <FlatList
                        data={!searchQuery ? productData?.stages : filteredProducts}
                        // numColumns={2}
                        keyExtractor={(item: any) => item.crop_stage_id}
                        renderItem={({ item }: any) => <CropItem data={item} selectedCrop={selectedCrop} />}
                        ListEmptyComponent={<NoRecordFound style={ProductListStyle.noDataTxt} />}
                        refreshing={refresh}
                        onRefresh={onRefresh}
                        // ListHeaderComponent={() => {
                        //     return (
                        //         <>
                        //             {productData?.message ? null :
                        //                 <Text style={[ProductListStyle.headerText, ProductListStyle.headerTextCommon]}>
                        //                     पीक वाढीची अवस्था निवडा
                        //                 </Text>
                        //             }
                        //         </>
                        //     )
                        // }}
                        // columnWrapperStyle={DashboardStyle.columnView}
                        showsVerticalScrollIndicator={false}
                    />
                }
            </View>
        </SafeAreaView>
    );
};

export default SelectedCropScreen;
