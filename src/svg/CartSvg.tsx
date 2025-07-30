import React from 'react';
import { SvgXml } from 'react-native-svg';
import { BLACK } from '../shared/common-styles/colors';

const CartSvg = ({ width, height, color = BLACK }: any) => {
  const svg = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#a)" fill=${color}>
    <path d="M4.667 16a1.333 1.333 0 1 0 0-2.667 1.333 1.333 0 0 0 0 2.667m6.666 0a1.333 1.333 0 1 0 0-2.667 1.333 1.333 0 0 0 0 2.667m3.99-11.988a2.45 2.45 0 0 0-1.747-.679H3.769L3.594 1.96A2.22 2.22 0 0 0 1.391 0H1a1 1 0 0 0 0 2h.391a.22.22 0 0 1 .218.2l1 7.84A2.22 2.22 0 0 0 4.81 12h6.748a3.67 3.67 0 0 0 3.534-2.695l.83-3.02a2.33 2.33 0 0 0-.6-2.273m-2.156 4.763A1.67 1.67 0 0 1 11.559 10H4.811a.22.22 0 0 1-.216-.2l-.57-4.467h9.651a.333.333 0 0 1 .324.422z"/>
  </g>
  <defs>
    <clipPath id="a">
      <path fill=${color} d="M0 0h16v16H0z"/>
    </clipPath>
  </defs>
</svg>

`
  return <SvgXml width={width} height={height} color={color} xml={svg} />;
};

export default CartSvg;