import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Image, Pressable, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reduxToolkit/store";
import AuthApi from "../../api/AuthApi";
import CustomCaraosel from "../../components/customCarousel/CustomCarousel";
import { LoaderScreen } from "../../components/loaderview/LoaderScreen";
import NoRecordFound from "../../components/noRecordFound/NoRecordFound";
import PressableClick from "../../components/pressablebutton/PressableClick";
import { selectedCropProduct } from "../../reduxToolkit/counterSlice";
import { MENUBAR_SCREEN, MYCART_SCREEN, SELECTED_CROP_SCREEN } from "../../routes/Routes";
import { DARK_GREEN_New, WHITE } from "../../shared/common-styles/colors";
import { headerView, PressableB } from "../../shared/components/CommonUtilities";
import { ProductListStyle } from "../productlist/ProductListStyle";
import { DashboardStyle } from "./DashboardStyle";
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold";
import { regexImage } from "../../shared/utilities/String";
import SearchInput from "../../components/searchInput/SearchInput";
import CartSvg from "../../svg/CartSvg";

const Dashboard = ({ navigation }: any) => {
    const { t, i18n } = useTranslation();
    const [selectedId, setSelectedId] = useState("0");
    const [selecteProduct, setSelectedProduct]: any = useState([])
    const [refresh, setRefresh] = useState(false)
    const [isLoader, setLoader] = useState(false);
    const [banner, setBanner] = useState([])
    const [cropList, setCropList] = useState([])
    const [categoryData, setCategoryData]: any = useState([])
    const [selectedCategoryCropData, setSelectedCategoryCropData] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCrops, setFilteredCrops] = useState([]);
    const dispatch = useDispatch()
    const isLoggedIn: any = useSelector((state: RootState) => state.counter.login)
    const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo)
    const totalItems = useSelector((state: RootState) => state.counter.totalItems)
    const maxAttempts = 1;
    const attemptCount = useRef(0);
    const handleSnapToItem = (index: number) => {
    };
    useEffect(() => {
        if (selecteProduct.length > 0) {
            dispatch(selectedCropProduct(selecteProduct));
        }
    }, [selecteProduct]);

    useEffect(() => {
        setLoader(true)
        if (isLoggedIn) {
            const refreshInterval = setInterval(() => {
                if (attemptCount.current < maxAttempts) {
                    setLoader(true)
                    loadData();
                    attemptCount.current += 1;
                    setTimeout(() => setLoader(false), 7000);
                } else {
                    clearInterval(refreshInterval);
                }
                setLoader(false)
            }, 2000);
            return () => clearInterval(refreshInterval);
        }
        setLoader(false)
    }, [isLoggedIn]);

    const onRefresh = () => {
        setRefresh(true);
        loadData();
        setTimeout(() => {
            setRefresh(false);
        }, 1000);
    };

    const loadData = async () => {
        // setLoader(true);
        try {
            const [bannerResponse, cropResponse, categoryResponse] = await Promise.all([
                AuthApi.getBanners(),
                AuthApi.getCrops(),
                AuthApi.getCategory()
            ]);

            if (bannerResponse && cropResponse && categoryResponse) {
                setBanner(bannerResponse?.data?.dashboard_slider || []);
                setCropList(cropResponse?.data || []);
                const allCropsCategory = {
                    crop_category_id: "0",
                    crop_category_name: "All Crops",
                    marathi_crop_category_name: "सर्व पिके"
                };
                setCategoryData([
                    allCropsCategory,
                    ...(Array.isArray(categoryResponse?.data) ? categoryResponse?.data : []),
                ]);
            } else {
                console.log("Received undefined response from APIs");
            }
        } catch (error: any) {
            console.log("Error loading data:", error.response || error);
        } finally {
            // setLoader(false);
        }
    };

    const handleCardPress = async (id: any) => {
        if (id === selectedId) {
            setSelectedId("0");
            setSelectedCategoryCropData(cropList);
        } else {
            setSelectedId(id);
            const payload = {
                "crop_category_id": id
            };
            try {
                const response = await AuthApi.getCropByCategoryId(payload);
                if (response && response.data) {
                    setSelectedCategoryCropData(response.data);
                }
            } catch (error: any) {
                console.log("Error fetching crops by category:", error);
            }
        }
    };


    const onPressProduct = (item: any) => {
        const isSelected = selecteProduct.some((i: any) => i.crop_id === item.crop_id);
        if (isSelected) {
            setSelectedProduct([]);
        } else {
            setSelectedProduct([item]);
            setTimeout(() => {
                dispatch(selectedCropProduct([item]));
                navigation.navigate(SELECTED_CROP_SCREEN);
            }, 0);
        }
    };


    const renderNew = (item: any, index: any) => {
        const isSelected = selecteProduct.some((data: any) => data.crop_id == item.crop_id)
        return (
            <Pressable key={item?.crop_id + index} style={DashboardStyle.productContainer} onPress={() => onPressProduct(item)}>
                {(regexImage.test(item?.crop_image)) ? <Image
                    source={{ uri: item?.crop_image }}
                    style={DashboardStyle.logo}
                />
                    :
                    <Image
                        source={require('../../assets/defaultProduct.png')}
                        style={DashboardStyle.logo}
                    />
                }
                <View style={isSelected ? DashboardStyle.productContainerSelected : DashboardStyle.productContainer1}>
                    <TextPoppinsMediumBold style={DashboardStyle.productName}>{i18n.language === 'en' ? item?.crop_marathi_name : item?.crop_marathi_name}</TextPoppinsMediumBold>
                </View>
            </Pressable>
        )
    }

    const onNextClick = () => {
        dispatch(selectedCropProduct(selecteProduct))
        navigation.navigate(SELECTED_CROP_SCREEN)
    }

    const onPressSide = () => {
        navigation.navigate(MENUBAR_SCREEN)
    }
    const handleSearch = async (query: string) => {
        const trimmedQuery = query.trim();
        setSearchQuery(query);

        if (trimmedQuery) {
            try {
                const response = await AuthApi.getCrops();
                const filtered = response.data.filter((crop: any) =>
                    crop.crop_name.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
                    crop.crop_marathi_name.includes(trimmedQuery)
                );
                setFilteredCrops(filtered);
            } catch (error) {
                console.log("Error fetching crops:", error);
                setFilteredCrops([]);
            }
        } else {
            setFilteredCrops([]);
        }
    };
    ;
    return (
        <SafeAreaView style={DashboardStyle.mainCardView}>
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
                    onChangeText={handleSearch}
                />
                {isLoader ?
                    <LoaderScreen /> :
                    <>
                        <View>
                            <FlatList
                                style={{ marginLeft: 0 }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                initialNumToRender={4}
                                data={categoryData}
                                renderItem={({ item, index }: any) => {
                                    return (
                                        <PressableClick activeOpacity={0.8} style={{
                                            ...DashboardStyle.productImage,
                                            backgroundColor: selectedId === item?.crop_category_id ? DARK_GREEN_New : WHITE,
                                        }}
                                            onPress={() => handleCardPress(item?.crop_category_id)}
                                            label={i18n.language === 'en' ? item?.marathi_crop_category_name : item?.marathi_crop_category_name}
                                            textstyle={selectedId === item?.crop_category_id ? DashboardStyle.categoryTextSelected : DashboardStyle.categoryText}>
                                        </PressableClick>
                                    )
                                }}
                            />
                        </View>
                        <FlatList
                            style={{ marginTop: 20 }}
                            data={!searchQuery ? (selectedId === "0" ? cropList : selectedCategoryCropData) : filteredCrops}
                            numColumns={3}
                            keyExtractor={(item: any) => item.crop_id}
                            renderItem={({ item, index }: any) => renderNew(item, index)}
                            refreshing={refresh}
                            onRefresh={onRefresh}
                            columnWrapperStyle={DashboardStyle.columnView}
                            showsVerticalScrollIndicator={false}
                        />

                    </>
                }
            </View>
        </SafeAreaView>
    )
}

export default Dashboard