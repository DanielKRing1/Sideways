import React, {FC} from 'react';
import {View} from 'react-native';

import MyText from 'ssComponents/ReactNative/MyText';
import CircleImage from 'ssComponents/Image/CircleImage';
const NoInputsImage = require('ssImages/NoInputs');

type NoInputsDisplayProps = {};
const NoInputsDisplay: FC<NoInputsDisplayProps> = props => {
  return (
    <View>
      <CircleImage
        source={NoInputsImage}
        style={{
          flex: 1,
          resizeMode: 'cover',
          alignItems: 'center',
        }}
      />
      <MyText>+ No Inputs</MyText>
    </View>
  );
};

export default NoInputsDisplay;
