import React from 'react';
import { SvgXml } from 'react-native-svg';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';


const SearchIcon = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60), color = "#000000" }) => {
    const svg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#a)">
    <path d="m23.561 21.445-4.645-4.647c3.476-4.645 2.528-11.228-2.117-14.703C12.154-1.381 5.571-.433 2.096 4.21A10.504 10.504 0 0 0 16.8 18.915l4.646 4.647a1.495 1.495 0 1 0 2.115-2.115zm-13.016-3.427a7.474 7.474 0 1 1 7.474-7.475 7.48 7.48 0 0 1-7.474 7.475" fill=${color}/>
    </g><defs><clipPath id="a">
    <path fill="#fff" d="M0 0h24v24H0z"/>
    </clipPath></defs></svg>
    `;
    return <SvgXml width={width} height={height} xml={svg} color={color} />;
};

export default SearchIcon;