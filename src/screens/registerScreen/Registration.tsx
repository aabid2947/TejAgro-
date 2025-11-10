import React, { useState } from "react";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { HOME_SCREEN, SIGIN_SCREEN } from "../../routes/Routes";
import { BLACK, GRAY_SHADE } from "../../shared/common-styles/colors";
import { LogInScreenStyle } from "../authScreen/LoginScreenStyle";
import { RegistrationStyle } from "./RegistrationStyle";
import FontScaledText from "../../components/customInput/FontScaledText";
import { alreadyAccountView, PressableButton } from "../../shared/components/CommonUtilities";
import RightTickIcon from "../../svg/RightTickIcon";
import { useModalContext } from "../../components/modalContext/ModalContext";
import { MobileNumber } from "../../components/commonComponent/MobileNumber";

const Registration = ({ navigation }: any) => {
    const [isLoader, setLoader] = useState(false);
    const { openModal }: any = useModalContext();
    const [checked, setChecked] = React.useState(true);
    const [formValue, setFormValue] = useState({
        fullName: "",
        mobileNumber: "",
        cropType: '',
        landSize: '',
        email: ''
    })

    const [errorMessage, setErrorMessage]: any = useState({
        fullName: null,
        mobileNumber: null,
        cropType: null,
        landSize: null,
        email: null,
    })

    const validate = () => {
        const validFormValues = {
            fullName: "",
            mobileNumber: "",
            cropType: "",
            landSize: "",
            email: "",
        };
        let isValid = false;
        if (!formValue.fullName || formValue.fullName.length <= 3) {
            isValid = true;
            validFormValues.fullName = "Full name is required"
        }
        if (!formValue.cropType) {
            isValid = true;
            validFormValues.cropType = "Crop type is required"
        }
        if (!formValue.landSize) {
            isValid = true;
            validFormValues.landSize = "Land size is required"
        }
        if (!formValue.mobileNumber) {
            isValid = true;
            validFormValues.mobileNumber = "Mobile number is required"
        }
        setErrorMessage(validFormValues);
        return isValid;
    }
    const onSubmit = async () => {
        // if (validate()) {
        //     return
        // }
        // if (!checked) {
        //     openModal("Please accept Terms and privacy")
        //     return
        // }
        setLoader(true)
        try {
            navigation.navigate(SIGIN_SCREEN)
            setLoader(false)
        } catch (error) {
            setLoader(false)
        }
    }

    const renderItem = (Title: string, placeholder: string, value: any, erroMsg: any, onchange?: any, maxLength?: any, keyboardType?: any, Icon?: any) => {
        return (
            <View >
                <Text style={RegistrationStyle.titleText}>
                    {Title}
                </Text>
                <View style={RegistrationStyle.dataView}>
                    <FontScaledText
                        style={RegistrationStyle.inputText}
                        placeholder={placeholder}
                        placeholderTextColor={GRAY_SHADE}
                        value={value}
                        maxim
                        editable={onchange ? true : false}
                        onChangeText={onchange}
                        keyboardType={keyboardType ? keyboardType : 'default'}
                        maxLength={maxLength ? maxLength : 100}
                    />
                </View>
                {erroMsg &&
                    <Text style={RegistrationStyle.errorFormText}>{erroMsg}</Text>
                }
            </View>
        )
    }

    const onChangeFormName = (state: any, text: any) => {
        setFormValue({ ...formValue, [state]: text });
        setErrorMessage({ ...errorMessage, [state]: '' });
    }

    const loginOnPress = () => {
        navigation.navigate(SIGIN_SCREEN)
    }

    const handlePrivacyPolicyClick = (url: string) => {
        openModal("Privacy policy link not available")
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <Text style={RegistrationStyle.signUpText}>
                    Sign up
                </Text>
                <View style={{ gap: 15, paddingHorizontal: 15 }}>
                    {renderItem("Full Name *", "Enter your full name", formValue?.fullName, errorMessage?.fullName, (text: any) => onChangeFormName('fullName', text))}
                    {renderItem("E-Mail", "Enter your E-Mail", formValue?.email, errorMessage?.email, (text: any) => onChangeFormName('email', text))}
                    <MobileNumber 
                        title="Phone Number *"
                        placeholder="Enter your mobile number"
                        value={formValue?.mobileNumber}
                        error={errorMessage?.mobileNumber}
                        onChangeText={(text: any) => onChangeFormName('mobileNumber', text)}
                    />
                    {renderItem("Crop Type", "Enter your Crop Type", formValue?.cropType, errorMessage?.cropType, (text: any) => onChangeFormName('cropType', text))}
                    {renderItem("Land Size", "Enter your Land Size", formValue?.landSize, errorMessage?.landSize, (text: any) => onChangeFormName('landSize', text))}
                </View>
            </KeyboardAwareScrollView>
            <View style={{ flexDirection: 'row', marginVertical: 20 }}>
                <Pressable style={({ pressed }) => [RegistrationStyle.checkbox || {}, { opacity: pressed ? 0.2 : 1 }]} onPress={() => {
                    setChecked(!checked);
                }}>
                    {checked && <RightTickIcon height={10} width={10} color={BLACK} />}
                </Pressable>
                <Text onPress={() => {
                    setChecked(!checked);
                }} style={RegistrationStyle.txtPrivacyPolicy}>
                    I agree with Terms and Privacy
                </Text>
            </View>
            {PressableButton("CONTINUE", onSubmit)}
            {alreadyAccountView("Already a member?", " Login", loginOnPress)}
        </SafeAreaView>
    )
}

export default Registration