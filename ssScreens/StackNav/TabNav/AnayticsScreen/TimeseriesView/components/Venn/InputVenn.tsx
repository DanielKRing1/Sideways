import React, {FC, useMemo} from 'react';
import {ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import MyText from 'ssComponents/ReactNative/MyText';
import VennStackWSlider from 'ssComponents/Charts/Venn/VennStackWSlider';
import {AppDispatch, RootState} from 'ssRedux/index';
import {
  setMonthIndex,
  VennInput,
} from 'ssRedux/analyticsSlice/timeseriesStatsSlice';
import GrowingVennInputDisplay from './GrowingVennInputDisplay';
import {
  getOutputDecorationValue,
  getOutputDecorationList,
} from 'ssDatabase/hardware/realm/userJson/utils';
import {VennByMonth} from 'ssDatabase/api/analytics/timeseries/types';
import {OutputDecoration} from 'ssDatabase/api/userJson/category/types';
import {CallbackArgs} from 'victory-core';
import {getDaysInMonth} from 'ssUtils/date';
import {addNodePostfix, GOOD_POSTFIX, NODE_POSTFIX} from 'ssDatabase/api/types';

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
      (nodeInput: VennInput) => nodeInput.item.id,
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
  console.log(JSON.stringify(vennWrapper));

  // VictoryNative's default VictoryBar chart width
  const DEFAULT_WIDTH = 450;
  // Divide total width among all bars and n-1 spaces
  const barWidth =
    DEFAULT_WIDTH / (2 * getDaysInMonth(vennWrapper.timestamp) - 1);

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <MyText>Input Venn</MyText>

      <GrowingVennInputDisplay />

      <VennStackWSlider
        colorScale={colorScale}
        data={vennWrapper.venn}
        domain={{
          x: [1, getDaysInMonth(vennWrapper.timestamp)],
          y: [0, vennWrapper.venn.length],
        }}
        domainPadding={{x: barWidth, y: barWidth}}
        barWidth={barWidth}
        xdy={(t: CallbackArgs) => ((t.index as number) % 2 === 0 ? 0 : 20)}
        xValues={new Array(getDaysInMonth(vennWrapper.timestamp))
          .fill(undefined)
          .map((v, i) => i + 1)}
        // xValues={vennWrapper.venn[0].map((day: ChartBar) => day.x)}
        xTickFormat={(t: CallbackArgs) =>
          (t.index as number) % 2 === 1
            ? (t.index as number) + 1
            : (t.index as number) + 1
        }
        xLabels={vennWrapper.outputs}
        xLabelFill={({text}) =>
          getOutputDecorationValue(text[0], fullUserJsonMap).color
        }
        yValues={vennNodeInputs.map(
          (nodeInput: VennInput) => nodeInput.item.id,
        )}
        yTickFormat={(t: CallbackArgs) => {
          if (vennNodeInputs.length === 0) return '';

          // console.log('CALLBACK ARGS----------------');
          // console.log(t);
          console.log(vennNodeInputs);
          console.log(t.index);
          const nodeId: string = vennNodeInputs[t.index as number].item.id;
          const nodePostfix: NODE_POSTFIX =
            vennNodeInputs[t.index as number].item.postfix;
          return addNodePostfix(nodeId, nodePostfix);
        }}
        value={monthIndex}
        setValue={handleSelectMonth}
        min={0}
        max={vennByMonth.length - 1}
        leftColor={'yellow'}
        rightColor={'red'}
      />
    </ScrollView>
  );
};

export default InputVenn;
