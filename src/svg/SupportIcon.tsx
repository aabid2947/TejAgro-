import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SupportIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const SupportIcon: React.FC<SupportIconProps> = ({
  width = 24,
  height = 24,
  color = '#FFFFFF'
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4.5C14.8 4.4 14.6 4.4 14.4 4.5L9 7V9C9 9.6 9.4 10 10 10H11V16L13 18L15 16V10H16C16.6 10 17 9.6 17 9Z"
        fill={color}
      />
      <Path
        d="M4 8V21C4 21.6 4.4 22 5 22H7C7.6 22 8 21.6 8 21V8H4Z"
        fill={color}
      />
      <Path
        d="M16 8V21C16 21.6 16.4 22 17 22H19C19.6 22 20 21.6 20 21V8H16Z"
        fill={color}
      />
    </Svg>
  );
};

export default SupportIcon;