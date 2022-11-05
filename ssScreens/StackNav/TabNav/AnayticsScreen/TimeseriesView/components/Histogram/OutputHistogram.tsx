import React, {FC, useMemo} from 'react';
import {View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import MyText from 'ssComponents/ReactNative/MyText';
import HistogramWSlider from 'ssComponents/Charts/Histogram/HistogramWSlider';
import {RootState, AppDispatch} from 'ssRedux/index';
import {getOutputDecorationList} from 'ssDatabase/hardware/realm/userJson/utils';
import {GradientColor} from 'ssComponents/Charts/Histogram/Histogram';
import {setMonthIndex} from 'ssRedux/analyticsSlice/timeseriesStatsSlice';
import {OutputDecoration} from 'ssDatabase/api/userJson/category/types';

type OutputHistogramProps = {};
const OutputHistogram: FC<OutputHistogramProps> = () => {
  const {
    activeSliceName,
    allDbOutputs,
    histogramByMonth,
    monthIndex,
    fullUserJsonMap,
  } = useSelector((state: RootState) => ({
    ...state.readSidewaysSlice.toplevelReadReducer,
    ...state.analyticsSlice.timeseriesStatsSlice,
    ...state.userJsonSlice,
  }));
  const dispatch: AppDispatch = useDispatch();

  // gradientColors={[
  //     { offset: "0%", color:"green" },
  //     { offset: "40%", color:"#FFA99F" },
  //     { offset: "100%", color:"yellow" },
  //   ]}
  const outputColorMap: GradientColor[] = useMemo(() => {
    const outputHeight: number = 100 / allDbOutputs.length;

    return getOutputDecorationList<GradientColor>(
      allDbOutputs,
      fullUserJsonMap,
      (i: number, value: OutputDecoration) => ({
        offset: `${i * outputHeight}%`,
        color: value.color,
      }),
    );
  }, [activeSliceName, fullUserJsonMap]);

  // HANDLER METHODS
  const handleSelectMonth = (newMonthIndex: number) =>
    dispatch(setMonthIndex(newMonthIndex));

  return (
    <View>
      <MyText>Output Histogram</MyText>

      <HistogramWSlider
        horizontal
        gradientColors={outputColorMap}
        data={histogramByMonth[monthIndex].histogram}
        x="x"
        tickFormat={t =>
          String.fromCharCode(
            t.ticks[t.index || 0] + 'a'.charCodeAt(0) - 1,
          ).repeat(4)
        }
        // @ts-ignore
        domainPadding={{x: 20}}
        value={monthIndex}
        setValue={handleSelectMonth}
        min={0}
        max={histogramByMonth.length - 1}
        leftColor={'yellow'}
        rightColor={'red'}
      />
    </View>
  );
};

export default OutputHistogram;
