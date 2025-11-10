import React from 'react';
import { SvgXml } from 'react-native-svg';

const GoldCategoryIcon = ({ width = 20, height = 20 }) => {
    const svg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2L12.5 7.5L18.5 8.5L14.25 12.5L15.25 18.5L10 15.5L4.75 18.5L5.75 12.5L1.5 8.5L7.5 7.5L10 2Z" fill="#FFD700" stroke="#FFA500" stroke-width="1" stroke-linejoin="round"/>
    </svg>`;
    return <SvgXml width={width} height={height} xml={svg} />;
};

export default GoldCategoryIcon;
