import React from 'react';
import { SvgXml } from 'react-native-svg';
import { BLACK } from '../shared/common-styles/colors';

const MyBagSvg = ({ width, height, color = BLACK }: any) => {
  const svg = `
    <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 .75a4.5 4.5 0 0 0-4.5 4.5V6h-.622a2.45 2.45 0 0 0-2.453 2.34L.833 20.677a2.46 2.46 0 0 0 2.452 2.573h11.43a2.46 2.46 0 0 0 2.453-2.573L16.575 8.34A2.45 2.45 0 0 0 14.123 6H13.5v-.75A4.5 4.5 0 0 0 9 .75m-3 4.5a3 3 0 1 1 6 0V6H6zM4.77 9.143a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0m6.96 0a.75.75 0 1 1 1.499 0 .75.75 0 0 1-1.499 0" fill=${color}/>
</svg>


`
  return <SvgXml width={width} height={height} color={color} xml={svg} />;
};

export default MyBagSvg;