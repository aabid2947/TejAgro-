import * as React from "react";
import Svg, { Path } from "react-native-svg";
const UnCheckbox = (props: any) => (
    <Svg
        width={24}
        height={24}
        viewBox="0 0 14 14"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path d="M11.667 2.333v9.334H2.333V2.333zm0-1.333H2.333C1.6 1 1 1.6 1 2.333v9.334C1 12.4 1.6 13 2.333 13h9.334C12.4 13 13 12.4 13 11.667V2.333C13 1.6 12.4 1 11.667 1" />
    </Svg>
);
export default UnCheckbox;
