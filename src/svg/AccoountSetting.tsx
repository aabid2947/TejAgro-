import React from 'react';
import { SvgXml } from 'react-native-svg';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { MDBLUE } from '../shared/common-styles/colors';

const AccoountSetting = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60), color = MDBLUE }) => {
    const svg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)"><path d="m23.28 14.63-2.205-1.725a9 9 0 0 0 .052-.906c0-.329-.023-.64-.052-.906l2.208-1.726a1.08 1.08 0 0 0 .26-1.378L21.25 4.02a1.063 1.063 0 0 0-1.327-.477L17.32 4.588a9 9 0 0 0-1.563-.907L15.36.92A1.06 1.06 0 0 0 14.3 0H9.7a1.06 1.06 0 0 0-1.058.912l-.397 2.771a9 9 0 0 0-1.56.907l-2.61-1.048c-.49-.189-1.074.023-1.317.469L.462 7.985a1.075 1.075 0 0 0 .26 1.385l2.206 1.725c-.035.337-.052.63-.052.905s.017.568.052.906L.72 14.632c-.41.325-.521.9-.26 1.378l2.294 3.969c.245.447.777.679 1.327.477l2.603-1.045a9 9 0 0 0 1.562.907l.396 2.76c.065.526.52.922 1.06.922h4.6a1.06 1.06 0 0 0 1.059-.912l.397-2.77a9 9 0 0 0 1.56-.908l2.61 1.048q.19.074.392.074c.388 0 .745-.212.925-.542L23.549 16a1.08 1.08 0 0 0-.268-1.37M12 16c-2.205 0-4-1.794-4-4s1.795-4 4-4c2.207 0 4 1.794 4 4s-1.793 4-4 4" fill=${color}/></g><defs><clipPath id="a"><path fill=${color} d="M0 0h24v24H0z"/></clipPath></defs></svg>
    `;
    return <SvgXml width={width} height={height} xml={svg} color={color} />;
};
export default AccoountSetting;