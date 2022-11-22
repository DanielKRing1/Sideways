import React, {FC} from 'react';
import {View, useWindowDimensions} from 'react-native';

import MyText from 'ssComponents/ReactNative/MyText';
import CircleImage from 'ssComponents/Image/CircleImage';
import AbsoluteView from 'ssComponents/View/AbsoluteView';
const NoInputsImage = require('ssImages/NoInputs.jpg');

type NoInputsDisplayProps = {};
const NoInputsDisplay: FC<NoInputsDisplayProps> = props => {
  const {width} = useWindowDimensions();

  const diameter: number = width / 0.75;

  return (
    <View>
      <CircleImage
        source={NoInputsImage}
        diameter={diameter}
        style={{
          alignSelf: 'center',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          zIndex: 0,
        }}
      />
      <AbsoluteView>
        <MyText>+ No Inputs</MyText>
      </AbsoluteView>
    </View>
  );
};

export default NoInputsDisplay;
