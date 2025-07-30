import React from 'react';
import { SvgXml } from 'react-native-svg';
import { BLACK } from '../shared/common-styles/colors';

const MyAddressSvg = ({ width, height, color = BLACK }: any) => {
  const svg = `
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 .5C4.995.5.938 4.61.938 9.68c0 4.193 3.424 8.186 6.062 10.642a4.41 4.41 0 0 0 6 0c2.639-2.456 6.063-6.45 6.063-10.641C19.063 4.61 15.005.5 10 .5m3.696 10.438a1.89 1.89 0 0 1-1.89 1.89h-1.13v-2.203a.675.675 0 0 0-1.35 0v2.204h-1.13a1.89 1.89 0 0 1-1.891-1.89V8.715c0-.626.309-1.211.826-1.563l1.804-1.23a1.89 1.89 0 0 1 2.131 0l1.804 1.23c.517.353.826.938.826 1.563z" fill=${color}/>
</svg>
`
  return <SvgXml width={width} height={height} color={color} xml={svg} />;
};

export default MyAddressSvg;