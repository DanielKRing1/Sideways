import React, {FC} from 'react';

import HeatMap, {HeatMapProps} from './HeatMap';
import MySlider, {MySliderProps} from '../../Input/Slider';

type HeatMapWSliderProps = HeatMapProps & MySliderProps;
const HeatMapWSlider: FC<HeatMapWSliderProps> = props => {
  const {
    CellComponent,
    data,
    cols,
    value,
    setValue,
    min,
    max,
    step,
    leftColor,
    rightColor,
  } = props;

  return (
    <>
      <HeatMap cols={cols} data={data} CellComponent={CellComponent} />

      <MySlider
        value={value}
        setValue={setValue}
        min={min}
        max={max}
        step={step}
        leftColor={leftColor}
        rightColor={rightColor}
      />
    </>
  );
};

export default HeatMapWSlider;
