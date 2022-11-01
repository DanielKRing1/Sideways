import React, {FC} from 'react';
import {
  Image,
  ImageSourcePropType,
  useWindowDimensions,
  ImageStyle,
} from 'react-native';

type CircleImageProps = {
  source: ImageSourcePropType;
  style?: ImageStyle;
};
const CircleImage: FC<CircleImageProps> = props => {
  const {source, style} = props;

  const {width: windowWidth} = useWindowDimensions();
  const width: number = (windowWidth * 2) / 3;

  return (
    <Image
      source={source}
      style={{
        borderRadius: width / 2,
        ...style,
      }}
    />
  );
};

export default CircleImage;
