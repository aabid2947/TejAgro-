/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, TextProps } from 'react-native';

interface TextPoppinsRegularProps extends TextProps {
  children: React.ReactNode;
}

const TextPoppinsRegular: React.FC<TextPoppinsRegularProps> = ({
  children,
  style,
  ...otherProps
}) => {
  return (
    <Text
      allowFontScaling={false}
      {...otherProps}
      style={[
        {
          fontFamily: 'Poppins-Regular',
          color: '#000000',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default TextPoppinsRegular;