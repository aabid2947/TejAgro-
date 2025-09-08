import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, SafeAreaView, Text, ToastAndroid, View } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import AuthApi from "../../api/AuthApi";
import TopHeaderFixed from "../../components/headerview/TopHeaderFixed";
import { LoaderScreen } from "../../components/loaderview/LoaderScreen";
import NoRecordFound from "../../components/noRecordFound/NoRecordFound";
import { RootState } from "../../reduxToolkit/store";
import { ORDER_DETAIL_SCREEN } from "../../routes/Routes";
import { BLACK, GREEN, GREY, WHITE } from "../../shared/common-styles/colors";
import { RenderItem } from "../../shared/components/CommonUtilities";
import { DashboardStyle } from "../dashboard/DashboardStyle";
import { NotifcationScreenStyle } from "../notificationScreen/NotificationScreenStyle";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const sortingList = [{ id: 1, name: "List: ", isSelected: true, selectedBG: GREEN, selectedColor: WHITE, color: BLACK, },]

const MyOrders = ({ navigation }: any) => {
    const { t } = useTranslation();
    const [loader, setLoader] = useState(false)
    const insets = useSafeAreaInsets()
    const [sortData, setSortData] = useState(sortingList);
    const [refresh, setRefresh] = useState(false)
    const userData: any = useSelector((state: RootState) => state.counter.isUserinfo)
    const [orders, setOrders]: any = useState([]);
    const [noData, setNoData] = useState(false);
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

    useEffect(() => {
        getOrderHistory()
        setTimeout(() => {
        }, 1000)
    }, [])
    const getOrderHistory = async () => {
        const payload = {
            "client_id": decodedToken?.data?.client_id
        }
        try {
            setLoader(true)
            const response = await AuthApi.orderHistory(payload)
            setOrders(response?.data)
            setLoader(false)
        } catch (error: any) {
            setLoader(false)
            ToastAndroid.show(error?.response?.data?.message || 'Product Not Found', ToastAndroid.SHORT);
        }
    }
    const onRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false)
        }, 1000)
    }
    const onDetailPress = (item: any) => {
        console.log("Order Details :",item)
        navigation.navigate(ORDER_DETAIL_SCREEN, {
            order_number: item[0]?.order_number,
            quantity: item[0]?.quantity,
            grand_amount: item[0]?.grand_amount,
            status: item[0]?.status,
            discount_amount: item[0]?.discount_amount,
            gstt_amount: item[0]?.gst_amount,
            taxable_amount: item[0]?.taxable_amount,
            product_image: item[0]?.product_image,
            product_name: item[0]?.product_name,
            mrp: item[0]?.mrp,
            date: item[0]?.order_date,
            ordered_updated_data: item
        });
    }
    const onSelectsorting = (itemIndex: any, isRefresh = false) => {
        const updatedSortData = sortData.map((item, index) => {
            item.isSelected = index === itemIndex;
            return item;
        });
        setSortData(updatedSortData);
        const selectedOption = updatedSortData[itemIndex].name;
        if (selectedOption === "Processing" || selectedOption === "Cancelled") {
            setOrders([]);
            setNoData(true);
        } else {
            getOrderHistory();
            setNoData(false);
        }
    };

    return (
        <SafeAreaView style={[NotifcationScreenStyle.mainView, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <TopHeaderFixed
                leftIconSize={20}
                gobackText={t('MY_ORDERS')}
                topHeight={100}
                onGoBack={() => navigation.goBack()} />


            {loader ? (
                <LoaderScreen />
            ) : noData ? (
                <NoRecordFound style={DashboardStyle.noDataTxt} />
            ) : (
                <FlatList
                    data={orders || []}
                    renderItem={({ item }: any) => <RenderItem item={item} onDetailPress={onDetailPress} />}
                    keyExtractor={(item: any) => item?.order_id}
                    ListEmptyComponent={<NoRecordFound style={{ marginTop: heightPercentageToDP(30) }} />}
                    showsVerticalScrollIndicator={false}
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    style={{ marginHorizontal: 15 }}
                />
            )}
        </SafeAreaView>
    )
}

export default MyOrders;