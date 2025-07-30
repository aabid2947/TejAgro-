import React from 'react';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';


const RightTickBackground = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60) }) => {
    const svg = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.502.816a5.688 5.688 0 1 1 0 11.376 5.688 5.688 0 0 1 0-11.376M5.322 8.35 3.928 6.957a.61.61 0 0 1 0-.862.61.61 0 0 1 .862 0l.981.983 2.442-2.442a.61.61 0 0 1 .862.861L6.202 8.371a.61.61 0 0 1-.88-.02" fill="#00BA00"/>
</svg>
`;
    return <SvgXml width={width} height={height} xml={svg} />;
};

export default RightTickBackground;