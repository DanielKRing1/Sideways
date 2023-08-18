import React, {FC, useEffect, useMemo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {CallbackArgs} from 'victory-core';

import MyText from 'ssComponents/ReactNative/MyText';
import BinnedLineGraph from 'ssComponents/Charts/Line/BinnedLineGraph';
import {RootState} from 'ssRedux/index';
import {getOutputDecorationSubset} from 'ssDatabase/hardware/realm/userJson/utils/outputFormatting';
import {XDomain} from 'ssComponents/Charts/types';
import {OutputDecoration} from 'ssDatabase/api/userJson/category/types';
import {StringMap} from '../../../../../../../global';
import {
  abbrDate,
  addMonthsMs,
  deserializeDate,
  floorMonth,
  floorMonthMs,
  getAllMonthsRangeMs,
  getSliceRangeMs,
  serializeDateNum,
} from 'ssUtils/date';

type OutputLineGraphProps = {};
const OutputLineGraph: FC<OutputLineGraphProps> = () => {
  // REDUX
  const {activeSliceName} = useSelector(
    (state: RootState) => state.appState.activeJournal,
  );
  const {allDbOutputs} = useSelector(
    (state: RootState) => state.fetched.cachedInputsOutputs,
  );
  // const {lineGraph} = useSelector(
  //   (state: RootState) => state.analytics.timeseriesStats,
  // );
  // DUMMY LINEGRAPH
  const lineGraph = useMemo(() => {
    const todayMs: number = new Date().getTime();
    const dayMs: number = 1000 * 60 * 60 * 24;

    return new Array(1000)
      .fill(undefined)
      .map((v, i) => ({
        x: todayMs + i * dayMs,
        y: 100 * Math.random(),
      }))
      .reverse();
  }, []);
  const {fullUserJsonMap} = useSelector(
    (state: RootState) => state.fetched.userJson,
  );

  // LOCAL STATE
  // Set domain to start of month (of first point) -> next month
  const [domain, setDomain] = React.useState<XDomain>(
    lineGraph.length > 0
      ? {
          x: [
            serializeDateNum(floorMonthMs(lineGraph[lineGraph.length - 1].x)),
            serializeDateNum(
              floorMonth(addMonthsMs(lineGraph[lineGraph.length - 1].x, 1)),
            ),
          ],
        }
      : {x: [0, 1]},
  );
  // List start of all months from first to last point
  const xValues: number[] = useMemo(() => {
    if (lineGraph.length === 0) {
      return [0, 1];
    }

    return getAllMonthsRangeMs(
      lineGraph[lineGraph.length - 1].x,
      lineGraph[0].x,
    );
  }, [lineGraph]);
  const brushXValues: number[] = useMemo(() => {
    const MAX_BRUSH_VALUES = 4;
    if (lineGraph.length === 0) {
      return [0, 1];
    }
    if (xValues.length <= MAX_BRUSH_VALUES) {
      return xValues;
    }

    return getSliceRangeMs(
      lineGraph[lineGraph.length - 1].x,
      lineGraph[0].x,
      MAX_BRUSH_VALUES,
    );
  }, [xValues]);
  // console.log(
  //   'BRUSHXVALUES---------------------------------------------------',
  // );
  // console.log(brushXValues);
  // console.log(xValues.map(v => deserializeDate(v)));

  // useEffect(() => {
  //   console.log(
  //     'XDOMAINNNNNNNNNNN--------------------------------------------',
  //   );

  //   console.log(domain);
  // }, [domain]);

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
        data={lineGraph}
        xValues={xValues}
        // xValues={lineGraph.map((day: DailyOutput) => day.x)}
        xTickFormat={(t: CallbackArgs) => {
          if (t.index === undefined) {
            return '';
          }

          const {month, day, year} = abbrDate(deserializeDate(t.datum));
          return `${month.slice(0, 3)}-${day}`;
        }}
        brushXValues={brushXValues}
        brushTickFormat={(t: CallbackArgs) => {
          if (t.index === undefined) {
            return '';
          }

          const {month, day, year} = abbrDate(deserializeDate(t.datum));
          return t.index === 0 || t.index === brushXValues.length - 1
            ? `${month.slice(0, 3)}-${year}`
            : `${month.slice(0, 3)}-${year % 100}`;
        }}
        // brushXValues={lineGraph.map((day: DailyOutput) => day.x)}
        // yValues={Object.keys(outputColorMap).map(str => parseInt(str, 10))}
        yTickFormat={(t: CallbackArgs) => {
          if (t.index === undefined) {
            return '';
          }

          return t.datum;
        }}
        // @ts-ignore
        domainPadding={{x: 20}}
      />
    </View>
  );
};

export default OutputLineGraph;
