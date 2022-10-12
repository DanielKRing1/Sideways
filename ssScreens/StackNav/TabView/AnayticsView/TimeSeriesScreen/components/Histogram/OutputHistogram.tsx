import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import {  } from 'victory-core';
import { useSelector, useDispatch } from 'react-redux';

import MyText from 'ssComponents/ReactNative/MyText';
import HistogramWSlider from 'ssComponents/Charts/Histogram/HistogramWSlider';
import { RootState, AppDispatch } from 'ssRedux/index';
import { StringMap } from 'ssDatabase/api/types';
import { getStringMapSubsetList, ID_TYPES } from 'ssDatabase/hardware/realm/user/utils';
import dbDriver from 'ssDatabase/api/core/dbDriver';
import { GradientColor } from 'ssComponents/Charts/Histogram/Histogram';
import { setMonthIndex } from 'ssRedux/analyticsSlice/timeseriesStatsSlice';

type OutputHistogramProps = {};
const OutputHistogram: FC<OutputHistogramProps> = (props) => {

    const { activeSliceName, histogramByMonth, monthIndex, fullColorMap, fullIconMap } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.analyticsSlice.timeseriesStatsSlice, ...state.userJsonSlice.colorSlice, ...state.userJsonSlice.iconSlice }));
    const dispatch: AppDispatch = useDispatch();

// gradientColors={[
//     { offset: "0%", color:"green" },
//     { offset: "40%", color:"#FFA99F" },
//     { offset: "100%", color:"yellow" },
//   ]}
    const outputColorMap: GradientColor[] = useMemo(() => {
        const rawOutputs: string[] = dbDriver.getSlicePropertyNames(activeSliceName);
        const outputHeight: number = 100/rawOutputs.length;
        
        return getStringMapSubsetList<GradientColor>(rawOutputs, fullColorMap, ID_TYPES.OUTPUT, (i: number, value: string) => ({ offset: `${i*outputHeight}%`, color: value }));
    }, [activeSliceName, fullColorMap]);

    // HANDLER METHODS
    const handleSelectMonth = (newMonthIndex: number) => dispatch(setMonthIndex(newMonthIndex));

    return (
        <View>

            <MyText>Output Histogram</MyText>

            <HistogramWSlider
                horizontal
                gradientColors={outputColorMap}
                data={histogramByMonth[monthIndex].histogram}
                x='x'
                tickFormat={(t) => String.fromCharCode(t.ticks[t.index || 0] + 'a'.charCodeAt(0)-1).repeat(4)}
                // @ts-ignore
                domainPadding={{ x: 20 }}
        
                value={monthIndex}
                setValue={handleSelectMonth}
                min={0}
                max={histogramByMonth.length-1}
                leftColor={'yellow'}
                rightColor={'red'}
            />

        </View>
    );
}

export default OutputHistogram;
