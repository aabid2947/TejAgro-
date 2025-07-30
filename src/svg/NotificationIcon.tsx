import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';
import { BLACK } from '../shared/common-styles/colors';


const NotificationIcon = ({ width = widthPercentageToDP(60), height = heightPercentageToDP(60), color = BLACK }) => {
    const svg = `<svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#a)">
    <path d="m23.608 19.513-2.8-10.1A9.443 9.443 0 0 0 2.486 9.9L.321 19.64a2.5 2.5 0 0 0 2.441 3.042h4.143a5.285 5.285 0 0 0 10.154 0H21.2a2.5 2.5 0 0 0 2.408-3.169m-20.223.169 2.03-9.137a6.443 6.443 0 0 1 12.5-.326l2.628 9.463z" fill=${color}/>
  </g>
  <circle cx="18.5" cy="6" r="5.5" fill="#C55545"/>
  <defs>
    <clipPath id="a">
      <path fill="#fff" d="M0 2.5h24v24H0z"/>
    </clipPath>
  </defs>
</svg>

`
    return <SvgXml width={width} height={height} xml={svg} color={color} />;
};

export default NotificationIcon;