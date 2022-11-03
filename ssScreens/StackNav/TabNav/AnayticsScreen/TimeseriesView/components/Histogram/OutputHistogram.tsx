import React, {FC, useMemo} from 'react';
import {View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import MyText from 'ssComponents/ReactNative/MyText';
import HistogramWSlider from 'ssComponents/Charts/Histogram/HistogramWSlider';
import {RootState, AppDispatch} from 'ssRedux/index';
import {getDecorationMapSubsetList} from 'ssDatabase/hardware/realm/userJson/utils';
import dbDriver from 'ssDatabase/api/core/dbDriver';
import {GradientColor} from 'ssComponents/Charts/Histogram/Histogram';
import {setMonthIndex} from 'ssRedux/analyticsSlice/timeseriesStatsSlice';
import {
  DECORATION_ROW_TYPE,
  DECORATION_VALUE_KEY,
} from 'ssDatabase/api/userJson/category/types';

type OutputHistogramProps = {};
const OutputHistogram: FC<OutputHistogramProps> = () => {
  const {
    activeSliceName,
    allDbOutputs,
    histogramByMonth,
    monthIndex,
    fullDecorationMap,
  } = useSelector((state: RootState) => ({
    ...state.readSidewaysSlice.toplevelReadReducer,
    ...state.analyticsSlice.timeseriesStatsSlice,
    ...state.userJsonSlice.decorationSlice,
  }));
  const dispatch: AppDispatch = useDispatch();

  // gradientColors={[
  //     { offset: "0%", color:"green" },
  //     { offset: "40%", color:"#FFA99F" },
  //     { offset: "100%", color:"yellow" },
  //   ]}
  const outputColorMap: GradientColor[] = useMemo(() => {
    const outputHeight: number = 100 / allDbOutputs.length;

    return getDecorationMapSubsetList<GradientColor>(
      DECORATION_ROW_TYPE.OUTPUT,
      allDbOutputs,
      DECORATION_VALUE_KEY.COLOR,
      fullDecorationMap,
      (i: number, value: string) => ({
        offset: `${i * outputHeight}%`,
        color: value,
      }),
    );
  }, [activeSliceName, fullDecorationMap]);

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
