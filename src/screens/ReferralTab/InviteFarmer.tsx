import { StyleSheet, Text, View } from "react-native"
import { PressableB } from "../../shared/components/CommonUtilities"
import FontScaledText from "../../components/customInput/FontScaledText"
import { BGRED, BLACK, GRAY_BORDER, GRAY_SHADE, WHITE } from "../../shared/common-styles/colors"
import { useState } from "react"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"


const InviteFarmer = () => {

    const [formValue, setFormValue] = useState({
        fullName: "",
        phoneNumber: "",
    })
    const [errorMessage, setErrorMessage]: any = useState({
        fullName: null,
        phoneNumber: null,
    })


    const onPressInvite = () => {

    }

    const renderItem = (Title: string, placeholder: string, value: any, erroMsg: any, onchange?: any, maxLength?: any, keyboardType?: any) => {
        return (
            <View style={{ marginTop: 10 }}>
                <Text style={styles.titleText}>
                    {Title}
                </Text>
                <View style={styles.dataView}>
                    <FontScaledText
                        style={styles.inputText}
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
                    <Text style={styles.errorFormText}>{erroMsg}</Text>
                }
            </View>
        )
    }

    const onChangeFormName = (state: any, text: any) => {
        setFormValue({ ...formValue, [state]: text });
        setErrorMessage({ ...errorMessage, [state]: '' });
    }
    return (
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} >
            <View style={{ marginHorizontal: 20, marginBottom:20 }}>
                {renderItem("Full Name *", "Enter your full name", formValue?.fullName, errorMessage?.fullName, (text: any) => onChangeFormName('fullName', text))}
                {renderItem("Phone", "Enter your Phone Number", formValue?.phoneNumber, errorMessage?.phoneNumber, (text: any) => onChangeFormName('phoneNumber', text), 10, 'numeric')}
            </View>
            {PressableB("Invite", onPressInvite)}
        </KeyboardAwareScrollView>
    )
}

export default InviteFarmer

const styles = StyleSheet.create({
    titleText: {
        fontSize: 16,
        color: BLACK,
        fontWeight: '500',
        lineHeight: 21,
        padding: 5
    },
    dataView: {
        backgroundColor: WHITE,
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: GRAY_BORDER,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputText: {
        marginHorizontal: 10,
        paddingStart: 10,
        height: 50,
        fontSize: 15,
        lineHeight: 15,
        color: BLACK,
    },
    errorFormText: {
        color: BGRED,
        fontSize: 12,
        lineHeight: 15
    },
})