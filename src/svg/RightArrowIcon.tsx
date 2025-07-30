import React from 'react';
import { SvgXml } from 'react-native-svg';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { BLACK } from '../shared/common-styles/colors';
import { StyleProp, ViewStyle } from 'react-native';

interface BelowIconProps {
    width?: number;
    height?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
}
const RightArrowIcon: React.FC<BelowIconProps> = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60), color = BLACK, style }) => {
    const svg = `<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x=".097" width="44.903" height="44.903" rx="22.451" fill="#272D20"/>
  <path d="m15.4 29.246 13.943-13.943m0 0v11.314m0-11.314H18.737" stroke="#fff"/>
</svg>
    `;
    return <SvgXml width={width} height={height} xml={svg} color={color} style={style} />;
};

export default RightArrowIcon;