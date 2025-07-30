import React from 'react';
import { SvgXml } from 'react-native-svg';

const HomeIconSvg = ({ width, height, color }: any) => {
    const svg = `
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#a)">
    <path d="m23.475 8.694-7.086-7.086a5.507 5.507 0 0 0-7.778 0L1.525 8.694A3.48 3.48 0 0 0 .5 11.169v10.378A2.457 2.457 0 0 0 2.955 24h19.09a2.457 2.457 0 0 0 2.455-2.453V11.169a3.48 3.48 0 0 0-1.025-2.475M21.5 21h-5v-3.182A3.82 3.82 0 0 0 12.682 14h-.364A3.82 3.82 0 0 0 8.5 17.818V21h-5v-9.831c0-.133.053-.26.146-.354l7.086-7.086a2.5 2.5 0 0 1 3.536 0l7.086 7.086a.5.5 0 0 1 .146.354z" fill=${color}/>
  </g>
  <defs>
    <clipPath id="a">
      <path fill="#fff" d="M.5 0h24v24H.5z"/>
    </clipPath>
  </defs>
</svg>

    `
    return <SvgXml width={width} height={height} color={color} xml={svg} />;
};

export default HomeIconSvg;