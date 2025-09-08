import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList, Pressable, SafeAreaView } from "react-native"
import { heightPercentageToDP } from "react-native-responsive-screen"
import TopHeaderFixed from "../../components/headerview/TopHeaderFixed"
import { LoaderScreen } from "../../components/loaderview/LoaderScreen"
import NoRecordFound from "../../components/noRecordFound/NoRecordFound"
import { ADD_NEW_SHIPPING_SCREEN } from "../../routes/Routes"
import { MDBLUE } from "../../shared/common-styles/colors"
import PlusButtonIcon from "../../svg/PlusButtonIcon"
import { RenderAddress } from "./RenderAddress"
import { ShippingAddressStyle } from "./ShippingAddressStyle"
import AuthApi from "../../api/AuthApi"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../reduxToolkit/store"
import { jwtDecode } from "jwt-decode"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { selectedShippingAddress } from "../../reduxToolkit/counterSlice"
import { PressableB } from "../../shared/components/CommonUtilities"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../routes/AppRouter"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const ShippingAddressScreen = (props: any) => {
    const navigation: any = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const isUserData = useSelector((state: RootState) => state.counter.isUserinfo)
    const selectedShippingAddress1: any = useSelector((state: RootState) => state.counter.selectAddress)
    const { t } = useTranslation();
    const [loader, setLoader] = useState(false)
    const [selectedAddId, setSelectedAddID] = useState(1);
    const [refresh, setRefresh] = useState(false)
    const dispatch = useDispatch()
    const insets = useSafeAreaInsets()
    const [shippingAddress, setShippingAddress] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setLoader(true)
        }, 1000)
    }, [])
    useFocusEffect(
        useCallback(() => {
            getAddresses();
        }, [shippingAddress])
    );
    const decodeToken = (token: string) => {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.log('Error decoding JWT token:', error);
            return null;
        }
    };

    const token = isUserData?.jwt;
    const decodedToken: any = decodeToken(token);

    const onRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false)
        }, 1000)
    }

    const onPressAddress = (id: any) => {
        setSelectedAddID(id?.shipping_addres_id)
        dispatch(selectedShippingAddress(id))
        if (props) {
            setSelectedAddID(id?.shipping_addres_id)
            dispatch(selectedShippingAddress(id))
            navigation.goBack()
        }
    }

    const onPressEditAdd = (data: any) => {
        navigation.navigate(ADD_NEW_SHIPPING_SCREEN, data)
    }

    const onPressPlus = () => {
        navigation.navigate(ADD_NEW_SHIPPING_SCREEN)
    }

    useEffect(() => {
        getAddresses()
    }, [])
    const getAddresses = async () => {
        const payload = {
            "client_id": decodedToken?.data?.client_id
        }
        try {
            setLoader(true);
            const response = await AuthApi.getShppingAddress(payload);
            if (response && response.data) {
                setShippingAddress(response.data)
            }
            setLoader(false);
        } catch (error: any) {
            setLoader(false);
        }
    };

    return (
        <SafeAreaView style={{ ...ShippingAddressStyle.mainView, paddingTop: insets.top,paddingBottom: insets.bottom }}>
            <TopHeaderFixed
                leftIconSize={20}
                gobackText={t('SHIPPING_ADDRESS')}
                topHeight={100}
                onGoBack={() => navigation.goBack()} />
            {loader ?
                <FlatList
                    data={shippingAddress}
                    renderItem={({ item }: any) => <RenderAddress data={item} selectedId={selectedAddId} onPressAdd={onPressAddress} onPressEdit={onPressEditAdd} />}
                    keyExtractor={(item: any) => item?.shipping_addres_id}
                    ListEmptyComponent={<NoRecordFound style={{ marginTop: heightPercentageToDP(30) }} />}
                    showsVerticalScrollIndicator={false}
                    refreshing={refresh}
                    onRefresh={onRefresh}
                />
                :
                <LoaderScreen />
            }

            <Pressable style={ShippingAddressStyle.plusIconView} onPress={onPressPlus}>
                <PlusButtonIcon height={40} width={40} color={MDBLUE} />
            </Pressable>
        </SafeAreaView>
    )
}

export default ShippingAddressScreen