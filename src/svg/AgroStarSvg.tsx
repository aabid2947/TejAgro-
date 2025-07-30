import React from 'react';
import { SvgXml } from 'react-native-svg';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { MDBLUE } from '../shared/common-styles/colors';

const AgroStarSvg = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60), color = MDBLUE }) => {
    const svg = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="m20.967 5.995-4.955-4.962A2.14 2.14 0 0 0 14.51.412H7.492c-.558 0-1.101.226-1.496.621L1.033 5.995a2.13 2.13 0 0 0-.62 1.497v7.016c0 .565.225 1.101.62 1.497l5.584 5.583h7.892c.564 0 1.1-.219 1.503-.62l4.955-4.963c.403-.396.622-.932.622-1.497V7.492c0-.558-.22-1.101-.622-1.497m-7.143 6.494.67 3.883L11 14.537l-3.487 1.835.664-3.883-2.824-2.753 3.904-.571L11 5.628l1.75 3.537 3.897.571z" fill=${color}/>
</svg>
`;
    return <SvgXml width={width} height={height} xml={svg} color={color} />;
};
export default AgroStarSvg;