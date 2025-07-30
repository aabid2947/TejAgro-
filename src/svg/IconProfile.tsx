import React from 'react';
import { SvgXml } from 'react-native-svg';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { BLACK } from '../shared/common-styles/colors';


const IconProfile  = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60),  color = BLACK }) => {
    const svg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_320_988)">
<path d="M9.99967 9.99967C11.8413 9.99967 13.333 8.50801 13.333 6.66634C13.333 4.82467 11.8413 3.33301 9.99967 3.33301C8.15801 3.33301 6.66634 4.82467 6.66634 6.66634C6.66634 8.50801 8.15801 9.99967 9.99967 9.99967ZM9.99967 11.6663C7.77467 11.6663 3.33301 12.783 3.33301 14.9997V15.833C3.33301 16.2913 3.70801 16.6663 4.16634 16.6663H15.833C16.2913 16.6663 16.6663 16.2913 16.6663 15.833V14.9997C16.6663 12.783 12.2247 11.6663 9.99967 11.6663Z" fill=${color}/>
</g>
<defs>
<clipPath id="clip0_320_988">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>
`;
    

    return <SvgXml width={width} height={height} xml={svg} color={color} />;
};

export default IconProfile;