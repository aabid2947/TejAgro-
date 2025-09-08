import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity, Pressable, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AuthApi from '../../api/AuthApi';
import { ReferralCodeStyle } from './ReferralCodeStyle';
import BackButtonIcon from '../../svg/BackButtonIcon';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';
import TextPoppinsSemiBold from '../../shared/fontFamily/TextPoppinsSemiBold';
import FontScaledText from '../../components/customInput/FontScaledText';
import { BLACK, GREY, PoppinsMedium } from '../../shared/common-styles/colors';
import { referralDetails } from '../../reduxToolkit/counterSlice';

const ReferralScreen = () => {
    const [verification, setVerification] = useState(false);
    const [referralCode, setRederralCode] = useState("");
    const [referralUser, setRederralUser] = useState({});
    const [isLoader, setIsLoader] = useState(false);
    const [isSubmitLoader, setIsSubmitLoader] = useState(false);
    const [errorMsg, setError] = useState(null);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets()
    const onContinue = async () => {
        // try {
        //     if (referralCode) {
        //         setRederralUser({});
        //         setVerification(false);
        //         setError(null)
        //         setIsLoader(true)
        //         const response = await AuthApi.verifyReferralDetails({ referralCode: referralCode.toUpperCase() });
        //         setIsLoader(false);
        //         if (response && response.data && response.data?.success) {
        //             setRederralUser(response.data);
        //             setVerification(true);
        //         } else {
        //             setVerification(false);
        //             setRederralCode("");
        //             setRederralUser({});
        //             setError(response?.data?.message)
        //         }
        //     } else {
        //         setError("Please Enter Valid Referral Code");
        //     }
        // } catch (e) {
        //     console.log(e);
        //     setIsLoader(false);
        //     setVerification(false);
        //     setRederralCode("");
        //     setRederralUser({});
        //     setError("Invalid Referral Code");
        // }
    }
    const onSubmit = async () => {
        // try {
        //     setError(null)
        //     setIsSubmitLoader(true)
        //     const response = await api.addReferralAllocationDetails({ referralCode: referralCode.toUpperCase(), userId: userInfo.userId });
        //     setIsSubmitLoader(false);
        //     if (response && response.data && response.data?.success) {
        //         onUpdateUserReferralUsed("DONE")
        //     } else {
        //         setError(response?.data?.message)
        //     }
        // } catch (e) {
        //     console.log(e);
        //     setVerification(false);
        //     setError("Invalid Referral Code")

        // }
    }
    const onChangeForm = (value: any) => {
        const { text } = value.nativeEvent;
        setError(null);
        setRederralCode(text);
        // if (text) {
        //     setRederralCode(text.toUpperCase());
        // } else {
        //     setRederralCode("");
        // }
    }

    const goBackToInitial = () => {
        setVerification(false);
        setRederralUser({});
    }

    const onUpdateUserReferralUsed = async (referralCodeUsed: any) => {
        dispatch(referralDetails())
        // try {
        //     await api.updateUserReferralUsed({ userId: userInfo.userId, referralCodeUsed: referralCodeUsed || "SKIP" })
        //     dispatch({ type: AUTH_TYPE.SET_REFERRAL, payload: { isReferral: true } })
        // } catch (error) {
        //     console.log(error);
        //     dispatch({ type: AUTH_TYPE.SET_REFERRAL, payload: { isReferral: true } })
        // }

    }

    return (
        <SafeAreaView style={{ ...ReferralCodeStyle.container, paddingTop: insets.top }}>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={ReferralCodeStyle.backIcon} >
                    <TextPoppinsMediumBold>Referral Code</TextPoppinsMediumBold>
                </View>
                <View style={ReferralCodeStyle.skipBtn}>
                    <TouchableOpacity accessible={true}
                        testID="referral_skip"
                        accessibilityLabel="referral_skip"
                        onPress={() => onUpdateUserReferralUsed("SKIP")}
                    >
                        <TextPoppinsMediumBold accessible={true}
                            testID="referral_skip_text"
                            accessibilityLabel="referral_skip_text" style={ReferralCodeStyle.skipBtnTxt}>Skip</TextPoppinsMediumBold>
                    </TouchableOpacity>
                </View>
                {/* </View> */}
                <View style={{ ...ReferralCodeStyle.formContainer }}>
                    <View style={ReferralCodeStyle.formFieldsRow}>
                        <View style={ReferralCodeStyle.formTxt}>
                            <TextPoppinsSemiBold style={ReferralCodeStyle.headerFormTxt}>Have a Referral Code ? </TextPoppinsSemiBold>
                            {/* <TextPoppinsSemiBold style={ReferralCodeStyle.headerFormTxt}>Referral Code ?</TextPoppinsSemiBold> */}
                        </View>
                    </View>
                    <View style={ReferralCodeStyle.formFieldsRow}>
                        <View style={ReferralCodeStyle.formTxt}>
                            <TextPoppinsSemiBold style={ReferralCodeStyle.commonFormTxt}>Referral Code</TextPoppinsSemiBold>
                        </View>
                        {
                            verification ?
                                <View key={2}>
                                    <TextPoppinsSemiBold accessible={true}
                                        testID="referral_code"
                                        accessibilityLabel="referral_code" style={ReferralCodeStyle.userNameTxt}>{referralCode.toUpperCase()}</TextPoppinsSemiBold>
                                </View> :
                                <View style={ReferralCodeStyle.inputElement} key={2}>
                                    <FontScaledText value={referralCode} accessible={true} style={{ fontFamily: PoppinsMedium }}
                                        placeholder={"Enter here"} placeholderTextColor={GREY}
                                        testID="referral_code_verify"
                                        accessibilityLabel="referral_code_verify"
                                        autoCorrect={false} autoCapitalize="characters" onChange={(event: any) => onChangeForm(event)} maxLength={15} />
                                </View>

                        }

                    </View>
                    {errorMsg && !verification &&
                        <View style={ReferralCodeStyle.errorMsgTxt}>
                            <TextPoppinsSemiBold style={ReferralCodeStyle.erroFormTxt}>{errorMsg}</TextPoppinsSemiBold>
                        </View>
                    }
                    {/* {
                        verification ? null :
                            <View>
                                <View style={ReferralCodeStyle.contentFirstTxt}>
                                    <View style={ReferralCodeStyle.formTxt}>
                                        <TextNunitoSemibold style={ReferralCodeStyle.recieverTxt}>In case you may have received a</TextNunitoSemibold>
                                    </View>
                                    <View style={ReferralCodeStyle.formTxt}>
                                        <TextNunitoSemibold style={ReferralCodeStyle.recieverTxt}>referral code from:</TextNunitoSemibold>
                                    </View>
                                </View>
                                <View style={ReferralCodeStyle.contentSecondTxt}>
                                    <View style={ReferralCodeStyle.formTxt}>
                                        <TextNunitoSemibold style={ReferralCodeStyle.recieverTxt}>• Partner Bank</TextNunitoSemibold>
                                    </View>
                                    <View style={ReferralCodeStyle.formTxt}>
                                        <TextNunitoSemibold style={ReferralCodeStyle.recieverTxt}>• Amhi Kolhapurkar</TextNunitoSemibold>
                                    </View>
                                    <View style={ReferralCodeStyle.formTxt}>
                                        <TextNunitoSemibold style={ReferralCodeStyle.recieverTxt}>• Restaurant/Hotel</TextNunitoSemibold>
                                    </View>
                                    <View style={ReferralCodeStyle.formTxt}>
                                        <TextNunitoSemibold style={ReferralCodeStyle.recieverTxt}>• Staff Member</TextNunitoSemibold>
                                    </View>
                                </View>
                            </View>
                    }

                    {
                        verification && <>
                            <View style={ReferralCodeStyle.formFieldsRow}>
                                <View style={ReferralCodeStyle.formTxt}>
                                    <TextNunitoSemibold style={ReferralCodeStyle.commonFormTxt}>Referrer</TextNunitoSemibold>
                                </View>
                                <View>
                                    <TextNunitoSemibold photo={ReferralCodeStyle.userNameTxt}>{referralUser?.userName}</TextNunitoSemibold>
                                </View>
                                <View>
                                    <CustomFastImage style={(referralUser?.roleId == 8) ? ReferralCodeStyle.image : ReferralCodeStyle.imageReferral}
                                        source={(referralUser?.roleId == 7) ? { uri: IMAGE_BASE_URL + "assets/WaiuFirstDefaultImage.png" } : getS3ReferalURL(referralUser?.photo)}
                                        alt="image"
                                    />
                                </View>
                            </View>
                        </>
                    }
                    {errorMsg && verification &&
                        <View style={ReferralCodeStyle.errorMsgTxt}>
                            <TextNunitoSemibold style={ReferralCodeStyle.erroFormTxt}>{errorMsg}</TextNunitoSemibold>
                        </View>
                    } */}
                </View>
            </ScrollView>
            <View style={{ marginBottom: 20 }}>
                {
                    verification ?
                        <View style={ReferralCodeStyle.buttonsContainer}>
                            <TouchableOpacity accessible={true}
                                testID="referral_code_submit"
                                accessibilityLabel="referral_code_submit" style={ReferralCodeStyle.submitBtn}
                                onPress={() => onSubmit()}
                            >
                                <TextPoppinsMediumBold accessible={true}
                                    testID="referral_code_submit_text"
                                    accessibilityLabel="referral_code_submit_text" style={ReferralCodeStyle.verifyBtnTxt}>SUBMIT</TextPoppinsMediumBold>
                            </TouchableOpacity>
                        </View> :
                        <View style={ReferralCodeStyle.buttonsContainer}>
                            <TouchableOpacity accessible={true}
                                testID="referral_code_verification"
                                accessibilityLabel="referral_code_verification" style={ReferralCodeStyle.verifyBtn}
                                onPress={() => onContinue()}
                            >
                                <TextPoppinsMediumBold accessible={true}
                                    testID="referral_code_verification_text"
                                    accessibilityLabel="referral_code_verification_text" style={ReferralCodeStyle.verifyBtnTxt}>VERIFY</TextPoppinsMediumBold>
                            </TouchableOpacity>
                        </View>

                }
            </View>
        </SafeAreaView >
    )
}

export default ReferralScreen;
