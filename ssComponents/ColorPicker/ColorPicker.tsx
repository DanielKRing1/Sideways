/**
 * Color Wheel component, forked from https://www.npmjs.com/package/react-native-wheel-color-picker
 * Adds a 'wheelRadius' prop
 * My demo at https://snack.expo.dev/@asianpersonn/colorpicker?platform=web
 */

import React, { FC } from 'react';
import { View, useWindowDimensions } from 'react-native';
import ColorPicker from '@asianpersonn/rn-color-wheel';

export type MyColorPickerProps = {
  color: string;
  onColorChange: (color: string) => void;
  onColorSelected: (color: string) => void;
};
const MyColorPicker: FC<MyColorPickerProps> = (props) => {
  const { color, onColorChange, onColorSelected } = props;

  const { width, height } = useWindowDimensions();

  return (
    <ColorPicker
      color={color}
      swatchesOnly={false}
      palette={['#00ff1d', '#02faff', '#0107ff', '#f900ff', '#ff0109', '#ffa202', '#fdff00']}
      onColorChange={onColorChange}
      onColorChangeComplete={onColorSelected}
      wheelRadius={width*7/8}
      thumbSize={20}
      sliderSize={20}
      noSnap={true}
      row={false}
      swatchesLast={true}
      swatches={true}
      discrete={false}
    />
  )
}

export default MyColorPicker;
