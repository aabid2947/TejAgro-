import React, { useRef, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { Image, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { useDispatch, useSelector } from "react-redux";
import AuthApi from "../../api/AuthApi";
import { MobileNumber } from "../../components/commonComponent/MobileNumber";
import FontScaledText from "../../components/customInput/FontScaledText";
import DropdownPicker from "../../components/dropdownpicker/DropDownPicker";
import { RootStackParamList } from "../../components/guards/AuthNavigator";
import { useModalContext } from "../../components/modalContext/ModalContext";
import { languageSelection } from "../../reduxToolkit/counterSlice";
import { RootState } from "../../reduxToolkit/store";
import { OTP_SCREEN, REGESTRATION_SCREEN } from "../../routes/Routes";
import { GRAY_SHADE } from "../../shared/common-styles/colors";
import { PressableButton } from "../../shared/components/CommonUtilities";
import BelowIcon from "../../svg/BelowIcon";
import { ProfileScreenStyle } from "../profileScreen/ProfileScreenStyle";
import { LogInScreenStyle } from "./LoginScreenStyle";
import TejAgroIcon from "../../svg/TejAgroLogo";
import TextPoppinsSemiBold from "../../shared/fontFamily/TextPoppinsSemiBold";
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold";

export const LANGUAGES = [
    { name: 'English', value: 'en' },
    { name: 'मराठी', value: 'mr' }
]

const languageEnum: any = {
    en: "English",
    mr: 'मराठी'
}

const LogInScreen = () => {
    const { t } = useTranslation();
    const refStateRBSheet: any = useRef();
    const navigation: any = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [mobileNumber, setMobileNumber]: any = useState('');
    const [formValue, setFormValue] = useState({ countryCode: '+91', phoneNumber: '' });
    const [errorMsg, setErrorMsg] = useState("");
    const [mobileNumberError, setMobileNumberError]: any = useState('');
    const [isLoader, setLoader] = useState(false);
    const languageSelected = useSelector((state: RootState) => state.counter.languageSelected)
    const dispatch = useDispatch()
    const { openModal }: any = useModalContext();
    const renderItem = (placeholder: string, value: any, erroMsg?: any, onchange?: any,) => {
        return (
            <View>
                <View style={erroMsg ? LogInScreenStyle.mainBody1 : LogInScreenStyle.mainBody}>
                    <View style={LogInScreenStyle.dataView}>
                        <Text style={LogInScreenStyle.contryCodeStyle}>
                            +91
                        </Text>
                        <TextInput
                            style={LogInScreenStyle.inputText}
                            placeholder={placeholder}
                            placeholderTextColor={GRAY_SHADE}
                            value={value}
                            editable={onchange ? true : false}
                            onChangeText={onchange}
                            keyboardType={"numeric"}
                            maxLength={10}
                        />
                    </View>
                    {erroMsg &&
                        <View >
                            <Text style={LogInScreenStyle.errorFormText}>{erroMsg}</Text>
                        </View>
                    }
                </View>
            </View>
        )
    }

    const onChangeFormName = (text: any) => {
        setMobileNumber(text);
        setFormValue({ ...formValue, phoneNumber: text.replace(/\D/g, "") });
        setMobileNumberError(text ? null : "Please enter valid number");
    }

    const onClickSignIn = async () => {
        if ((!formValue.phoneNumber || formValue.phoneNumber.length <= 9)) {
            setMobileNumberError("Please enter a valid 10 digit mobile number");
            return;
        }
        try {
            console.log(9)
            setLoader(true);
            let response = await AuthApi.mobileSignIn({ mobile_no: Number(formValue.phoneNumber) });
            console.log(response.data, "mobileSignIn_response");

            if (response && response.data) {
                navigation.navigate(OTP_SCREEN, { ...response.data, mobileNumber })
            }
        } catch (error: any) {
            console.log(error, "anyffff");

            setMobileNumberError("Please enter a valid 10 digit mobile number");
            setLoader(false)
        }
    };

    const handlePrivacyPolicyClick = (url: string) => {
        openModal("Privacy policy link not available")
    }

    const getStartedPress = () => {
        navigation.navigate(REGESTRATION_SCREEN)
    }

    const handleLanguageChange = async (language: any, name: any) => {
        try {
            dispatch(languageSelection(name))
        } catch (error) {
            console.log('Error saving language to AsyncStorage:', error);
        }
    };

    const renderDropdown = (Title: string, placeholder: string, value: any, erroMsg: any, onchange?: any, keyboardType?: any,) => {
        return (
            <View>
                <TextPoppinsMediumBold style={ProfileScreenStyle.titleStyleText}>{t('Select Language')}</TextPoppinsMediumBold>
                <Pressable style={ProfileScreenStyle.mainBody} onPress={() => refStateRBSheet?.current?.open()}>
                    <View style={ProfileScreenStyle.dataViewDropDown}>
                        <FontScaledText
                            style={ProfileScreenStyle.inputTextDrop}
                            placeholder={t('Select Language')}
                            placeholderTextColor={GRAY_SHADE}
                            value={languageEnum[languageSelected]}
                            editable={false}
                        />
                        <BelowIcon width={15} height={15} />
                    </View>
                </Pressable>
                <DropdownPicker key={'Language'} placeHolderText="Language" refRBSheet={refStateRBSheet} options={LANGUAGES} onSelect={(language: any) => {
                    handleLanguageChange(language.name, language.value)
                    refStateRBSheet?.current?.close();
                }} />
            </View>
        )
    }

    return (
        <SafeAreaView style={LogInScreenStyle.mainView}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <TextPoppinsSemiBold style={LogInScreenStyle.loginText}>
                    {t("LOGIN")}
                </TextPoppinsSemiBold>
                <View style={LogInScreenStyle.logoView}>
                    <Image
                        source={require("../../assets/newlogo.png")} // replace with actual image URL
                        style={{
                            width: widthPercentageToDP(55), height: heightPercentageToDP(35)
                        }} />
                </View>
                <View style={LogInScreenStyle.inputView}>
                    {MobileNumber("Phone Number *", "Enter your mobile number", mobileNumber, '', (text: any) => onChangeFormName(text), LogInScreenStyle.dataView, LogInScreenStyle.mainBody)}
                    {mobileNumberError && <TextPoppinsSemiBold style={LogInScreenStyle.errorFormTextLogin}>{t('VALID_NUMBER')}</TextPoppinsSemiBold>}
                    {PressableButton(t('CONTINUE_BUTTON'), onClickSignIn)}
                    {/* {alreadyAccountView(t('NO_ACCOUNT'), t('SIGN_UP'), getStartedPress)} */}
                </View>
            </KeyboardAwareScrollView>
            <View>
                {renderDropdown("", "", languageSelected, "")}
            </View>
        </SafeAreaView>
    )
}

export default LogInScreen