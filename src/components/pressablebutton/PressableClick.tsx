import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { GRAY_SHADE, MDBLUE, WHITE } from '../../shared/common-styles/colors';
import TextPoppinsMediumBold from '../../shared/fontFamily/TextPoppinsMediumBold';

const PressableClick = (props: any) => {
    const { label, isLoader, onPress, disabled, style, textstyle, color, label1 } = props;
    return <>
        <Pressable
            disabled={disabled || isLoader}
            onPress={onPress}
            style={({ pressed }) => [{ ...buttonCommonStyle.buttonStyle, ...(disabled ? buttonCommonStyle.disabledStyle : {}), ...style, opacity: pressed ? 0.2 : 1 }]}
        >
            {!isLoader ? (
                <View>
                    <TextPoppinsMediumBold style={{ ...buttonCommonStyle.buttonText, ...textstyle }}>
                        {label}
                    </TextPoppinsMediumBold>
                    {label1 && <TextPoppinsMediumBold style={{ ...buttonCommonStyle.buttonText, ...textstyle }}>
                        {label1}
                    </TextPoppinsMediumBold>}
                </View>
            ) : (
                <ActivityIndicator color={color ? color : WHITE} />
            )}
        </Pressable>
    </>

}


const buttonCommonStyle = StyleSheet.create({
    buttonStyle: {
        borderRadius: 9,
        backgroundColor: MDBLUE,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        height: 54,
        marginVertical: 10,
        marginHorizontal: 20,
    },
    buttonText: {
        color: WHITE,
        fontSize: 16,
        lineHeight: 24,
        textAlign: "center"
    },
    disabledStyle: {
        opacity: 0.5,
    },
});
export default PressableClick;