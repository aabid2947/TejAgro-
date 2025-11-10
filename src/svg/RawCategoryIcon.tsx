import React from 'react';
import { SvgXml } from 'react-native-svg';

const RawCategoryIcon = ({ width = 20, height = 20 }) => {
    const svg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7" fill="#CD7F32" stroke="#8B4513" stroke-width="1"/>
    <circle cx="10" cy="10" r="5" fill="#B87333" opacity="0.6"/>
    <path d="M7 8L10 10L13 8" stroke="#8B4513" stroke-width="1" stroke-linecap="round"/>
    <path d="M7 12L13 12" stroke="#8B4513" stroke-width="1" stroke-linecap="round"/>
    </svg>`;
    return <SvgXml width={width} height={height} xml={svg} />;
};

export default RawCategoryIcon;
