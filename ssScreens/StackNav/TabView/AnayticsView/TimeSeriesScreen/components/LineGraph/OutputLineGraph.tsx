import React, {FC, useMemo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {CallbackArgs} from 'victory-core';

import dbDriver from 'ssDatabase/api/core/dbDriver';
import MyText from 'ssComponents/ReactNative/MyText';
import BinnedLineGraph from 'ssComponents/Charts/Line/BinnedLineGraph';
import {RootState} from 'ssRedux/index';
import {getDecorationMapSubset} from 'ssDatabase/hardware/realm/userJson/utils';
import {} from 'ssDatabase/api/types';
import {XDomain} from 'ssComponents/Charts/types';
import {
  StringMap,
  DECORATION_ROW_TYPE,
  DECORATION_VALUE_KEY,
} from 'ssDatabase/api/userJson/decoration/types';

type OutputLineGraphProps = {};
const OutputLineGraph: FC<OutputLineGraphProps> = () => {
  const [domain, setDomain] = React.useState<XDomain>({x: [0, 7]});

  const {activeSliceName, allDbOutputs, lineGraph, fullDecorationMap} =
    useSelector((state: RootState) => ({
      ...state.readSidewaysSlice.toplevelReadReducer,
      ...state.analyticsSlice.timeseriesStatsSlice,
      ...state.userJsonSlice.decorationSlice,
    }));

  // colorMap={{
  //     0: 'green',
  //     1: '#FFA99F',
  //     2: 'yellow',
  //   }}
  const outputColorMap: StringMap = useMemo(
    () =>
      getDecorationMapSubset<string>(
        DECORATION_ROW_TYPE.OUTPUT,
        allDbOutputs,
        DECORATION_VALUE_KEY.COLOR,
        fullDecorationMap,
        (i: number) => i,
        (value: string) => value,
      ),
    [activeSliceName, fullDecorationMap],
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
