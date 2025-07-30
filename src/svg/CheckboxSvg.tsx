import * as React from "react";
import Svg, { Path } from "react-native-svg";
const CheckBoxSvg = (props:any) => (
  <Svg
    fill="#FF8C00"
    width={24}
    height={24}
    viewBox="0 0 14 14"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path d="m4.267 5.733-.934.934 3 3L13 3l-.933-.933L6.333 7.8zm7.4 5.934H2.333V2.333H9V1H2.333C1.6 1 1 1.6 1 2.333v9.334C1 12.4 1.6 13 2.333 13h9.334C12.4 13 13 12.4 13 11.667V6.333h-1.333z" />
  </Svg>
);
export default CheckBoxSvg;
