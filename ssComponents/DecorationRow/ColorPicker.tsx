/**
 * Wraps my ColorPicker in a View, styled for display in a modal
 */

import React, { FC } from 'react';
import { View, useWindowDimensions } from 'react-native';

import MyColorPicker, { MyColorPickerProps } from 'ssComponents/ColorPicker/ColorPicker';

const DecorationRowColorPicker: FC<MyColorPickerProps> = (props) => {
  const { color, handleColorChange, handleColorSelected } = props;

  const { width, height } = useWindowDimensions();

  return (
    <View
      style={{
        width: width,
        height: height*2/3,
        paddingRight: width*1/20,
        paddingLeft: width*1/20,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MyColorPicker {...props} />
    </View>
  )
}

export default DecorationRowColorPicker;
