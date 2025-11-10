import React from 'react';
import { SvgXml } from 'react-native-svg';

const DiamondCategoryIcon = ({ width = 20, height = 20 }) => {
    const svg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2L14 6L10 18L6 6L10 2Z" fill="#B9F2FF" stroke="#4FC3F7" stroke-width="1" stroke-linejoin="round"/>
    <path d="M6 6H14L10 12L6 6Z" fill="#E0F7FA" opacity="0.7"/>
    <path d="M10 2L12 4L10 6L8 4L10 2Z" fill="#FFFFFF" opacity="0.5"/>
    </svg>`;
    return <SvgXml width={width} height={height} xml={svg} />;
};

export default DiamondCategoryIcon;
