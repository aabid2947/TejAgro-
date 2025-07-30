import React from 'react';
import { SvgXml } from 'react-native-svg';
import { BLACK } from '../shared/common-styles/colors';

const ReferralSvg = ({ width, height, color = BLACK }: any) => {
  const svg = `
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24.578 14h-4.5m2.25 2.333v-4.666" stroke=${color} stroke-width="2.3" stroke-linecap="round"/>
  <path d="M4.328 22.297c0-2.816 1.91-5.214 4.505-5.657l.233-.04a18.6 18.6 0 0 1 6.274 0l.234.04c2.595.443 4.504 2.841 4.504 5.657 0 1.217-.92 2.203-2.056 2.203H6.384c-1.136 0-2.057-.986-2.057-2.203ZM16.797 8.094a4.594 4.594 0 1 1-9.188 0 4.594 4.594 0 0 1 9.188 0Z" stroke=${color} stroke-width="2.3"/>
</svg>


`
  return <SvgXml width={width} height={height} color={color} xml={svg} />;
};

export default ReferralSvg;