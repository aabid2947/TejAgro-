/* eslint-disable prettier/prettier */
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LikeIconProps {
  width?: number;
  height?: number;
  color?: string;
  filled?: boolean;
}

const LikeIcon: React.FC<LikeIconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  filled = false,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 10V20L16 20C16.5 20 17 19.5 17 19V11L13.5 7C13.1 6.4 12.6 6 12 6C10.9 6 10 6.9 10 8V10H7ZM7 10L4 10C3.4 10 3 10.4 3 11V18C3 18.6 3.4 19 4 19H7V10Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default LikeIcon;