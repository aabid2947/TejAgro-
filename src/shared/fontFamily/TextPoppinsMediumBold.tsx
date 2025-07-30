import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { TextCommonStyle } from './TextCommonStyle';

interface TextPoppinsMediumBoldProps extends TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

const TextPoppinsMediumBold: React.FC<TextPoppinsMediumBoldProps> = ({
  children,
  style,
  ...otherProps
}) => {
  return (
    <Text
      allowFontScaling={false}
      {...otherProps}
      style={[TextCommonStyle.textPoppinsMediumBold, style]}
    >
      {children}
    </Text>
  );
};

export default TextPoppinsMediumBold;