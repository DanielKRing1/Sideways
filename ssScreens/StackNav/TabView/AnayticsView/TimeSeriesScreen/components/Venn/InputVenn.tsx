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
  getDecorationMapValue,
  getDecorationMapSubsetList,
} from 'ssDatabase/hardware/realm/userJson/utils';
import {ChartBar} from 'ssDatabase/hardware/realm/analytics/timeseriesStatsDriver';
import {DECORATION_ROW_KEY, DECORATION_VALUE_KEY} from 'ssDatabase/api/types';

type InputVennProps = {};
const InputVenn: FC<InputVennProps> = props => {
  const {
    activeSliceName,
    vennByMonth,
    vennNodeInputs,
    monthIndex,
    fullDecorationMap,
  } = useSelector((state: RootState) => ({
    ...state.readSidewaysSlice.toplevelReadReducer,
    ...state.analyticsSlice.timeseriesStatsSlice,
    ...state.userJsonSlice.decorationSlice,
  }));
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
    return getDecorationMapSubsetList<string>(
      DECORATION_ROW_KEY.INPUT,
      vennNodeIds,
      DECORATION_VALUE_KEY.COLOR,
      fullDecorationMap,
      (i: number, value: string) => value,
    );
  }, [vennNodeInputs, fullDecorationMap]);

  return (
    <View>
      <MyText>Input Venn</MyText>

      <GrowingVennInputList />

      <VennStackWSlider
        colorScale={colorScale}
        data={vennByMonth[monthIndex].venn}
        xValues={vennByMonth[monthIndex].venn[0].map(
          (day: ChartBar) => day.x as Date,
        )}
        xLabels={vennByMonth[monthIndex].outputs}
        xLabelFill={({text}) =>
          getDecorationMapValue(
            DECORATION_ROW_KEY.OUTPUT,
            text[0],
            fullDecorationMap,
          )[DECORATION_VALUE_KEY.COLOR]
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
