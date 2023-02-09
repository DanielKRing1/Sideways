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
  const {activeSliceName, allDbOutputs} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {histogramByMonth, monthIndex} = useSelector(
    (state: RootState) => state.analyticsSlice.timeseriesStatsSlice,
  );
  const {fullUserJsonMap} = useSelector(
    (state: RootState) => state.userJsonSlice,
  );
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

  console.log('HISTOGRAAAAAAAAAAAAAAAAAAAAAAAM----------------------------');
  console.log(histogramByMonth[monthIndex].histogram);

  const yValues: number[] = useMemo(() => {
    const min: number = 0;
    const max: number = histogramByMonth[monthIndex].histogram.reduce(
      (acc, cur) => Math.max(cur.y as number, acc),
      1,
    );

    const INC: number = 2;
    const vals = [];
    for (let i = min; i < max; i += INC) {
      if (i % INC === 0) vals.push(i);
    }
    vals.push(max);
    return vals;
  }, [histogramByMonth[monthIndex].histogram]);

  return (
    <View>
      <MyText>Output Histogram</MyText>

      <HistogramWSlider
        horizontal
        gradientColors={outputColorMap}
        // data={[
        //   {x: 'g', y: 4},
        //   {x: 'b', y: 2},
        //   {x: 'c', y: 2},
        //   {x: 'd', y: 20},
        //   {x: 'e', y: 12},
        //   {x: 'f', y: 15},
        //   {x: 'x', y: 2},
        //   {x: 'y', y: 20},
        //   {x: 'z', y: 12},
        //   {x: 'zz', y: 15},
        // ]}
        data={histogramByMonth[monthIndex].histogram}
        x="x"
        // xTickFormat={t =>
        //   (t.index as number) < allDbOutputs.length
        //     ? `'${allDbOutputs[t.index as number]}'`
        //     : ''
        // }
        // xValues={new Array(allDbOutputs.length + 1)
        //   .fill(undefined)
        //   .map((v, i) => i - 1)}
        yValues={yValues}
        yTickFormat={undefined}
        // domainPadding={{y: 20, x: 20}}
        domain={{
          x: [0, allDbOutputs.length + 0.5],
          // x: [0, allDbOutputs.length + 0.5 + 8],
          // y: [0, yValues[yValues.length - 1] * 1.2],
        }}
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
