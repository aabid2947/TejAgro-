import React from 'react';
import { Text } from 'react-native';
import { TextCommonStyle } from './TextCommonStyle'

const TextPoppinsExtraBold = ({ children, style, ...otherProps }: any) => {
    return <>
        <Text allowFontScaling={false} {...otherProps} style={{ ...TextCommonStyle.customFontText, ...style }}>
            {children}
        </Text>
    </>

}
export default TextPoppinsExtraBold;