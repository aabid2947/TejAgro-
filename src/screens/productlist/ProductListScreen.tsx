import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, FlatList, Pressable, SafeAreaView, Text, View, Image, StyleSheet, Dimensions, Linking, TouchableOpacity } from 'react-native';
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
import FacebookIcon from '../../svg/FacebookIcon';
import InstagramIcon from '../../svg/InstagramIcon';
import LinkedInIcon from '../../svg/LinkedInIcon';
import YouTubeIcon from '../../svg/YouTubeIcon';
import WhatsAppIcon from '../../svg/WhatsAppIcon';
import { DashboardStyle } from '../dashboard/DashboardStyle';
import { ProductListStyle } from './ProductListStyle';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import { jwtDecode } from 'jwt-decode';
import CustomCaraosel from "../../components/customCarousel/CustomCarousel";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');
const BANNER_HEIGHT = height * 0.28; // Dynamic height based on screen height

const ProductListScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [refresh, setRefresh] = useState(false)
    const [isLoader, setLoader] = useState(true);
    const [banner, setBanner] = useState([])
    const [productData, setProductData] = useState([]);
    const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo)
    const totalItems: any = useSelector((state: RootState) => state.counter.totalItems)
    const isUserData = useSelector((state: any) => state.counter.isUserinfo)

    const insets = useSafeAreaInsets();
    const scrollY = useRef(new Animated.Value(0)).current;
    const dispatch = useDispatch();

    const handleSnapToItem = (index: number) => { };

    // Scroll Logic: Move banner up as we scroll
    const bannerTranslateY = scrollY.interpolate({
        inputRange: [0, BANNER_HEIGHT],
        outputRange: [0, -BANNER_HEIGHT - BANNER_HEIGHT],
        extrapolate: 'clamp'
    });

    const openSocialMedia = (platform: string) => {
        let url = '';
        //         Instagram - https://www.instagram.com/tejagrotech/
        // Facebook - https://www.facebook.com/tejagrotechindia/
        // Linkedin - https://www.linkedin.com/company/101432630/admin/page-posts/published/
        switch (platform) {
            case 'facebook':
                url = 'https://www.facebook.com/tejagrotechindia/';
                break;
            case 'instagram':
                const username = 'tejagrotech';
                const appUrl = `instagram://user?username=${username}`;
                const webUrl = `https://www.instagram.com/${username}/`;

                Linking.canOpenURL(appUrl)
                    .then(supported => supported ? Linking.openURL(appUrl) : Linking.openURL(webUrl))
                    .catch(() => Linking.openURL(webUrl));
                return;
                // break;
            case 'linkedin':
                url = 'https://www.linkedin.com/company/101432630/admin/page-posts/published/';
                break;
            case 'youtube':
                url = 'https://www.youtube.com/@tejagrotech123';
                break;
            case 'whatsapp':
                const phoneNumber = '+919130530591';
                const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
                Linking.canOpenURL(whatsappUrl).then((supported) => {
                    if (supported) {
                        return Linking.openURL(whatsappUrl);
                    } else {
                        return Linking.openURL(`https://wa.me/${phoneNumber.replace('+', '')}`);
                    }
                }).catch((err) => console.error('Error opening WhatsApp:', err));
                return;
        }
        Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
    };

    const loadBanner = async () => {
        try {
            const bannerResponse = await AuthApi.getBanners();
            if (bannerResponse) {
                setBanner(bannerResponse?.data?.dashboard_slider || []);
            }
        } catch (error: any) {
            console.log("Error loading banners:", error);
        }
    };

    const getCartDetail = async () => {
        const token = isUserData?.jwt;
        const decodedToken: any = jwtDecode(token);
        const payload = { "client_id": decodedToken?.data?.client_id };
        try {
            setLoader(true);
            const response = await AuthApi.getCartDetails(payload, token);
            if (response?.data && Array.isArray(response.data)) {
                const numberofItems = response.data.reduce((total: number, item: any) => total + Number(item.quantity), 0)
                dispatch(setTotalItems(numberofItems))
            }
            setLoader(false);
        } catch (error: any) {
            setLoader(false);
        }
    };

    const getProductList = async () => {
        try {
            setLoader(true)
            const response = await AuthApi.getProductList();
            setProductData(response?.data);
            setLoader(false);
        } catch (error: any) {
            setLoader(false)
        }
    };

    useEffect(() => {
        getProductList();
        getCartDetail();
        loadBanner();
    }, []);

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
            const filtered = await AuthApi.searchProduct(payload, isUserData?.jwt)
            setFilteredProducts(filtered.data);
        } else {
            setFilteredProducts([]);
        }
    };

    const onPressSide = () => {
        navigation.navigate(MENUBAR_SCREEN)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: WHITE, paddingBottom: insets.bottom }}>
            {/* 1. FIXED HEADER & SEARCH BAR AREA */}
            <View style={{ zIndex: 10, backgroundColor: WHITE, paddingTop: insets.top }}>
                {headerView(`Hi, ${profileDetail?.client_name || ""}`, "Enjoy our services", onPressSide, totalItems, navigation, undefined)}

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 15, paddingBottom: 10 }}>
                    <TouchableOpacity onPress={() => openSocialMedia('whatsapp')}>
                        <WhatsAppIcon width={30} height={30} color='#25D366' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openSocialMedia('youtube')}>
                        <YouTubeIcon width={30} height={30} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openSocialMedia('instagram')}>
                        <InstagramIcon width={30} height={30} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openSocialMedia('facebook')}>
                        <FacebookIcon width={30} height={30} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openSocialMedia('linkedin')}>
                        <LinkedInIcon width={30} height={30} />
                    </TouchableOpacity>
                </View>

                <View style={{ paddingHorizontal: '5%', paddingBottom: 10 }}>
                    <SearchInput
                        placeholder={t('SEARCH_HERE')}
                        value={searchQuery}
                        setSearchQuery={setSearchQuery}
                        searchQuery={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            <View style={ProductListStyle.container}>
                {/* 2. ABSOLUTE CAROUSEL: Hides behind Header/Search when scrolled */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: BANNER_HEIGHT,
                        // borderWidth:1,
                        zIndex: 1, // Lower than Header (10) but higher than List background
                        transform: [{ translateY: bannerTranslateY }]
                    }}>
                    <View style={{ marginHorizontal: '0%', overflow: 'visible' }}>
                        {banner?.length > 0 && (
                            <CustomCaraosel
                                data={banner}
                                onSnapToItem={handleSnapToItem}
                            />
                        )}
                    </View>
                </Animated.View>

                {isLoader ? (
                    <View style={ProductListStyle.loaderOverlay}>
                        <LoaderScreen />
                    </View>
                ) : (
                    <Animated.FlatList
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true }
                        )}
                        data={!searchQuery ? productData : filteredProducts}
                        numColumns={2}
                        keyExtractor={(item: any) => item.product_id}
                        renderItem={({ item, index }: any) => (
                            <ProductItem data={item} index={index} />
                        )}
                        ListEmptyComponent={!isLoader && <NoRecordFound style={ProductListStyle.noDataTxt} />}
                        refreshing={refresh}
                        onRefresh={onRefresh}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={DashboardStyle.columnView}

                        // 3. THE MAGIC: PaddingTop creates the initial space for the carousel
                        contentContainerStyle={{
                            paddingTop: BANNER_HEIGHT + BANNER_HEIGHT * 0.1,
                            paddingBottom: 100
                        }}

                        ListHeaderComponent={
                            <View>
                                <TextPoppinsMediumBold style={ProductListStyle.headerText}>
                                    {t('ALL_PRODUCT')}
                                </TextPoppinsMediumBold>
                            </View>
                        }
                    />
                )}
                {/* {isLoader ? (
                    <View style={ProductListStyle.loaderOverlay}>
                        <LoaderScreen />
                    </View>
                ) : null} */}
            </View>

        </SafeAreaView>
    );
};

export default ProductListScreen;