import React, {FC} from 'react';

import MyHistogram, {MyHistogramProps} from './Histogram';
import MySlider, {MySliderProps} from '../../Input/Slider';

type HistogramWSliderProps = MyHistogramProps & MySliderProps;
const HistogramWSlider: FC<HistogramWSliderProps> = props => {
  const {
    horizontal,
    gradientColors,
    data,
    x,
    xValues,
    xTickFormat,
    yValues,
    yTickFormat,
    domain,
    domainPadding,

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
      <MyHistogram
        horizontal={horizontal}
        gradientColors={gradientColors}
        data={data}
        xValues={xValues}
        yValues={yValues}
        x={x}
        xTickFormat={xTickFormat}
        yTickFormat={yTickFormat}
        domain={domain}
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
};

export default HistogramWSlider;
