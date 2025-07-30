import React from 'react';
import { Text } from 'react-native';
import { TextCommonStyle } from './TextCommonStyle'

const TextPoppinsBold = ({ children, style, ...otherProps }: any) => {
    return <>
        <Text allowFontScaling={false} {...otherProps} style={{ ...TextCommonStyle.textPoppinsBold, ...style }}>
            {children}
        </Text>
    </>

}
export default TextPoppinsBold;