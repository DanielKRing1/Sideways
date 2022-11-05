import React, {FC, useMemo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {CallbackArgs} from 'victory-core';

import MyText from 'ssComponents/ReactNative/MyText';
import BinnedLineGraph from 'ssComponents/Charts/Line/BinnedLineGraph';
import {RootState} from 'ssRedux/index';
import {getOutputDecorationSubset} from 'ssDatabase/hardware/realm/userJson/utils';
import {XDomain} from 'ssComponents/Charts/types';
import {OutputDecoration} from 'ssDatabase/api/userJson/category/types';
import {StringMap} from '../../../../../../../global';

type OutputLineGraphProps = {};
const OutputLineGraph: FC<OutputLineGraphProps> = () => {
  const [domain, setDomain] = React.useState<XDomain>({x: [0, 7]});

  const {activeSliceName, allDbOutputs, lineGraph, fullUserJsonMap} =
    useSelector((state: RootState) => ({
      ...state.readSidewaysSlice.toplevelReadReducer,
      ...state.analyticsSlice.timeseriesStatsSlice,
      ...state.userJsonSlice,
    }));

  // colorMap={{
  //     0: 'green',
  //     1: '#FFA99F',
  //     2: 'yellow',
  //   }}
  const outputColorMap: StringMap = useMemo(
    () =>
      getOutputDecorationSubset<string>(
        allDbOutputs,
        fullUserJsonMap,
        (i: number) => i,
        (value: OutputDecoration) => value.color,
      ),
    [activeSliceName, fullUserJsonMap],
  );

  return (
    <View>
      <MyText>Output Line Graph</MyText>

      <BinnedLineGraph
        // TODO Fill in color map
        colorMap={outputColorMap}
        xDomain={domain}
        setXDomain={setDomain}
        // @ts-ignore
        tickValues={Object.keys(outputColorMap)}
        // xValues={lineGraph.map((day: DailyOutput) => day.x)}
        // brushXValues={lineGraph.map((day: DailyOutput) => day.x)}
        data={lineGraph}
        tickFormat={(t: CallbackArgs) =>
          t.index !== undefined ? t.ticks[t.index] : ''
        }
        // @ts-ignore
        domainPadding={{x: 20}}
      />
    </View>
  );
};

export default OutputLineGraph;
