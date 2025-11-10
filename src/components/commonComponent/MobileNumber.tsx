import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native"
import { BGRED, BLACK, GRAY_SHADE, PoppinsMedium, WHITE } from "../../shared/common-styles/colors"
import { useTranslation } from "react-i18next";
import TextPoppinsSemiBold from "../../shared/fontFamily/TextPoppinsSemiBold";
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold";
import { widthPercentageToDP } from "react-native-responsive-screen";

interface MobileNumberProps {
    title?: string;
    placeholder?: string;
    value: any;
    error?: any;
    onChangeText?: any;
    style?: any;
    containerStyle?: any;
}

export const MobileNumber: React.FC<MobileNumberProps> = ({
    title,
    placeholder,
    value,
    error,
    onChangeText,
    style: styleView,
    containerStyle: mainView
}) => {
    const { t } = useTranslation();
    return (
        <View style={mainView ? mainView : {}}>
            <TextPoppinsMediumBold style={style.titleText}>
                {title || t('PHONE_NUMBER')}
            </TextPoppinsMediumBold>
            <View style={styleView ? styleView : style.dataView1}>
                <TextPoppinsMediumBold style={style.contryCodeStyle}>
                    {t('COUNTRY_CODE')}
                </TextPoppinsMediumBold>
                <TextInput
                    style={style.inputText}
                    placeholder={placeholder || t('ENTER_NUMBER')}
                    placeholderTextColor={GRAY_SHADE}
                    value={value}
                    editable={onChangeText ? true : false}
                    onChangeText={onChangeText}
                    keyboardType={"numeric"}
                    maxLength={10}
                />
            </View>
            {error &&
                <TextPoppinsSemiBold style={style.errorFormText}>{error}</TextPoppinsSemiBold>
            }
        </View>
    )
}

const style = StyleSheet.create({
    titleText: {
        fontSize: 16,
        color: BLACK,
        lineHeight: 21,
        padding: 5
    },
    errorFormText: {
        color: BGRED,
        fontSize: 12,
        lineHeight: 15
    },
    dataView1: {
        backgroundColor: WHITE,
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: GRAY_SHADE,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contryCodeStyle: {
        color: BLACK,
        fontSize: 16,
        lineHeight: 21,
        paddingHorizontal: 10,
        borderEndWidth: 1,
        borderColor: BLACK,
        paddingBottom: 3
    },
    inputText: {
        marginHorizontal: 10,
        paddingStart: 10,
        height: 50,
        fontSize: 15,
        lineHeight: 22,
        width:widthPercentageToDP(80),
        fontFamily: PoppinsMedium,
        color: BLACK,
        borderLeftWidth: 1,
        borderLeftColor: GRAY_SHADE
    },
})