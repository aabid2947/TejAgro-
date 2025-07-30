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
const FilterIconSvg: React.FC<BelowIconProps> = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60), color = BLACK, style }) => {
    const svg = `<svg width="54" height="48" viewBox="0 0 54 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 4a4 4 0 0 1 4-4h46a4 4 0 0 1 4 4v40a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4z" fill=${color}/>
  <path d="M34 19.042c0 .484-.39.875-.875.875h-12.25a.874.874 0 1 1 0-1.75h12.25c.484 0 .875.39.875.875m-5.542 9.625h-2.916a.874.874 0 1 0 0 1.75h2.916a.874.874 0 1 0 0-1.75m2.334-5.25h-7.584a.874.874 0 1 0 0 1.75h7.584a.874.874 0 1 0 0-1.75" fill="#272D20"/>
</svg>


    `;
    return <SvgXml width={width} height={height} xml={svg} color={color} style={style} />;
};

export default FilterIconSvg;