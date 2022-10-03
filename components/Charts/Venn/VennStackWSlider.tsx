import React, { FC } from 'react';

import VennStack, { VennStackProps } from './VennStack';
import MySlider, { MySliderProps } from '../../Input/Slider';

type VennStackWSliderProps = VennStackProps & MySliderProps;
const VennStackWSlider: FC<VennStackWSliderProps> = (props) => {
  const {
    colorScale, data, x, xValues, yLabels, tickFormat, domainPadding,
    value, setValue, min, max, step, leftColor, rightColor,
  } = props;

  return (
    <>
      <VennStack
        colorScale={colorScale}
        data={data}
        x={x}
        xValues={xValues}
        yLabels={yLabels}
        tickFormat={tickFormat}
        domainPadding={domainPadding}
      />

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
}

export default VennStackWSlider;
