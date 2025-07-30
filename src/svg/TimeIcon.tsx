import React from 'react';
import { SvgXml } from "react-native-svg";


const TimeIcon = ({ width, height }: any) => {
    const svg = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 0C7.7615 0 10 2.239 10 5C10 7.761 7.7615 10 5 10C2.2385 10 0 7.761 0 5C0 2.239 2.2385 0 5 0ZM5 0.8335C2.7025 0.8335 0.8335 2.7025 0.8335 5C0.8335 7.2975 2.7025 9.1665 5 9.1665C7.2975 9.1665 9.1665 7.2975 9.1665 5C9.1665 2.7025 7.2975 0.8335 5 0.8335ZM4.625 2C4.81475 2 4.97175 2.14117 4.99655 2.32414L5 2.375V5H6.625C6.832 5 7 5.168 7 5.375C7 5.56475 6.85885 5.72175 6.67585 5.74655L6.625 5.75H4.625C4.43525 5.75 4.27825 5.60885 4.25345 5.42585L4.25 5.375V2.375C4.25 2.168 4.418 2 4.625 2Z" fill="#FF8C00"/>
    </svg>    
`
    return (
        <SvgXml width={width} height={height} xml={svg} />
    )
}
export default TimeIcon; 