import React from 'react';
import { Text } from 'react-native';
import { TextCommonStyle } from './TextCommonStyle'

const TextPoppinsSemiBold = ({ children, style, ...otherProps }: any) => {
    return <>
        <Text allowFontScaling={false} {...otherProps} style={{ ...TextCommonStyle.textPoppinsSemiBold, ...style }}>
            {children}
        </Text>
    </>

}
export default TextPoppinsSemiBold;