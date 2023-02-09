import React, {FC} from 'react';

import VennStack, {VennStackProps} from './VennStack';
import MySlider, {MySliderProps} from '../../Input/Slider';

type VennStackWSliderProps = VennStackProps & MySliderProps;
const VennStackWSlider: FC<VennStackWSliderProps> = props => {
  const {
    colorScale,
    data,
    domain,
    domainPadding,
    barWidth = 0,

    x,
    xdx,
    xdy,
    xValues,
    xTickFormat,
    xLabels,
    xLabelFill,

    ydx,
    ydy,
    yValues,
    yTickFormat,

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
      <VennStack
        colorScale={colorScale}
        data={data}
        domain={domain}
        domainPadding={domainPadding}
        barWidth={barWidth}
        x={x}
        xdx={xdx}
        xdy={xdy}
        xValues={xValues}
        xTickFormat={xTickFormat}
        xLabels={xLabels}
        xLabelFill={xLabelFill}
        ydx={ydx}
        ydy={ydy}
        yValues={yValues}
        yTickFormat={yTickFormat}
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

export default VennStackWSlider;
