import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Image, Pressable, SafeAreaView, Text, TouchableOpacity, View, Alert, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reduxToolkit/store";
import AuthApi from "../../api/AuthApi";
import { LoaderScreen } from "../../components/loaderview/LoaderScreen";
import NoRecordFound from "../../components/noRecordFound/NoRecordFound";
import PressableClick from "../../components/pressablebutton/PressableClick";
import { selectedCropProduct, selectedMyCropProduct } from "../../reduxToolkit/counterSlice";
import { MENUBAR_SCREEN, MYCART_SCREEN, SELECTED_CROP_SCREEN } from "../../routes/Routes";
import { DARK_GREEN_New, WHITE, RED } from "../../shared/common-styles/colors";
import { headerView, PressableB } from "../../shared/components/CommonUtilities";
import { ProductListStyle } from "../productlist/ProductListStyle";
import { DashboardStyle } from "./DashboardStyle";
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold";
import { regexImage } from "../../shared/utilities/String";
import SearchInput from "../../components/searchInput/SearchInput";
import CartSvg from "../../svg/CartSvg";
import {  useSafeAreaInsets } from "react-native-safe-area-context";
const DashBoard = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();

    const { t, i18n } = useTranslation();
    const [selectedId, setSelectedId] = useState("0");
    const [selecteProduct, setSelectedProduct]: any = useState([])
    const [refresh, setRefresh] = useState(false)
    const [isLoader, setLoader] = useState(false);
    const [cropList, setCropList] = useState([])
    const [categoryData, setCategoryData]: any = useState([])
    const [selectedCategoryCropData, setSelectedCategoryCropData] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCrops, setFilteredCrops] = useState([]);
    const [myCrops, setMyCrops] = useState([]);
    const [isEditingMyCrops, setIsEditingMyCrops] = useState(false);
    const [tempSelectedCrops, setTempSelectedCrops] = useState([]);
    const [myCropsLoaded, setMyCropsLoaded] = useState(false);
    const [originalCategoryData, setOriginalCategoryData]: any = useState([]);
    
    const dispatch = useDispatch()
    const isLoggedIn: any = useSelector((state: RootState) => state.counter.login)
    const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo)
    const totalItems = useSelector((state: RootState) => state.counter.totalItems)
    const selectedMyCrops = useSelector((state: RootState) => state.counter.selectedMyCrop)
    const maxAttempts = 1;
    const attemptCount = useRef(0);

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
        try {
            setLoader(true);
            const [cropResponse, categoryResponse, myCropsResponse] = await Promise.all([
                AuthApi.getCrops(),
                AuthApi.getCategory(),
                AuthApi.getMyCrops({ client_id: profileDetail?.client_id })
            ]);
            console.log(cropResponse.data)

            if (cropResponse && categoryResponse) {
                setCropList(cropResponse?.data || []);
                const allCropsCategory = {
                    crop_category_id: "0",
                    crop_category_name: "All Crops",
                    marathi_crop_category_name: "सर्व पिके"
                };
                const categoryArray = Array.isArray(categoryResponse?.data) ? categoryResponse?.data : [];
                const originalCategories = [
                    allCropsCategory,
                    ...categoryArray,
                ];
                setOriginalCategoryData(originalCategories);
                console.log("Original Categories:", originalCategories);
                originalCategories.forEach((cat: any) => {
                 
                    cat.marathi_crop_category_name = cat?.marathi_crop_category_name?.replace(/\s/g, '\u00A0');
                  
                })
                setCategoryData(originalCategories);
            }

            if (myCropsResponse && myCropsResponse.data) {
                setMyCrops(myCropsResponse.data);
                dispatch(selectedMyCropProduct(myCropsResponse.data));
            }
            setMyCropsLoaded(true);
        } catch (error: any) {
            console.log("Error loading data:", error.response || error);
        } finally {
            setLoader(false);
        }
    };

    // Helper function to reorder categories with selected category appearing after "All Crops"
    const reorderCategories = (selectedCategoryId: string) => {
        if (!originalCategoryData.length) return originalCategoryData;
        
        const allCropsCategory = originalCategoryData.find((cat: any) => cat.crop_category_id === "0");
        const selectedCategory = originalCategoryData.find((cat: any) => cat.crop_category_id === selectedCategoryId);
        const otherCategories = originalCategoryData.filter((cat: any) => 
            cat.crop_category_id !== "0" && cat.crop_category_id !== selectedCategoryId
        );

        if (selectedCategoryId === "0" || !selectedCategory) {
            // If "All Crops" is selected or no valid selection, return original order
            return originalCategoryData;
        }

        // Put selected category right after "All Crops"
        return [allCropsCategory, selectedCategory, ...otherCategories].filter(Boolean);
    };

    const handleCardPress = async (id: any) => {
        if (id === selectedId) {
            setSelectedId("0");
            setSelectedCategoryCropData(cropList);
            // Reset to original category order when deselecting
            setCategoryData(originalCategoryData);
        } else {
            setSelectedId(id);
            // Reorder categories to show selected one after "All Crops"
            const reorderedCategories = reorderCategories(id);
            setCategoryData(reorderedCategories);
            
            const payload = {
                "crop_category_id": id
            };
            try {
                setLoader(true);
                const response = await AuthApi.getCropByCategoryId(payload);
                if (response && response.data) {
                    setSelectedCategoryCropData(response.data);
                }
            } catch (error: any) {
                console.log("Error fetching crops by category:", error);
            } finally {
                setLoader(false);
            }
        }
    };

    const onPressProduct = (item: any) => {
        if (isEditingMyCrops) {
            // Handle selection for editing my crops
            const isSelected = tempSelectedCrops.some((i: any) => i.crop_id === item.crop_id);
            if (isSelected) {
                setTempSelectedCrops(tempSelectedCrops.filter((i: any) => i.crop_id !== item.crop_id));
            } else {
                setTempSelectedCrops([...tempSelectedCrops, item]);
            }
        } else {
            // Normal product selection
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
        }
    };

    const handleEditMyCrops = () => {
        setIsEditingMyCrops(true);
        setTempSelectedCrops([...myCrops]);
    };

    const handleRemoveMyCrop = (cropToRemove: any) => {
        if (isEditingMyCrops) {
            setTempSelectedCrops(tempSelectedCrops.filter((crop: any) => crop.crop_id !== cropToRemove.crop_id));
        }
    };

    const handleSubmitMyCrops = async () => {
        try {
            setLoader(true);
            const payload = {
                client_id: profileDetail?.client_id,
                crop_id: tempSelectedCrops.map((crop: any) => crop.crop_id)
            };
            
            await AuthApi.updateMyCrops(payload);
            setMyCrops([...tempSelectedCrops]);
            dispatch(selectedMyCropProduct(tempSelectedCrops));
            setIsEditingMyCrops(false);
            
            //  ToastAndroid.show("Success", ToastAndroid.SHORT);
            // Alert.alert("Success", "My crops updated successfully!");
        } catch (error: any) {
            console.log("Error updating my crops:", error);
            Alert.alert("Error", "Failed to update my crops. Please try again.");
        } finally {
            setLoader(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditingMyCrops(false);
        setTempSelectedCrops([]);
    };

    const renderMyCropItem = (item: any, index: any) => {
        return (
            <View key={item?.crop_id + index} style={DashboardStyle.myCropContainer}>
                {isEditingMyCrops && (
                    <TouchableOpacity 
                        style={DashboardStyle.removeCropButton}
                        onPress={() => handleRemoveMyCrop(item)}
                    >
                        <Text style={DashboardStyle.removeCropText}>×</Text>
                    </TouchableOpacity>
                )}
                {(regexImage.test(item?.crop_image)) ? 
                    <Image
                        source={{ uri: item?.crop_image }}
                        style={DashboardStyle.myCropImage}
                    />
                    :
                    <Image
                        source={require('../../assets/defaultProduct.png')}
                        style={DashboardStyle.myCropImage}
                    />
                }
                <Text style={DashboardStyle.myCropName}>
                    {i18n.language === 'en' ? item?.crop_name : item?.crop_marathi_name}
                </Text>
            </View>
        );
    };

    const renderNew = (item: any, index: any) => {
        const isSelected = isEditingMyCrops 
            ? tempSelectedCrops.some((data: any) => data.crop_id == item.crop_id)
            : selecteProduct.some((data: any) => data.crop_id == item.crop_id);
            
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
                    <TextPoppinsMediumBold style={DashboardStyle.productName}>
                        {i18n.language === 'en' ? item?.crop_name : item?.crop_marathi_name}
                    </TextPoppinsMediumBold>
                </View>
            </Pressable>
        )
    }

    const onPressSide = () => {
        navigation.navigate(MENUBAR_SCREEN)
    }

    const handleSearch = async (query: string) => {
        const trimmedQuery = query.trim();
        setSearchQuery(query);

        if (!trimmedQuery) {
            setFilteredCrops([]);
            setSelectedId("0");
            // Reset to original category order when clearing search
            setCategoryData(originalCategoryData);
            return;
        }

        try {
            setLoader(true);
            const cropResponse = await AuthApi.getCrops();
            const foundCrops = cropResponse.data.filter((crop: any) =>
                crop.crop_name.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
                crop.crop_marathi_name.toLowerCase().includes(trimmedQuery.toLowerCase())
            );

            if (foundCrops.length > 0) {
                setFilteredCrops(foundCrops);
            } else {
                const lowercasedQuery = trimmedQuery.toLowerCase();
                const foundCategory = categoryData.find((cat: any) =>
                    cat.crop_category_name.toLowerCase().includes(lowercasedQuery) ||
                    (cat.marathi_crop_category_name && cat.marathi_crop_category_name.toLowerCase().includes(lowercasedQuery))
                );

                if (foundCategory) {
                    setSelectedId(foundCategory.crop_category_id);
                    // Reorder categories to show found category after "All Crops"
                    const reorderedCategories = reorderCategories(foundCategory.crop_category_id);
                    setCategoryData(reorderedCategories);
                    
                    const payload = { "crop_category_id": foundCategory.crop_category_id };
                    const categoryCropResponse = await AuthApi.getCropByCategoryId(payload);
                    if (categoryCropResponse && categoryCropResponse.data) {
                        setFilteredCrops(categoryCropResponse.data);
                    } else {
                        setFilteredCrops([]);
                    }
                } else {
                    setFilteredCrops([]);
                }
            }
        } catch (error) {
            console.log("Error during search:", error);
            setFilteredCrops([]);
        } finally {
            setLoader(false);
        }
    };

    return (
        <SafeAreaView style={{ ...DashboardStyle.mainCardView, paddingTop: insets.top }} >
            {headerView(`Hi, ${profileDetail?.client_name || ""}`, "Enjoy our services", onPressSide, totalItems, navigation, undefined)}
            
            {/* My Crops Section - Replacing Banner */}
            <View style={DashboardStyle.myCropsSection}>
                <View style={DashboardStyle.myCropsHeader}>
                    <TextPoppinsMediumBold style={DashboardStyle.myCropsTitle}>
                        {t('MY_CROPS') || 'My Crops'}
                    </TextPoppinsMediumBold>
                    {!isEditingMyCrops ? (
                        <TouchableOpacity onPress={handleEditMyCrops} style={DashboardStyle.editButton}>
                            <Text style={DashboardStyle.editButtonText}>{t("EDIT")}</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={DashboardStyle.editActions}>
                            <TouchableOpacity onPress={handleSubmitMyCrops} style={DashboardStyle.editButton}>
                                <Text style={DashboardStyle.editButtonText}>{isLoader ? t("LOADING") : t("SUBMIT_CROPS")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancelEdit} style={DashboardStyle.cancelButton}>
                                <Text style={DashboardStyle.cancelButtonText}>{t('CANCEL')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                
                <View style={{ overflow: 'visible' }}>
                    {!myCropsLoaded ? (
                        <View style={DashboardStyle.myCropsList}>
                            <FlatList
                                horizontal={true}
                                data={[1, 2, 3, 4]}
                                renderItem={() => (
                                    <View style={DashboardStyle.myCropContainer}>
                                        <View style={[DashboardStyle.myCropImage, { backgroundColor: '#E0E0E0' }]} />
                                        <View style={{
                                            width: 40,
                                            height: 10,
                                            backgroundColor: '#E0E0E0',
                                            borderRadius: 5,
                                            marginTop: 5
                                        }} />
                                    </View>
                                )}
                                keyExtractor={(item: any) => item.toString()}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    ) : (isEditingMyCrops ? tempSelectedCrops : myCrops).length > 0 ? (
                        <FlatList
                            horizontal={true}
                            data={isEditingMyCrops ? tempSelectedCrops : myCrops}
                            renderItem={({ item, index }) => renderMyCropItem(item, index)}
                            keyExtractor={(item: any) => item.crop_id.toString()}
                            showsHorizontalScrollIndicator={false}
                            style={DashboardStyle.myCropsList}
                        />
                    ) : (
                        <View style={DashboardStyle.noMyCropsContainer}>
                            <Text style={DashboardStyle.noMyCropsText}>
                                {isEditingMyCrops ? "Select crops below to add to your list" : "No crops selected yet"}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

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
                                            label={i18n.language === 'en' ? item?.crop_category_name : item?.marathi_crop_category_name}
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
                            columnWrapperStyle={{
                                justifyContent: 'flex-start',
                                paddingHorizontal: 5,
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                }
            </View>
        </SafeAreaView>

    )
}

export default DashBoard