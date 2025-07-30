import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FontScaledText from "../../components/customInput/FontScaledText";
import TopHeaderFixed from "../../components/headerview/TopHeaderFixed";
import PressableClick from "../../components/pressablebutton/PressableClick";
import { RootStackParamList } from "../../routes/AppRouter";
import { GRAY_SHADE, WHITE } from "../../shared/common-styles/colors";
import { ProfileScreenStyle } from "../profileScreen/ProfileScreenStyle";

const AddPaymentScreen = () => {
    const navigation: any = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [isLoader, setIsLoader] = useState(false);
    const [formValue, setFormValue] = useState({
        cardHolderName: "",
        cardNumber: "",
        cvv: "",
        expDate: ""
    })
    const [errorMessage, setErrorMessage] = useState({
        cardHolderName: '',
        cardNumber: '',
        cvv: '',
        expDate: ''
    })
    const onChangeFormName = (state: any, text: any) => {
        setFormValue({ ...formValue, [state]: text });
        setErrorMessage({ ...errorMessage, [state]: '' });
    }
    const validate = () => {
        const validFormValues = {
            cardHolderName: "",
            cardNumber: "",
            cvv: "",
            expDate: ""
        };
        let isValid = false;
        if (!formValue.cardHolderName || formValue.cardHolderName.length <= 3) {
            isValid = true;
            validFormValues.cardHolderName = "Card holder name is required"
        }
        if (!formValue.cardNumber) {
            isValid = true;
            validFormValues.cardNumber = "Card number is required"
        }
        if (!formValue.cvv) {
            isValid = true;
            validFormValues.cvv = "CVV is required"
        }
        if (!formValue.expDate) {
            isValid = true;
            validFormValues.expDate = "Expiry date is required"
        }
        setErrorMessage(validFormValues);
        return isValid;
    }
    const onSubmit = async () => {
        setIsLoader(true)
        if (validate()) {
            setIsLoader(false)
            return
        }
        try {
            navigation.goBack()
            setIsLoader(false)
        } catch (error: any) {
        }
    }
    const renderItem = (Title: string, placeholder: string, value: any, erroMsg: any, onchange?: any, keyboardType?: any, Icon?: any) => {
        return (
            <View>
                <Text style={ProfileScreenStyle.titleStyleText}>{Title}</Text>
                <View style={ProfileScreenStyle.mainBodyView}>
                    <View style={ProfileScreenStyle.dataView}>
                        <FontScaledText
                            style={ProfileScreenStyle.inputText}
                            placeholder={placeholder}
                            placeholderTextColor={GRAY_SHADE}
                            value={value}
                            editable={onchange ? true : false}
                            onChangeText={onchange}
                            keyboardType={keyboardType ? keyboardType : 'default'}
                        />
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

    return (
        <SafeAreaView style={ProfileScreenStyle.mainCardView}>
            <TopHeaderFixed
                leftIconSize={20}
                gobackText="Add Payment Method"
                topHeight={100}
                onGoBack={() => navigation.goBack()} />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                {renderItem("Card Holder Name", "Enter card holder name", formValue?.cardHolderName, errorMessage?.cardHolderName, (text: any) => onChangeFormName('cardHolderName', text), 'default')}
                {renderItem("Card Number", "Enter card number", formValue?.cardNumber, errorMessage?.cardNumber, (text: any) => onChangeFormName('cardNumber', text), 'numeric')}
                {renderItem("CVV", "Enter cvv", formValue?.cvv, errorMessage?.cvv, (text: any) => onChangeFormName('cvv', text), 'numeric')}
                {renderItem("Expiration Date", "Enter expiry date", formValue?.expDate, errorMessage?.expDate, (text: any) => onChangeFormName('expDate', text))}
            </KeyboardAwareScrollView>
            <PressableClick style={{ height: 50 }} textstyle={{ fontSize: 20, color: WHITE }} label={"ADD NEW CARD"} onPress={onSubmit} isLoader={isLoader} />
        </SafeAreaView >
    )
}

export default AddPaymentScreen;