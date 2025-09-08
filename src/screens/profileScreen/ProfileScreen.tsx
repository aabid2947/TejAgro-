import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { Pressable, SafeAreaView, Text, ToastAndroid, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import AuthApi from "../../api/AuthApi";
import FontScaledText from "../../components/customInput/FontScaledText";
import TopHeaderFixed from "../../components/headerview/TopHeaderFixed";
import PressableClick from "../../components/pressablebutton/PressableClick";
import { profileDetail } from "../../reduxToolkit/counterSlice";
import { RootState } from "../../reduxToolkit/store";
import { RootStackParamList } from "../../routes/AppRouter";
import { GRAY_SHADE, WHITE } from "../../shared/common-styles/colors";
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold";
import { ProfileScreenStyle } from "./ProfileScreenStyle";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const ProfileScreen = (props: any) => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets()
    const navigation: any = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const isUserData = useSelector((state: RootState) => state.counter.isUserinfo)
    // const profileDetail: any = useSelector((state: RootState) => state.counter.isProfileInfo)
    const [passwordShow, setShowPassword]: any = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const dispatch = useDispatch();
    const [formValue, setFormValue] = useState({
        fullName: props?.route?.params || "",
        mobileNumber: "",
        password: "",
        pinCode: "",
        address: '',
        gender: "",
        age: "",
        profileImageUrl: "",
        email: "",
        dateOfBirth: ""
    })
    const [genderItems, setGenderItems] = useState([
        { label: 'Male', name: 'Male' },
        { label: 'Female', name: 'Female' },
        { label: 'Other', name: 'Other' }
    ]);
    const [errorMessage, setErrorMessage]: any = useState({
        fullName: null,
        mobileNumber: null,
        password: null,
        pinCode: null,
        age: null,
        gender: null,
        photo: null,
        email: null
    })
    // useEffect(() => {
    //     // Set initial full name if client_name is present in the profile details
    //     if (profileDetail?.client_name) {
    //         setFormValue(prev => ({ ...prev, fullName: profileDetail.client_name }));
    //     }
    // }, [profileDetail]);
    const onChangeFormName = (state: any, text: any) => {
        setFormValue({ ...formValue, [state]: text });
        setErrorMessage({ ...errorMessage, [state]: '' });
    }
    const onSelectionArea = (id: any, name: any) => {
        setFormValue({ ...formValue, gender: name });
        setErrorMessage({ ...errorMessage, gender: '' });
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

    const token = isUserData?.jwt;
    const decodedToken: any = decodeToken(token);
    const renderItem = (Title: string, placeholder: string, value: any, erroMsg: any, onchange?: any, maxLength?: any, keyboardType?: any, Icon?: any) => {
        return (
            <View>
                <TextPoppinsMediumBold style={ProfileScreenStyle.titleStyleText}>{Title}</TextPoppinsMediumBold>
                <View style={ProfileScreenStyle.mainBodyView}>
                    <View style={ProfileScreenStyle.dataView}>
                        <FontScaledText
                            style={ProfileScreenStyle.inputText}
                            placeholder={placeholder}
                            placeholderTextColor={GRAY_SHADE}
                            value={value}
                            maxim
                            editable={onchange ? true : false}
                            onChangeText={onchange}
                            keyboardType={keyboardType ? keyboardType : 'default'}
                            maxLength={maxLength ? maxLength : 100}
                            secureTextEntry={Title == 'New Password' && !passwordShow ? true : false}
                        />
                        {Title == "New Password" ? <Pressable onPress={() => setShowPassword(!passwordShow)}>
                            <Icon height={20} width={20} />
                        </Pressable> : null}
                    </View>
                    {erroMsg &&
                        <View >
                            <Text style={ProfileScreenStyle.errorFormText}>{erroMsg}</Text>
                        </View>
                    }
                </View>
            </View>
        )
    }
    const validate = () => {
        const validFormValues = {
            fullName: ""
        };
        let isValid = false;
        if (!formValue.fullName || formValue.fullName.length <= 3) {
            isValid = true;
            validFormValues.fullName = "Full name is required"
        }
        setErrorMessage(validFormValues);
        return isValid;
    }
    const onSubmit = async () => {
        setIsLoader(true);
        if (validate()) {
            setIsLoader(false);
            return;
        }
        const payload = {
            // "client_id": decodedToken?.data?.client_id,
            "farmer_name": formValue?.fullName,
            // "mobile_no": decodedToken?.data?.client_mob,
            // "alt_mobile_no": "",
            // "state_id": "",
            // "branch_id": "",
            // "taluka_id": "",
            // "village_id": "",
            // "post_office": "",
            // "pincode": "",
            // "landmark": "",
            // "land_holding": "",
            // "water_source": "",
            // "irrigation_type": ""
        };
        try {
            const response = await AuthApi.updateProfile(payload);
            console.log("here",response)
            if (response && response.data) {
                const resp = await AuthApi.getProfileDetails();
                console.log("here2",resp.data)
                if (resp && resp.data) {
                    dispatch(profileDetail(resp?.data));
                    navigation.goBack();
                    ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
                } else {
                    console.log("Error: getProfileDetails response is empty.");
                }
            } else {
                console.log("Error: updateProfile response is empty.");
            }
        } catch (error: any) {
            console.log("Error in onSubmit:", error);
            ToastAndroid.show(error?.response?.data?.message || "Error updating profile", ToastAndroid.SHORT);
        } finally {
            setIsLoader(false);
        }
    };

    return (
        <SafeAreaView style={[ProfileScreenStyle.mainCardView, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <TopHeaderFixed
                leftIconSize={20}
                gobackText={t("MY_PROFILE")}
                topHeight={100}
                onGoBack={() => navigation.goBack()} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                {renderItem(`${t("FULL_NAME")}`, `${t("ENTER_FULL_NAME")}`, `${formValue?.fullName}`, errorMessage?.fullName, (text: any) => onChangeFormName('fullName', text))}
                {renderItem(`${t("PHONE_NUMBER")}`, "Mobile number", decodedToken?.data?.client_mob, errorMessage?.mobileNumber, '', 10, 'numeric')}
            </KeyboardAwareScrollView>
            <PressableClick style={{ height: 50 }} textstyle={{
                fontSize: 20, color: WHITE,
                top: 1
            }} label={`${t("SAVE")}`} onPress={onSubmit} isLoader={isLoader} />
        </SafeAreaView >
    )
}

export default ProfileScreen