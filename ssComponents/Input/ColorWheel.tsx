import React, {FC} from 'react';
import {useWindowDimensions} from 'react-native';
import ColorPicker from '@asianpersonn/rn-color-wheel';

type MyColorPickerProps = {
  handleColorChange: (color: string) => void;
  handleColorSelected: (color: string) => void;
};
const MyColorPicker: FC<MyColorPickerProps> = props => {
  const {handleColorChange, handleColorSelected} = props;

  const {width} = useWindowDimensions();

  return (
    <ColorPicker
      swatchesOnly={false}
      onColorChange={handleColorChange}
      onColorChangeComplete={handleColorSelected}
      wheelRadius={(width * 7) / 8}
      thumbSize={20}
      sliderSize={20}
      noSnap={true}
      row={false}
      swatchesLast={true}
      swatches={true}
      discrete={false}
    />
  );
};

export default MyColorPicker;
