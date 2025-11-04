import { StyleSheet, Text, TextInput, View } from "react-native"
import { BGRED, BLACK, GRAY_SHADE, PoppinsMedium, WHITE } from "../../shared/common-styles/colors"
import { useTranslation } from "react-i18next";
import TextPoppinsSemiBold from "../../shared/fontFamily/TextPoppinsSemiBold";
import TextPoppinsMediumBold from "../../shared/fontFamily/TextPoppinsMediumBold";
import { widthPercentageToDP } from "react-native-responsive-screen";

export const ReferralCodeInput = (Title: string, placeholder: string, value: any, erroMsg?: any, onchange?: any, styleView?: any, mainView?: any) => {
    const { t } = useTranslation();
    return (
        <View style={mainView ? mainView : {}}>
            <TextPoppinsMediumBold style={style.titleText}>
                {t('REFERRAL_CODE')} ({t('OPTIONAL')})
            </TextPoppinsMediumBold>
            <View style={styleView ? styleView : style.dataView1}>
                <TextInput
                    style={style.inputText}
                    placeholder={t('ENTER_REFERRAL_CODE')}
                    placeholderTextColor={GRAY_SHADE}
                    value={value}
                    editable={onchange ? true : false}
                    onChangeText={onchange}
                    autoCapitalize="characters"
                    maxLength={10}
                />
            </View>
            <TextPoppinsSemiBold style={style.helpText}>
                {t('REFERRAL_CODE_HELP')}
            </TextPoppinsSemiBold>
            {erroMsg &&
                <TextPoppinsSemiBold style={style.errorFormText}>{erroMsg}</TextPoppinsSemiBold>
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
        lineHeight: 15,
        marginTop: 5
    },
    helpText: {
        color: GRAY_SHADE,
        fontSize: 12,
        lineHeight: 15,
        marginTop: 5,
        paddingHorizontal: 5
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
    inputText: {
        marginHorizontal: 15,
        paddingStart: 10,
        height: 50,
        fontSize: 15,
        lineHeight: 22,
        width: widthPercentageToDP(80),
        fontFamily: PoppinsMedium,
        color: BLACK,
        flex: 1
    },
})