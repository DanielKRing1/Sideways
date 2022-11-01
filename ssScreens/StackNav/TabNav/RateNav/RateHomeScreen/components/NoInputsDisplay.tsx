import React, {FC} from 'react';
import {View} from 'react-native';

import MyButton from 'ssComponents/ReactNative/MyButton';
import MyText from 'ssComponents/ReactNative/MyText';
import CircleImage from 'ssComponents/Image/CircleImage';
const NoInputsImage = require('ssImages/NoInputs');

type NoInputsDisplayProps = {};
const NoInputsDisplay: FC<NoInputsDisplayProps> = props => {
  return (
    <View>
      <MyButton>
        <CircleImage
          source={NoInputsImage}
          style={{
            flex: 1,
            resizeMode: 'cover',
            alignItems: 'center',
          }}
        />
        <MyText>+ No Inputs</MyText>
      </MyButton>
    </View>
  );
};

export default NoInputsDisplay;
