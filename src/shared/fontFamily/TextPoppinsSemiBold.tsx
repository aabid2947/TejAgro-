import React from 'react';
import { Text } from 'react-native';
import { TextCommonStyle } from './TextCommonStyle'

const TextPoppinsSemiBold = ({ children, style, ...otherProps }: any) => {
    return <>
        <Text allowFontScaling={false} {...otherProps} style={{ ...TextCommonStyle.textPoppinsSemiBold, ...style }}
         ellipsizeMode="clip" 
           adjustsFontSizeToFit={true}    // shrink font if needed
  minimumFontScale={0.85}        // don’t shrink too much
          textBreakStrategy="simple" numberOfLines={1 }>
            {children}
        </Text>
    </>

}
export default TextPoppinsSemiBold;