import React from 'react';
import { SvgXml } from 'react-native-svg';
import { BLACK } from '../shared/common-styles/colors';

const RefreshSvg = ({ width, height, color = BLACK }: any) => {
  const svg = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#a)">
    <path d="M12.688 6.344a.656.656 0 0 0-.656.657 5.034 5.034 0 0 1-7.917 4.12A5.036 5.036 0 0 1 2.88 4.114a5.036 5.036 0 0 1 7.936-.395H8.97a.656.656 0 1 0 0 1.312h3.063a.656.656 0 0 0 .656-.656V1.313a.656.656 0 1 0-1.312 0v1.092a6.343 6.343 0 1 0-8.013 9.79 6.3 6.3 0 0 0 4.74 1.052 6.345 6.345 0 0 0 5.241-6.248.657.657 0 0 0-.656-.655" fill="#000"/>
  </g>
  <defs>
    <clipPath id="a">
      <path fill="#fff" d="M0 0h14v14H0z"/>
    </clipPath>
  </defs>
</svg>


`
  return <SvgXml width={width} height={height} color={color} xml={svg} />;
};

export default RefreshSvg;