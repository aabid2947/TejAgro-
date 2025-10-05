/* eslint-disable prettier/prettier */
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BackIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const BackIcon: React.FC<BackIconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19L5 12L12 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default BackIcon;