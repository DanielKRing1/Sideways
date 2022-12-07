import React, {FC, useMemo} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import MyText from 'ssComponents/ReactNative/MyText';
import VennStackWSlider from 'ssComponents/Charts/Venn/VennStackWSlider';
import {AppDispatch, RootState} from 'ssRedux/index';
import {
  setMonthIndex,
  VennInput,
} from 'ssRedux/analyticsSlice/timeseriesStatsSlice';
import GrowingVennInputList from './GrowingVennInputList';
import {
  getOutputDecorationValue,
  getOutputDecorationList,
} from 'ssDatabase/hardware/realm/userJson/utils';
import {ChartBar, VennByMonth} from 'ssDatabase/api/analytics/timeseries/types';
import {OutputDecoration} from 'ssDatabase/api/userJson/category/types';

type InputVennProps = {};
const InputVenn: FC<InputVennProps> = () => {
  const {vennByMonth, vennNodeInputs, monthIndex} = useSelector(
    (state: RootState) => state.analyticsSlice.timeseriesStatsSlice,
  );
  const {fullUserJsonMap} = useSelector(
    (state: RootState) => state.userJsonSlice,
  );

  const dispatch: AppDispatch = useDispatch();

  // HANDLER METHODS
  const handleSelectMonth = (newMonthIndex: number) =>
    dispatch(setMonthIndex(newMonthIndex));

  const colorScale: string[] = useMemo(() => {
    // 1. Get nodeIds
    const vennNodeIds: string[] = vennNodeInputs.map(
      (nodeInput: VennInput) => nodeInput.text,
    );

    // 2. Convert nodeIds to colors
    return getOutputDecorationList<string>(
      vennNodeIds,
      fullUserJsonMap,
      (i: number, value: OutputDecoration) => value.color,
    );
  }, [vennNodeInputs, fullUserJsonMap]);

  const vennWrapper: VennByMonth = useMemo(() => {
    const rawVennWrapper: VennByMonth =
      vennByMonth[monthIndex] !== undefined
        ? vennByMonth[monthIndex]
        : {timestamp: 0, venn: [[]], outputs: [[]]};

    return rawVennWrapper;
  }, [vennByMonth, monthIndex]);

  console.log('INPUTVENN---------------------');
  console.log(vennWrapper);

  return (
    <View>
      <MyText>Input Venn</MyText>

      <GrowingVennInputList />

      <VennStackWSlider
        colorScale={colorScale}
        data={vennWrapper.venn}
        xValues={vennWrapper.venn[0].map((day: ChartBar) => day.x)}
        xLabels={vennWrapper.outputs}
        xLabelFill={({text}) =>
          getOutputDecorationValue(text[0], fullUserJsonMap).color
        }
        yValues={vennNodeInputs.map((nodeInput: VennInput) => nodeInput.text)}
        value={monthIndex}
        setValue={handleSelectMonth}
        min={0}
        max={vennByMonth.length - 1}
        leftColor={'yellow'}
        rightColor={'red'}
      />
    </View>
  );
};

export default InputVenn;
