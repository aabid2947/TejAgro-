import React from 'react';
import { TextCommonStyle } from './TextCommonStyle';
import TextPoppinsSemiBold from './TextPoppinsSemiBold';

const CustomFontText = ({ children, style, ...otherProps }: any) => {
    return <>
        <TextPoppinsSemiBold allowFontScaling={false} {...otherProps} style={{ ...TextCommonStyle.customFontText, ...style }}>
            {children}
        </TextPoppinsSemiBold>
    </>

}
export default CustomFontText;

