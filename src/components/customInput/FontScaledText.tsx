import React from 'react';
import { TextInput } from 'react-native';
import { BLACK } from '../../shared/common-styles/colors';

const FontScaledText = ({ children, style, viewStyle, showCS, csText, lotSize, ...otherProps }: any) => {
    return (
        <>
            <TextInput style={{
                fontSize: 14,
                lineHeight: 14,
                padding: 10,
                color: BLACK,
                flex: 1,
                ...style
            }}
                allowFontScaling={false} {...otherProps}
            >
                {children}
            </TextInput>
        </>
    )
}
export default FontScaledText;
