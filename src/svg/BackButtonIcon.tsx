import React from 'react';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';


const BackButtonIcon = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60) }) => {
    const svg = `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#a)">
    <path d="M12.694 1.566c0 .282-.112.552-.312.75L6.948 7.752a1.77 1.77 0 0 0 0 2.505l5.427 5.427a1.063 1.063 0 0 1-1.502 1.503l-5.427-5.424a3.9 3.9 0 0 1 0-5.51L10.88.814a1.062 1.062 0 0 1 1.814.752" fill="#131A0C"/>
    </g><defs><clipPath id="a"><path fill="#fff" d="M0 .5h17v17H0z"/>
    </clipPath></defs></svg>`;
    return <SvgXml width={width} height={height} xml={svg} />;
};

export default BackButtonIcon;