import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FontScaledText from "../../components/customInput/FontScaledText";
import TopHeaderFixed from "../../components/headerview/TopHeaderFixed";
import { GRAY_SHADE } from "../../shared/common-styles/colors";
import { PressableB } from "../../shared/components/CommonUtilities";
import { AddNewShippingStyle } from "./AddNewShippingStyle";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reduxToolkit/store";
import { jwtDecode } from "jwt-decode";
import AuthApi from "../../api/AuthApi";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/AppRouter";
import { selectedShippingAddress } from "../../reduxToolkit/counterSlice";
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold";
import TextPoppinsSemiBold from "../../shared/fontFamily/TextPoppinsSemiBold";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AddNewShipping = (data: any) => {
    const navigation: any = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [isLoader, setLoader] = useState(false);
    const isUserData = useSelector((state: RootState) => state.counter.isUserinfo)
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets()
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

    const { t } = useTranslation();
    const [formValue, setFormValue] = useState({
        fullName: data?.route?.params?.full_name || "",
        address: data?.route?.params?.address || "",
        pincode: data?.route?.params?.zipcode || "",
        country: data?.route?.params?.country || t("India"),
        city: data?.route?.params?.city || "",
        district: data?.route?.params?.district || t("Maharashtra"),
    });

    const [errorMessage, setErrorMessage]: any = useState({
        fullName: null,
        address: null,
        pincode: null,
        country: null,
        city: null,
        district: null
    })
    const validate = () => {
        const validFormValues = {
            fullName: "",
            address: "",
            pincode: "",
            country: "",
            city: "",
            district: ""
        };
        let isValid = false;
        const trimmedFullName = formValue?.fullName?.trim();
        const trimmedAddress = formValue?.address?.trim();
        const trimmedPincode = formValue?.pincode?.trim();
        const trimmedCountry = formValue?.country?.trim();
        const trimmedCity = formValue?.city?.trim();
        const trimmedDist = formValue?.district?.trim();
        if (!trimmedFullName) {
            isValid = true;
            validFormValues.fullName = "Full name is required";
        }
        if (!trimmedAddress) {
            isValid = true;
            validFormValues.address = "Address is required";
        }
        if (!trimmedPincode) {
            isValid = true;
            validFormValues.pincode = "Pincode is required";
        }
        if (!trimmedCountry) {
            isValid = true;
            validFormValues.country = "Country is required";
        }
        if (!trimmedCity) {
            isValid = true;
            validFormValues.city = "City is required";
        }
        if (!trimmedDist) {
            isValid = true;
            validFormValues.district = "District is required";
        }
        setErrorMessage(validFormValues);
        return isValid;
    };
    const onSubmit = async () => {
        if (validate()) {
            return
        }
        const payload = {
            "client_id": decodedToken?.data?.client_id,
            "full_name": formValue?.fullName,
            "address": formValue?.address,
            "zipcode": formValue?.pincode,
            "country": formValue?.country || 'India',
            "city": formValue?.city,
            "district": formValue?.district
        }
        try {
            setLoader(true);
            const response = await AuthApi.addShppingAddress(payload);
            if (response && response.data) {
                navigation.goBack();
            } else { }
            setLoader(false);
        } catch (error: any) {
            setLoader(false);
        }
    }
    const onUpdate = async () => {
        const payload: any = {
            "client_id": decodedToken?.data?.client_id,
            "shipping_address_id": data?.route?.params?.shipping_addres_id,
            "full_name": formValue?.fullName,
            "address": formValue?.address,
            "zipcode": formValue?.pincode,
            "country": formValue?.country,
            "city": formValue?.city,
            "district": formValue?.district
        }
        const payload1: any = {
            "shipping_address_id": data?.route?.params?.shipping_addres_id,
            "full_name": formValue?.fullName,
            "address": formValue?.address,
            "zipcode": formValue?.pincode,
            "country": formValue?.country,
            "city": formValue?.city,
            "district": formValue?.district
        }
        try {
            setLoader(true);
            const response = await AuthApi.updateShppingAddress(payload);
            if (response && response.data) {
                if (data?.route?.params?.isShipping) {
                    dispatch(selectedShippingAddress(payload1))
                }
                navigation.goBack();
            } else { }
            setLoader(false);
        } catch (error: any) {
            setLoader(false);
        }
    }

    const onChangeFormName = (state: any, text: any) => {
        setFormValue({ ...formValue, [state]: text });
        setErrorMessage({ ...errorMessage, [state]: '' });
    }


    const renderItem = (Title: string, placeholder: string, value: any, erroMsg: any, onchange?: any, maxLength?: any, keyboardType?: any) => {
        return (
            <View style={{ marginTop: 10 }}>
                <TextPoppinsMediumBold style={AddNewShippingStyle.titleText}>
                    {Title}
                </TextPoppinsMediumBold>
                <View style={AddNewShippingStyle.dataView}>
                    <FontScaledText
                        style={AddNewShippingStyle.inputText}
                        placeholder={placeholder}
                        placeholderTextColor={GRAY_SHADE}
                        value={value}
                        maxim
                        editable={onchange ? true : false}
                        onChangeText={onchange}
                        keyboardType={keyboardType ? keyboardType : 'default'}
                        maxLength={maxLength ? maxLength : 1000}
                    />
                </View>
                {erroMsg &&
                    <TextPoppinsSemiBold style={AddNewShippingStyle.errorFormText}>{erroMsg}</TextPoppinsSemiBold>
                }
            </View>
        )
    }

    return (
        <SafeAreaView style={{ ...AddNewShippingStyle.mainView, paddingTop: insets.top ,paddingBottom: insets.bottom }}>
            <TopHeaderFixed
                leftIconSize={20}
                gobackText={t('Add shipping address')}
                topHeight={100}
                onGoBack={() => navigation.goBack()} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ marginHorizontal: 20 }}>
                {renderItem(`${t("FULL_NAME")}`, `${t("ENTER_FULL_NAME")}`, formValue?.fullName, errorMessage?.fullName, (text: any) => onChangeFormName('fullName', text))}
                {renderItem(`${t("ADDRESS")}`, `${t("ENTER_ADDRESS")}`, formValue?.address, errorMessage?.address, (text: any) => onChangeFormName('address', text))}
                {renderItem(`${t("ZIPCODE")}`, `${t("ENTER_ZIPCODE")}`, formValue?.pincode, errorMessage?.pincode, (text: any) => onChangeFormName('pincode', text), 6, 'numeric')}
                {renderItem(`${t("CITY")}`, `${t("ENTER_CITY")}`, formValue?.city, errorMessage?.city, (text: any) => onChangeFormName('city', text))}
                {renderItem(`${t("DISTRICT")}`, `${t("ENTER_DISTRICT")}`, formValue?.district, errorMessage?.district)}
                {renderItem(`${t("COUNTRY")}`, `${t("ENTER_COUNTRY")}`, formValue?.country, errorMessage?.country)}
            </KeyboardAwareScrollView>
            {data?.route?.params?.shipping_addres_id ?
                <>
                    {PressableB(`${t("UPDATE_ADDRESS")}`, onUpdate)}
                </> :
                <>
                    {PressableB(`${t("SAVE_ADDRESS")}`, onSubmit)}
                </>}
        </SafeAreaView>
    )
}

export default AddNewShipping