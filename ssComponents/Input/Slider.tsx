import React, {FC} from 'react';
import {} from 'victory-native';
import Slider from '@react-native-community/slider';
import {Svg, Defs, LinearGradient, Stop} from 'react-native-svg';

export type MySliderProps = {
  value: number;
  setValue: (newValue: number) => void;
  min: number;
  max: number;
  step?: number;
  leftColor: string;
  rightColor: string;
};
const MySlider: FC<MySliderProps> = props => {
  const {value, setValue, min, max, step = 1, leftColor, rightColor} = props;

  return (
    <Slider
      onValueChange={setValue}
      value={value}
      minimumValue={min}
      maximumValue={max}
      step={step}
      minimumTrackTintColor={leftColor}
      maximumTrackTintColor={rightColor}
    />
  );
};

export default MySlider;
