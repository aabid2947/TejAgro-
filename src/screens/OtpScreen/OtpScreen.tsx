import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, SafeAreaView, TextInput, View, Platform, Linking, TouchableOpacity } from "react-native";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { useDispatch } from "react-redux";
import AuthApi from "../../api/AuthApi";
import { RootStackParamList } from "../../components/guards/AuthNavigator";
import TopHeaderFixed from "../../components/headerview/TopHeaderFixed";
import { useModalContext } from "../../components/modalContext/ModalContext";
import { login, profileDetail, setReferralCode } from "../../reduxToolkit/counterSlice";
import { PressableButton } from "../../shared/components/CommonUtilities";
import { ASYNC_STORAGE } from "../../shared/utilities/String";
import RefreshSvg from "../../svg/RefreshSvg";
import { LogInScreenStyle } from "../authScreen/LoginScreenStyle";
import CountDown from "./CountDown";
const CountDownComponent = CountDown as any;
import { otpstyles } from "./otpstyles";
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
    
    // Auto-focus on mount
    useEffect(() => {
        console.log('\n🚀 === OTP SCREEN MOUNTED ===');
        console.log('Platform:', Platform.OS);
        console.log('Mobile Number:', route?.params?.mobileNumber);
        console.log('Using Android Autofill (no permissions required)');
        
        // Focus input after short delay
        setTimeout(() => {
            ref.current?.focus();
        }, 600);
        
        return () => {
            console.log('🛑 === OTP SCREEN UNMOUNTING ===');
        };
    }, []);

    const onCountFinish = () => {
        console.log('⏰ Countdown finished - OTP expired');
        setSessionTimeOut(true);
        setRunning(false);
    }

    const onVerifyOTP = async (otpValue?: string) => {
        console.log('\n🔐 === VERIFYING OTP ===');
        
        const otpToVerify = otpValue || value;
        console.log('OTP to verify:', otpToVerify);
        console.log('Entry method:', otpValue !== value ? '🤖 Auto-filled' : '👆 Manual');
        
        setErrorMsg("");

        if (!otpToVerify || otpToVerify.length < 4) {
            console.log('❌ Invalid OTP - too short');
            setErrorMsg(t("VALID_OTP"));
            return;
        }
        
        const payload: any = {
            "mobile_no": route?.params?.mobileNumber,
            "otp": Number(otpToVerify)
        };

        if (route?.params?.enteredReferralCode) {
            payload.referral_code = route?.params?.enteredReferralCode;
            console.log('📌 Referral code included');
        }

        console.log('📤 Sending verification request...');

        try {
            setLoader(true);
            const response = await AuthApi.verifyOTP(payload);
            
            console.log('📥 Response status:', response?.data?.status);
            
            if (response?.data?.status) {
                if (response.data.jwt) {
                    console.log('✅ LOGIN SUCCESSFUL!');
                    const jwtToken = JSON.stringify(response?.data?.jwt);
                    await AsyncStorage.setItem('jwtToken', jwtToken);
                    await AsyncStorage.setItem(ASYNC_STORAGE.ISUSERINFO, JSON.stringify(response?.data));
                    setLoader(false);
                    dispatch(login(response?.data));
                } else if (response.data.referral_verified !== undefined) {
                    if (response.data.referral_verified) {
                        console.log("✅ Referral verified");
                        
                        if (route?.params?.enteredReferralCode) {
                            dispatch(setReferralCode(route.params.enteredReferralCode));
                        }
                        
                        const loginPayload = {
                            "mobile_no": route?.params?.mobileNumber,
                            "otp": Number(otpToVerify)
                        };
                        
                        try {
                            const loginResponse = await AuthApi.verifyOTP(loginPayload);
                            
                            if (loginResponse?.data?.status && loginResponse.data.jwt) {
                                console.log('✅ LOGIN SUCCESSFUL!');
                                const jwtToken = JSON.stringify(loginResponse?.data?.jwt);
                                await AsyncStorage.setItem('jwtToken', jwtToken);
                                await AsyncStorage.setItem(ASYNC_STORAGE.ISUSERINFO, JSON.stringify(loginResponse?.data));
                                setLoader(false);
                                dispatch(login(loginResponse?.data));
                            } else {
                                setLoader(false);
                                setErrorMsg(loginResponse.data?.message || "Login failed");
                            }
                        } catch (loginError: any) {
                            setLoader(false);
                            setErrorMsg(loginError?.response?.data?.message || "Login failed");
                        }
                    } else {
                        setLoader(false);
                        setErrorMsg(response.data.message || "Invalid referral code");
                    }
                } else {
                    setLoader(false);
                    setErrorMsg(response.data.message || "Please enter valid OTP");
                }
            } else {
                setLoader(false);
                setErrorMsg(response.data?.message || "Please enter valid OTP");
            }
        }
        catch (error: any) {
            setLoader(false);
            console.log('❌ ERROR:', error?.response?.data || error?.message);
            
            if (error?.response?.data?.message) {
                setErrorMsg(error.response.data.message);
            } else if (error?.message) {
                setErrorMsg(error.message);
            } else {
                setErrorMsg("Please enter valid OTP");
            }
        }
    }

    const onResendOTP = async () => {
        console.log('\n🔄 === RESENDING OTP ===');
        
        setSessionTimeOut(false);
        setRunning(true);
        setOtpId(parseInt(otpId) + 1);
        setValue('');
        setErrorMsg('');
        
        try {
            const res = await AuthApi.mobileSignIn({ mobile_no: Number(route?.params?.mobileNumber) });
            console.log('✅ OTP resent');
            
            // Refocus after resend
            setTimeout(() => {
                ref.current?.focus();
            }, 500);
        } catch (error) {
            console.log('❌ Resend error:', error);
        }
    }

    // Open SMS app helper
    const openSmsApp = () => {
        if (Platform.OS === 'android') {
            Linking.openURL('sms:').catch(err => console.log('Error opening SMS app:', err));
        }
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
                onGoBack={() => {
                    console.log('🔙 Going back');
                    navigation.goBack();
                }}
                topHeight={100} />
            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" style={otpstyles.parentView}>
                <View style={LogInScreenStyle.logoView}>
                    <Image
                        source={require("../../assets/newlogo.png")}
                        style={{
                            width: widthPercentageToDP(55), 
                            height: heightPercentageToDP(35)
                        }} />
                </View>
                <View style={otpstyles.contentHeaderWrapper}>
                    <TextPoppinsMediumBold style={otpstyles.otpTitle}>
                        {t('DIGIT_CODE')}
                    </TextPoppinsMediumBold>
                    <TextPoppinsSemiBold style={{ ...otpstyles.mobileNumber, fontFamily: PoppinsExtraBold }}>
                        +91-{route?.params?.countryCode} {route?.params?.mobileNumber}
                    </TextPoppinsSemiBold>
                    
                    {/* Helper text */}
                    <View style={{ marginTop: 10, marginBottom: 15, alignItems: 'center' }}>
                        <TextPoppinsSemiBold style={{ 
                            fontSize: 13, 
                            color: '#666', 
                            textAlign: 'center',
                            paddingHorizontal: 20
                        }}>
                            Enter the 4-digit code sent to your mobile
                        </TextPoppinsSemiBold>
                        
                        {/* Quick SMS app link */}
                   
                    </View>

                    <View style={otpstyles.verifyInput}>
                        <CodeField
                            ref={ref}
                            {...props}
                            value={value}
                            onChangeText={(text) => {
                                console.log('📝 OTP input:', text);
                                setValue(text);
                                setErrorMsg('');
                                
                                // Auto-submit when 4 digits entered
                                if (text.length === 4) {
                                    console.log('✅ Complete OTP entered, auto-submitting...');
                                    setTimeout(() => {
                                        onVerifyOTP(text);
                                    }, 400);
                                }
                            }}
                            cellCount={CELL_COUNT}
                            rootStyle={{ marginTop: 10 }}
                            keyboardType="number-pad"
                            
                            // CRITICAL: These enable Android autofill
                            textContentType="oneTimeCode"
                            autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
                            autoFocus={true}
                            
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
                                <TextPoppinsMediumBold style={otpstyles.otpErroFormTxt}>
                                    {errorMsg}
                                </TextPoppinsMediumBold>
                            </View>
                        }
                    </View>
                    
                    <View style={otpstyles.countDown}>
                        <CountDownComponent
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
                    
                    {sessionTimeOut && 
                        <Pressable onPress={() => onResendOTP()} style={otpstyles.resOtp}>
                            <RefreshSvg height={14} width={14} />
                            <TextPoppinsMediumBold style={otpstyles.resendOTPTxt}>
                                {t('RESEND')}
                            </TextPoppinsMediumBold>
                        </Pressable>
                    }
                </View>
                
                <View style={{ marginBottom: 20 }}>
                    {PressableButton(
                        isLoader ? 'Loading...' : `${t("CONTINUE_BUTTON")}`, 
                        () => {
                            console.log('👆 Continue pressed');
                            onVerifyOTP(value);
                        }, 
                        isLoader
                    )}
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default OtpScreen