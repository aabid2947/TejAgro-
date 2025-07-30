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
const BelowIcon : React.FC<BelowIconProps> = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60), color = BLACK, style }) => {
    const svg = `<svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.6839 1L6 6L1 1" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `;
    return <SvgXml width={width} height={height} xml={svg} color={color} style={style} />;
};

export default BelowIcon;