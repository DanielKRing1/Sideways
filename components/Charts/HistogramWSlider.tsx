import React, { FC } from 'react';
import { View } from 'react-native';
import { VictoryAxis, VictoryChart, VictoryBar, VictoryLabel } from 'victory-native';
import { Svg, Defs, LinearGradient, Stop } from 'react-native-svg';

import MyHistogram, { MyHistogramProps } from './Histogram';
import MySlider, { MySliderProps } from '../Input/Slider';

type HistogramWSliderProps = MyHistogramProps & MySliderProps;
const HistogramWSlider: FC<HistogramWSliderProps> = (props) => {
    const {
        horizontal, gradientColors, data, x, tickFormat, domainPadding,
        value, setValue, min, max, step, leftColor, rightColor,
    } = props;

    return (
        <>
            <MyHistogram
                horizontal={horizontal}
                gradientColors={gradientColors}
                data={data}
                x={x}
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

export default HistogramWSlider;
