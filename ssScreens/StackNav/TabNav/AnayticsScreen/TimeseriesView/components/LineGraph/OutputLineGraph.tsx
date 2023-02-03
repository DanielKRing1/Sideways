import React, {FC, useEffect, useMemo} from 'react';
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
import {
  abbrDate,
  deserializeDate,
  floorMonth,
  getWeeksMS,
  serializeDateNum,
} from 'ssUtils/date';

const DEFAULT_DOMAIN: XDomain = {x: [0, 1]};

type OutputLineGraphProps = {};
const OutputLineGraph: FC<OutputLineGraphProps> = () => {
  // REDUX
  const {activeSliceName, allDbOutputs} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {lineGraph} = useSelector(
    (state: RootState) => state.analyticsSlice.timeseriesStatsSlice,
  );
  const {fullUserJsonMap} = useSelector(
    (state: RootState) => state.userJsonSlice,
  );

  // LOCAL STATE
  const [domain, setDomain] = React.useState<XDomain>({
    x: [1672128000000, 1671609600000],
  });
  useEffect(() => {
    // 1. Set domain to start of month -> 2 weeks
    // if (domain !== DEFAULT_DOMAIN && lineGraph.length > 0)
    //   setDomain({
    //     x: [
    //       serializeDateNum(floorMonth(deserializeDate(lineGraph[0].x))),
    //       serializeDateNum(
    //         floorMonth(deserializeDate(lineGraph[0].x + getWeeksMS(2))),
    //       ),
    //     ],
    //   });

    console.log(
      'XDOMAINNNNNNNNNNN--------------------------------------------',
    );
    console.log([
      serializeDateNum(floorMonth(deserializeDate(lineGraph[0].x))),
      serializeDateNum(
        floorMonth(deserializeDate(lineGraph[0].x + getWeeksMS(2))),
      ),
    ]);
  }, [lineGraph]);

  console.log(
    'LINEGRAAAAAAAAAAAAAAAAAAAAAAAAAPH--------------------------------',
  );
  console.log(lineGraph);

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
        tickValues={Object.keys(outputColorMap).map(str => parseInt(str, 10))}
        // xValues={lineGraph.map((day: DailyOutput) => day.x)}
        // brushXValues={lineGraph.map((day: DailyOutput) => day.x)}
        data={lineGraph}
        tickFormat={(t: CallbackArgs) => {
          if (t.index === undefined) return '';

          const {month, day, year} = abbrDate(new Date(t.ticks[t.index]));
          return `${day}-${month.slice(2)}`;
        }}
        // @ts-ignore
        domainPadding={{x: 20}}
      />
    </View>
  );
};

export default OutputLineGraph;
