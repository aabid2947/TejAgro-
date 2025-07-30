import React from 'react';
import { SvgXml } from 'react-native-svg';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';


const RightTickIcon = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60), color = "#000000" }) => {
    const svg = `<svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 3L3 5L7 1" stroke=${color} stroke-linecap="round" stroke-linejoin="round"/>
    </svg>    
    `;
    return <SvgXml width={width} height={height} xml={svg} color={color} />;
};

export default RightTickIcon;