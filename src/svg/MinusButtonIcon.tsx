import React from 'react';
import { SvgXml, Text } from "react-native-svg";

const MinusButtonIcon = ({ width, height }: any) => {
    const svg = `<svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect y="0.583984" width="32" height="32" rx="8" fill="#FBAB32"/>
    <path d="M11.9289 18.352V15.952H19.0809V18.352H11.9289Z" fill="#171B1D"/>
    </svg>  
    `
    return (
        <SvgXml width={width} height={height} xml={svg} />
    )
}
export default MinusButtonIcon; 