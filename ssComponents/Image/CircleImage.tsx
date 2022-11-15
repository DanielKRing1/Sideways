import React, {FC} from 'react';
import {
  Image,
  ImageSourcePropType,
  useWindowDimensions,
  ImageStyle,
} from 'react-native';

type CircleImageProps = {
  source: ImageSourcePropType;
  diameter: number;
  style?: ImageStyle;
};
const CircleImage: FC<CircleImageProps> = props => {
  const {source, diameter, style} = props;

  return (
    <Image
      source={source}
      style={{
        height: diameter,
        width: diameter,
        borderRadius: diameter / 2,
        ...style,
      }}
    />
  );
};

export default CircleImage;
