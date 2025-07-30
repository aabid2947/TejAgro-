import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';
import { BLACK } from '../shared/common-styles/colors';


const BackStarSvg = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60), color = BLACK }) => {
    const svg = `<svg width="209" height="131" viewBox="0 0 209 131" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g opacity=".5" fill="#FBAB32">
    <circle cx="151.5" cy="7.5" r="3.5"/>
    <circle cx="32.5" cy="95.5" r="3.5"/>
    <circle cx="167" cy="110" r="2"/>
    <circle cx="35" cy="43" r="2"/>
    <circle cx="207" cy="57" r="2"/>
    <circle cx="179" cy="81" r="2"/>
    <circle cx="2" cy="94" r="2"/>
    <path d="M173.816 41v8.016h-1.632V41zM169 44.184h8v1.632h-8zM33.816 122v8.016h-1.632V122zM29 125.184h8v1.632h-8zM77.816 0v8.016h-1.632V0zM73 3.184h8v1.632h-8z"/>
  </g>
</svg>

`
    return <SvgXml width={width} height={height} xml={svg} color={color} />;
};

export default BackStarSvg;