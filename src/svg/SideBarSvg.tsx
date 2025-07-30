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
const SideBarSvg : React.FC<BelowIconProps> = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60), color = BLACK, style }) => {
    const svg = `<svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="41" rx="20" fill="#6D7366" fill-opacity=".19"/>
  <path d="M30.5 19h-21a1.5 1.5 0 0 0 0 3h21a1.5 1.5 0 0 0 0-3m-21-4h21a1.5 1.5 0 0 0 0-3h-21a1.5 1.5 0 0 0 0 3m21 11h-21a1.5 1.5 0 0 0 0 3h21a1.5 1.5 0 0 0 0-3" fill=${color}/>
</svg>

    `;
    return <SvgXml width={width} height={height} xml={svg} color={color} style={style} />;
};

export default SideBarSvg;