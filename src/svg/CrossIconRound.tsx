import React from 'react';

import { SvgXml } from "react-native-svg";

const CrossIconRound = ({ width, height }: any) => {
    const svg = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_420_665)">
<path d="M8.5 0C3.83131 0 0 3.83131 0 8.5C0 13.1687 3.83131 17 8.5 17C13.1687 17 17 13.1687 17 8.5C17 3.83131 13.1687 0 8.5 0ZM12.7261 11.3176L11.3176 12.7261L8.5 9.90854L5.68245 12.7261L4.27391 11.3176L7.09146 8.5L4.27391 5.68245L5.68245 4.27391L8.5 7.09146L11.3176 4.27391L12.7261 5.68245L9.90854 8.5L12.7261 11.3176Z" fill="#131A0C" fill-opacity="0.76"/>
</g>
<defs>
<clipPath id="clip0_420_665">
<rect width="17" height="17" fill="white"/>
</clipPath>
</defs>
</svg>


`
    return (
        <SvgXml width={width} height={height} xml={svg} />
    )
}

export default CrossIconRound;