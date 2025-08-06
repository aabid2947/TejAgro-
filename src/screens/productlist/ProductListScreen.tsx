import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AuthApi from '../../api/AuthApi';
import { ProductItem } from '../../components/commonComponent/ProductItem';
import { LoaderScreen } from '../../components/loaderview/LoaderScreen';
import NoRecordFound from '../../components/noRecordFound/NoRecordFound';
import SearchInput from '../../components/searchInput/SearchInput';
import { selectedCropProduct, setTotalItems } from '../../reduxToolkit/counterSlice';
import { RootState } from '../../reduxToolkit/store';
import { MENUBAR_SCREEN } from '../../routes/Routes';
import { WHITE } from '../../shared/common-styles/colors';
import { headerView } from '../../shared/components/CommonUtilities';
import CrossIcon from '../../svg/CrossIcon';
import { DashboardStyle } from '../dashboard/DashboardStyle';
import { ProductListStyle } from './ProductListStyle';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import { jwtDecode } from 'jwt-decode';
import CustomCaraosel from "../../components/customCarousel/CustomCarousel";
const ProductListScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [refresh, setRefresh] = useState(false)
    const [isLoader, setLoader] = useState(true);
    const [banner, setBanner] = useState([])
    const [productData, setProductData] = useState([]);
    const selectedCrop: any = useSelector((state: RootState) => state.counter.selectedCrop)
    const userData: any = useSelector((state: RootState) => state.counter.isUserinfo)
    const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo)
    const totalItems: any = useSelector((state: RootState) => state.counter.totalItems)
    const isUserData = useSelector((state: any) => state.counter.isUserinfo)
    const handleSnapToItem = (index: number) => {
    };

    const dispatch = useDispatch()

    const loadBanner = async () => {
            // setLoader(true);
            console.log("Loading banners...");
            try {
                const bannerResponse = await AuthApi.getBanners()
                
                
                 console.log("Banner response:", bannerResponse.data);
                if (bannerResponse ) {
                    setBanner(bannerResponse?.data?.dashboard_slider || []);
                } else {
                    console.log("Received undefined response from APIs");
                }
            } catch (error: any) {
                console.log("Error loading data:", error.response || error);
            } finally {
                // setLoader(false);
            }
        };
    

    const decodedTokens = (token: string) => {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.log('Error decoding JWT token:', error);
            return null;
        }
    };


    const token = isUserData?.jwt;
    const decodedToken: any = decodedTokens(token);


    const getCartDetail = async () => {
        const payload = {
            "client_id": decodedToken?.data?.client_id
        };
        try {
            setLoader(true);
            const response = await AuthApi.getCartDetails(payload,token);
            if (response && response.data && Array.isArray(response.data)) {
                const numberofItems = response.data.reduce((total: number, item: any) => total + Number(item.quantity), 0)
                dispatch(setTotalItems(numberofItems))
            } else {
                dispatch(setTotalItems(0));
            }
            setLoader(false);
        }
        catch (error: any) {
            setLoader(false);
        }
    };


    const onRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false)
            getProductList()
            getCartDetail()
            loadBanner()
        }, 1000)
    }
    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query) {
            const payload = { "search": query }
            const filtered = await AuthApi.searchProduct(payload, userData?.jwt)
            setFilteredProducts(filtered.data);
        } else {
            setFilteredProducts([]);
        }
    };
    useEffect(() => {
        // setTimeout(() => {
            getProductList()
            getCartDetail()
            loadBanner()
        // }, 1000)

    }, [])
    const getProductList = async () => {
        try {
            setLoader(true)
            const response = await AuthApi.getProductList();
 
            setProductData(response?.data);
            setLoader(false);
        } catch (error: any) {
            console.log(error.response.data.error, "errorerror");
            setLoader(false)
        }
    };
    const handleCardPress = (id: any) => {
        const filter: any = selectedCrop.filter((item: any) => item?.id != id)
        dispatch(selectedCropProduct(filter))
        setLoader(false)
    };

    const renderCategory = (item: any, index: any) => {
        return (
            <View style={{ marginTop: 10 }} key={item?.id + index}>
                <View style={{
                    ...DashboardStyle.productImage1
                }}
                />
                <Pressable onPress={() => handleCardPress(item?.id)} style={({ pressed }) => [{ ...ProductListStyle.pressablCross, opacity: pressed ? 0.2 : 1 }]}>
                    <CrossIcon height={10} width={10} color={WHITE} />
                </Pressable>
                <Text style={ProductListStyle.textCrop}>{item?.name}</Text>
            </View>
        )
    }

    const onPressSide = () => {
        navigation.navigate(MENUBAR_SCREEN)
    }

    return (
        <SafeAreaView style={ProductListStyle.main}>
            {headerView(`Hi, ${profileDetail?.client_name || ""}`, "Enjoy our services", onPressSide, totalItems, navigation)}
              {banner?.length > 0 && <CustomCaraosel
                data={banner}
                onSnapToItem={handleSnapToItem}
            />}
            <View style={ProductListStyle.container}>
                <SearchInput
                    placeholder={t('SEARCH_HERE')}
                    value={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                    onChangeText={handleSearch} />
                {isLoader ?
                    <LoaderScreen /> :
                    <FlatList
                        data={!searchQuery ? productData : filteredProducts}
                        numColumns={2}
                        keyExtractor={(item: any) => item.product_id}
                        renderItem={({ item, index }: any) => {
                            return <ProductItem data={item} index={index} />;
                        }}
                        ListEmptyComponent={!isLoader && <NoRecordFound style={ProductListStyle.noDataTxt} />}
                        refreshing={refresh}
                        ListHeaderComponent={() => {
                            return (
                                <TextPoppinsMediumBold style={ProductListStyle.headerText}>
                                    {t('ALL_PRODUCT')}
                                </TextPoppinsMediumBold>
                            )
                        }}
                        onRefresh={onRefresh}
                        columnWrapperStyle={DashboardStyle.columnView}
                        showsVerticalScrollIndicator={false}
                    />
                }
            </View>
        </SafeAreaView>
    );
};
export default ProductListScreen;