import { useTranslation } from "react-i18next";
import { Alert, Image, Linking, Pressable, SafeAreaView, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import TopHeaderFixed from "../../components/headerview/TopHeaderFixed";
import { ADD_PAYMENT_SCREEN, MY_PROFILE, MY_REWARD_SCREEN, ORDER_SCREEN, PROFILE_SETTING_SCREEN, REFER_EARN_SCREEN, SHIPPING_ADDRESS_SCREEN } from "../../routes/Routes";
import { DARK_GREEN_ICON, GREY } from "../../shared/common-styles/colors";
import AccoountSetting from "../../svg/AccoountSetting";
import AgroStarSvg from "../../svg/AgroStarSvg";
import AppInfoSvg from "../../svg/AppInfoSvg";
import ArrowIcon from "../../svg/ArrowIcon";
import CartSvg from "../../svg/CartSvg";
import MyAddressSvg from "../../svg/MyAddressSvg";
import MyBagSvg from "../../svg/MyBagSvg";
import { MenuBarStyle } from "./MenuBarStyle";
import { settingStyle } from "../setting/SettingStyle";
import LogOutIcon from "../../svg/LogOutIcon";
import AlertModal from "../../components/alertmodal/AlertModal";
import { commonStyles } from "../../shared/common-styles/styles";
import DeviceInfo from "react-native-device-info";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { isLogOut, profileDetail, walletDetails } from "../../reduxToolkit/counterSlice";
import CartIcon from "../../svg/CartIcon";
import LocationIcon from "../../svg/LocationIcon";
import PaymentIcon from "../../svg/PaymentIcon";
import ReviewIcon from "../../svg/ReviewIcon";
import SettingIcon from "../../svg/SettingIcon";
import { RootState } from "../../reduxToolkit/store";
import AuthApi from "../../api/AuthApi";
import { jwtDecode } from "jwt-decode";
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold";
import TextPoppinsSemiBold from "../../shared/fontFamily/TextPoppinsSemiBold";
import * as ImagePicker from 'react-native-image-picker';
import { regexImage } from "../../shared/utilities/String";
import { PermissionsAndroid, Platform } from 'react-native';
import WalletIcon from "../../svg/WalletIcon";
import InstagramIcon from "../../svg/InstagramIcon";
import FacebookIcon from "../../svg/FacebookIcon";
import TwitterIcon from "../../svg/TwitterIcon";
import ShareIcon from "../../svg/ShareIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const MenuBarScreen = ({ navigation }: any) => {
    const { t } = useTranslation();
    
    const insets = useSafeAreaInsets()
    const version = DeviceInfo.getVersion();
    const dispatch = useDispatch()
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteData, setDelete] = useState(false);
    const [orderData, setOrderData]: any = useState([]);
    const [addressData, setAddressData]: any = useState([]);
    const isUserData = useSelector((state: RootState) => state.counter.isUserinfo)
    const profileInfo: any = useSelector((state: RootState) => state.counter.isProfileInfo)
    const referralCode = useSelector((state: RootState) => state.counter.referralCode)
    const walletInfo = useSelector((state: RootState) => state.counter.wallet);
    console.log("walletInfo : ", walletInfo)
    const onProceed = async () => {
        setModalVisible(false);
        dispatch(isLogOut())
        ToastAndroid.show(deleteData ? "Account Deleted" : "Logout successfully", ToastAndroid.SHORT);

    };
    const onProceedLogout = async () => {
        setModalVisible(false);
        dispatch(isLogOut())
        ToastAndroid.show(deleteData ? "Account Deleted" : "Logout successfully", ToastAndroid.SHORT);
    };
    const onCancel = () => {
        setDelete(false)
        setModalVisible(false);
    };
    const onPressLogout = () => {
        setModalVisible(true)
    }
    const deletePress = () => {
        setDelete(true)
        setModalVisible(true)
    }
    const decodeToken = (token: string) => {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.log('Error decoding JWT token:', error);
            return null;
        }
    };

    const getProfile = async () => {
        try {
            const resp = await AuthApi.getProfileDetails();
            if (resp && resp.data) {
                dispatch(profileDetail(resp?.data));
            } else {
                console.log("Error: getProfileDetails response is empty.");
            }
        } catch (error) {

        }

    }

    const token = isUserData?.jwt;
    const decodedToken: any = decodeToken(token);

    useEffect(() => {
        loadData()
        getProfile();
    }, [])
    const loadData = async () => {
        const payload = {
            "client_id": decodedToken?.data?.client_id
        }
        try {
            const [orderResponse, addressResponse] = await Promise.all([
                AuthApi.orderHistory(payload),
                AuthApi.getShppingAddress(payload)

            ]);
            if (orderResponse && addressResponse) {
                setOrderData(orderResponse?.data || []);
                setAddressData(addressResponse?.data || []);

                // const walletData = walletResponse?.data || [];
                // console.log(walletData, 'walletData',
                //     profileInfo
                // )
                // dispatch(walletDetails(walletData));  // ✅ Dispatch after setting the data

            } else {
                console.log("Received undefined response from APIs");
            }
        } catch (error: any) {
            console.log("Error loading data:", error.response || error);
        }
    };

    const dataItems = (Icon1: any, Icon: any, title: any, navigation?: any, value?: any, isBoldValue?: boolean) => {
        return (
            <View style={[commonStyles.mainBody, commonStyles.mainSubBody]}>
                <TouchableOpacity onPress={navigation ? navigation : () => ''}>
                    <View style={settingStyle.dataRow}>
                        <View style={{ width: "5%" }}>
                            <Icon1 width={18} height={20} />
                        </View>
                        <View style={{ width: "80%" }}>
                            <TextPoppinsSemiBold style={settingStyle.commonTxt}>{title}</TextPoppinsSemiBold>
                        </View>
                        <View style={settingStyle.iconView}>
                            <Icon width={18} height={20} />
                        </View>
                    </View>
                    <TextPoppinsSemiBold style={isBoldValue ? settingStyle.boldText : settingStyle.subText}>{value}</TextPoppinsSemiBold>
                </TouchableOpacity>
            </View>
        )
    }
    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                ]);

                const allGranted = Object.values(granted).some(permission => permission === PermissionsAndroid.RESULTS.GRANTED);

                if (!allGranted) {
                    console.log('Permissions not granted');
                    return false;
                }
                return true;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };
    const chooseFile = async () => {
        const hasPermissions = await requestPermissions();
        // if (!hasPermissions) {
        //     ToastAndroid.show('Permissions are required to access the gallery', ToastAndroid.SHORT);
        //     return;
        // }
        const options: any = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            quality: 0.8
        };

        ImagePicker.launchImageLibrary(options, (response: any) => {
            if (response.didCancel) {
            } else if (response.error) {
                console.log('Image Picker Error: ', response.error);
            } else {
                console.log("Image response:", response.assets[0]);
                uploadProfileImage(response.assets[0]);
            }
        });
    };

    const removeProfileImage = async () => {
        // try {
        //     const response = await AuthApi.updateProfile({ client_image: "" });
        //     console.log(response.data, 'response')
        //     await getProfile()
        // } catch (error) {
        //     console.log(error, 'error')
        // }
    }
    const uploadProfileImage = async (file: any) => {
        try {
            let formdata = new FormData();
            formdata.append('image_temp_name', {
                name: file.fileName,
                type: file.type,
                uri: file.uri
            });
            const response = await AuthApi.uploadProfileImage(formdata);
            await getProfile()

            ToastAndroid.show('Profile image updated successfully', ToastAndroid.SHORT);
        } catch (e) {
            ToastAndroid.show('Failed to update profile image', ToastAndroid.SHORT);

            console.log("Error uploading image:", e);
        }
    };
    // console.log(profileInfo, 'profileInfo')
    return (
        <SafeAreaView style={{ ...MenuBarStyle.mainView, paddingTop: insets.top,paddingBottom: insets.bottom }}>
            <TopHeaderFixed
                leftIconSize={20}
                gobackText={t("PROFILE")}
                topHeight={100}
                onGoBack={() => navigation.goBack()} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={settingStyle.profileDetailsContainer}>
                    <View style={settingStyle.textContainerView}>
                        <TextPoppinsMediumBold style={{ ...settingStyle.commonTxt, ...settingStyle.emailTxt }}>
                            {profileInfo?.client_name || "Hi,"}
                        </TextPoppinsMediumBold>
                        {profileInfo?.referral && <TextPoppinsSemiBold style={{ ...settingStyle.commonTxt, ...settingStyle.emailTxt }}>
                            {profileInfo?.referral || ""}
                            <TextPoppinsSemiBold style={{ ...settingStyle.commonTxt, ...settingStyle.emailTxt, color: GREY }}>
                                Rewards Earned
                            </TextPoppinsSemiBold>
                        </TextPoppinsSemiBold>}
                    </View>
                    <View style={{ width: "45%", position: "relative" }}>
                        <Pressable onPress={chooseFile}>
                            {regexImage.test(profileInfo.client_image) ? (
                                <Image
                                    source={

                                        { uri: profileInfo.client_image }
                                    }
                                    style={settingStyle.profileImage}
                                    resizeMode={'contain'}
                                />
                            ) : (
                                <Image source={require("../../assets/defaultProfile.png")}
                                    style={settingStyle.profileImage}
                                    resizeMode="contain"
                                />
                            )}

                        </Pressable>
                    </View>
                </View>
                {dataItems(WalletIcon, ArrowIcon, `${t('WALLET')}`, undefined, `Balance: ${profileInfo?.my_wallet || 0}`, true)}
                {dataItems(ShareIcon, ArrowIcon, `${t('REFER_AND_EARN')}`,undefined, `Referral Code: ${referralCode || 'Not Available'}`)}
                {dataItems(CartIcon, ArrowIcon, `${t('MY_ORDERS')}`, () => navigation.navigate(ORDER_SCREEN), `You have ${orderData.length || "0"} orders`)}
                {dataItems(LocationIcon, ArrowIcon, `${t('SHIPPING_ADDRESS')}`, () => navigation.navigate(SHIPPING_ADDRESS_SCREEN), `${addressData.length || "0"} Addresses`)}
                {dataItems(SettingIcon, ArrowIcon, `${t('SETTING_PROFILE')}`, () => navigation.navigate(PROFILE_SETTING_SCREEN), `Profile, Contact`)}
                
             
            </ScrollView>
            <View style={settingStyle.bottomContainer}>
                <Pressable style={settingStyle.logOutView} onPress={() => onPressLogout()}>
                    <View style={{ alignSelf: "center" }}>
                        <LogOutIcon width={20} height={20} />
                    </View>
                    <TextPoppinsSemiBold style={settingStyle.commonTxt}>{t("LOG_OUT")}</TextPoppinsSemiBold>
                </Pressable>
                <View style={settingStyle.deleteAccountView}>
                    <Pressable onPress={() => deletePress()}>
                        <TextPoppinsSemiBold style={settingStyle.logoutTxt}>{t("DELETE_ACCOUNT")}</TextPoppinsSemiBold>
                    </Pressable>
                    <TextPoppinsSemiBold style={settingStyle.versionTxt}>v{version}</TextPoppinsSemiBold>
                </View>
            </View>
            <AlertModal modalVisible={modalVisible} setModalVisible={setModalVisible}
                firstLineContent={deleteData ? "Are you sure you want to delete account?" : "Are you sure you want to logout?"}
                btn={deleteData ? "Delete" : "Logout"}
                no={"Cancel"}
                btnCancel={"Cancel"}
                onProceed={() => deleteData ? onProceed() : onProceedLogout()}
                onCancel={() => onCancel()}
                closeIcon={true}
            />
        </SafeAreaView>
    )
}

export default MenuBarScreen