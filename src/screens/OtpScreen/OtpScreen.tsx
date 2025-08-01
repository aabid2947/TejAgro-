
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import AuthApi from "../../api/AuthApi";
import { RootStackParamList } from "../../components/guards/AuthNavigator";
import TopHeaderFixed from "../../components/headerview/TopHeaderFixed";
import { useModalContext } from "../../components/modalContext/ModalContext";
import { login, profileDetail } from "../../reduxToolkit/counterSlice";
import { PressableButton } from "../../shared/components/CommonUtilities";
import { ASYNC_STORAGE } from "../../shared/utilities/String";
import OtpIconLock from "../../svg/OtpIconLock";
import RefreshSvg from "../../svg/RefreshSvg";
import { LogInScreenStyle } from "../authScreen/LoginScreenStyle";
import CountDown from "./CountDown";
import { otpstyles } from "./otpstyles";
import TejAgroIcon from "../../svg/TejAgroLogo";
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold";
import TextPoppinsSemiBold from "../../shared/fontFamily/TextPoppinsSemiBold";
import { PoppinsExtraBold } from "../../shared/common-styles/colors";

const OtpScreen = ({ route: { params }, route }: any) => {
    const { t } = useTranslation();
    const [errorMsg, setErrorMsg] = useState("");
    const dispatch = useDispatch()
    const { openModal }: any = useModalContext();
    const navigation: any = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [isLoader, setLoader] = useState(false);
    const [otpId, setOtpId]: any = useState(1)
    const [running, setRunning] = useState(true);
    const [sessionTimeOut, setSessionTimeOut]: any = useState(false);
    const [value, setValue] = useState('');
    const CELL_COUNT = 4;
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const onCountFinish = () => {
        setSessionTimeOut(true);
        setRunning(false);
    }
    // useEffect(() => {
    //     onResendOTP()
    // }, [])
    const onVerifyOTP = async (otpValue?: string) => {
        setErrorMsg("");

        // Validate OTP input
        if (!Number(`${value}`)) {
            setErrorMsg(t("VALID_OTP")); // Use translation
            return;
        }
        if ((`${value}`).length <= 3) {
            setErrorMsg(t("VALID_OTP")); // Use translation
            return;
        }
        const payload = {
            "mobile_no": route?.params?.mobileNumber,
            "otp": Number(`${value}`)
        }
        try {
            setLoader(true)
            const response = await AuthApi.verifyOTP(payload)
            if (response && response?.data?.jwt) {
                const jwtToken = JSON.stringify(response?.data?.jwt);
                // console.log(jwtToken, "jwtTokenjwtTokenjwtTokenjwtTokenjwtToken");

                await AsyncStorage.setItem('jwtToken', jwtToken);
                await AsyncStorage.setItem(ASYNC_STORAGE.ISUSERINFO, JSON.stringify(response?.data));
                setLoader(false)
                dispatch(login(response?.data))

            } else {
                setLoader(false)
                setErrorMsg("Please enter valid OTP");
            }
        }
        catch (error: any) {
            setLoader(false)
            setErrorMsg("Please enter valid OTP");
        }
    }

    const onResendOTP = async () => {
        setSessionTimeOut(false);
        setRunning(true);
        setOtpId(parseInt(otpId) + 1)
        const res =await AuthApi.mobileSignIn({ mobile_no: Number(route?.params?.mobileNumber) });
        console.log(res)
    }
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    return (
        <SafeAreaView style={otpstyles.dashboardContainer}>
            <TopHeaderFixed
                leftIcon="arrow-back"
                leftIconSize={20}
                gobackText={t("ENTER_OTP")}
                onGoBack={() => navigation.goBack()}
                topHeight={100} />
            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" style={otpstyles.parentView}>
                <View style={LogInScreenStyle.logoView}>
                    <Image
                        source={require("../../assets/newlogo.png")} // replace with actual image URL
                        style={{
                            width: widthPercentageToDP(55), height: heightPercentageToDP(35)
                        }} />
                    {/* <TejAgroIcon width={widthPercentageToDP(55)} height={heightPercentageToDP(25)} /> */}
                </View>
                <View style={otpstyles.contentHeaderWrapper}>
                    <TextPoppinsMediumBold style={otpstyles.otpTitle}>{t('DIGIT_CODE')}</TextPoppinsMediumBold>
                    <TextPoppinsSemiBold style={{ ...otpstyles.mobileNumber, fontFamily: PoppinsExtraBold }}>+91-{route?.params?.countryCode} {route?.params?.mobileNumber}</TextPoppinsSemiBold>
                    <View style={otpstyles.verifyInput}>
                        <CodeField
                            ref={ref}
                            {...props}
                            value={value}
                            onChangeText={setValue}
                            cellCount={CELL_COUNT}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            renderCell={({ index, symbol, isFocused }: any) => (
                                <View style={otpstyles.otpBox} key={index}>
                                    <TextPoppinsMediumBold
                                        style={otpstyles.inputStyle}
                                        onLayout={getCellOnLayoutHandler(index)}>
                                        {symbol || (isFocused ? <Cursor /> : null)}
                                    </TextPoppinsMediumBold>
                                </View>
                            )}
                        />
                        {errorMsg &&
                            <View style={otpstyles.otpFormTxt}>
                                <TextPoppinsMediumBold style={otpstyles.otpErroFormTxt}>{t('VALID_OTP')}</TextPoppinsMediumBold>
                            </View>}
                    </View>
                    <View style={otpstyles.countDown}>
                        <CountDown
                            sessionTimeOut={sessionTimeOut}
                            labelText={"Resend code in"}
                            until={59}
                            onFinish={onCountFinish}
                            key={otpId}
                            size={15}
                            timeToShow={['S']}
                            showSeparator={true}
                            running={running}
                        />
                    </View>
                    {sessionTimeOut && <Pressable onPress={() => onResendOTP()} style={otpstyles.resOtp}>
                        <RefreshSvg height={14} width={14} />
                        <TextPoppinsMediumBold style={otpstyles.resendOTPTxt}>{t('RESEND')}</TextPoppinsMediumBold>
                    </Pressable>}
                </View>
                <View style={{ marginBottom: 20 }}>
                    {PressableButton(isLoader ? 'Loading...' : `${t("CONTINUE_BUTTON")}`, () => onVerifyOTP(value), isLoader)}
                </View>
            </KeyboardAwareScrollView>

        </SafeAreaView>
    )
}

export default OtpScreen
