import React from 'react';
import { SvgXml } from 'react-native-svg';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { MDBLUE } from '../shared/common-styles/colors';

const AppInfoSvg = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60), color = MDBLUE }) => {
    const svg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15.75 1.5h-7.5A3.754 3.754 0 0 0 4.5 5.25v13.5a3.754 3.754 0 0 0 3.75 3.75h7.5a3.754 3.754 0 0 0 3.75-3.75V5.25a3.754 3.754 0 0 0-3.75-3.75m-1.5 18h-4.5a.75.75 0 1 1 0-1.5h4.5a.75.75 0 1 1 0 1.5" fill="#309A4E"/>
</svg>
`;
    return <SvgXml width={width} height={height} xml={svg} color={color} />;
};
export default AppInfoSvg;