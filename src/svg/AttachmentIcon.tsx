import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface AttachmentIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const AttachmentIcon: React.FC<AttachmentIconProps> = ({ 
  width = 24, 
  height = 24, 
  color = '#666' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.48-8.48"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default AttachmentIcon;