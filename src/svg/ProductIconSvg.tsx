import React from 'react';
import { SvgXml } from 'react-native-svg';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';


const ProductIconSvg = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60), color = "#000000" }) => {
    const svg = `<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#a)"><path d="M23.5.988a3.39 3.39 0 0 0-2.725-.972C18.077.277 8.993 1.406 5.42 4.979a10 10 0 0 0-.973 12.953L.939 21.439a1.5 1.5 0 0 0 2.122 2.122l3.507-3.508a10 10 0 0 0 12.953-.973c3.623-3.623 4.716-12.68 4.964-15.371A3.39 3.39 0 0 0 23.5.988m-6.1 15.97a6.99 6.99 0 0 1-8.68.942l8.341-8.34a1.5 1.5 0 1 0-2.122-2.122L6.6 15.78a6.99 6.99 0 0 1 .942-8.68c2.28-2.28 8.709-3.632 13.523-4.1a.4.4 0 0 1 .319.113.39.39 0 0 1 .116.32c-.445 4.792-1.784 11.209-4.1 13.525" fill=${color}/>
    </g><defs><clipPath id="a">
    <path fill="#fff" d="M.5 0h24v24H.5z"/>
    </clipPath></defs></svg> 
    `;
    return <SvgXml width={width} height={height} xml={svg} color={color} />;
};

export default ProductIconSvg;