import {
  HistogramByMonth,
  VennByMonth,
  ChartBar,
  HeatMapByMonth,
  HeatMapDay,
  GetNodeOverlapArgs,
  GetTimeseriesArgs,
  TimeseriesDriverType,
  LineGraph,
} from 'ssDatabase/api/analytics/timeseries/types';
import {SidewaysSnapshotRow} from 'ssDatabase/api/core/types';
import {Dict} from '../../../../../global';
import {
  getDate,
  getDaysInMonthMY,
  getMonth,
  getYear,
  serializeDateNum,
  splitDay,
} from '../../../../../ssUtils/date';
import {deepCopy} from '../../../../../ssUtils/object';
import dbDriver from '../../../../api/core/dbDriver';

const getDailyOutputLG = async ({
  sliceName,
  outputs,
}: GetTimeseriesArgs): Promise<LineGraph> => {
  const list: SidewaysSnapshotRow[] = await dbDriver.getList(sliceName);

  // 1. Hash outputs to number value
  const outputValueMap: Dict<number> = outputs.reduce<Dict<number>>(
    (acc, cur, i) => {
      acc[cur] = i;
      return acc;
    },
    {},
  );

  // 2. Map each output for each day to a DailyOutput coordinate
  const lineGraph: LineGraph = [];
  for (let i = 0; i < list.length; i++) {
    const daySnapshot: SidewaysSnapshotRow = list[i];

    // 3. For each output, split the day into an equal day segment
    const dates: Date[] = splitDay(
      daySnapshot.timestamp,
      daySnapshot.outputs.length,
    );

    // 4. For each day segment, record timestamp and output
    for (let i = 0; i < dates.length; i++) {
      const date: number = serializeDateNum(dates[i]);
      lineGraph.push({x: date, y: outputValueMap[daySnapshot.outputs[i]]});
    }
  }

  return lineGraph;
};

const getMonthlyOutputHistogram = async ({
  sliceName,
  outputs,
}: GetTimeseriesArgs): Promise<HistogramByMonth[]> => {
  const list: SidewaysSnapshotRow[] = await dbDriver.getList(sliceName);

  // 0. Short-circuit
  if (list.length === 0) return [];

  // 1. Hash outputs to number value
  const outputValueMap: Dict<number> = outputs.reduce<Dict<number>>(
    (acc, cur, i) => {
      acc[cur] = i;
      return acc;
    },
    {},
  );

  const initialCountMap: Dict<number> = outputs.reduce<Dict<number>>(
    (acc, output) => {
      const outputKey: number = outputValueMap[output];
      acc[outputKey] = 0;

      return acc;
    },
    {},
  );

  // 2. For each month's worth of snapshots...
  let monthBucket: number = getMonth(list[0].timestamp);
  let yearBucket: number = getYear(list[0].timestamp);
  let countMap: Dict<number> = {...initialCountMap};
  const histogramByMonth: HistogramByMonth[] = [];
  for (let i = 0; i < list.length; i++) {
    const daySnapshot: SidewaysSnapshotRow = list[i];
    const {timestamp, outputs} = daySnapshot;

    const month: number = timestamp.getMonth();
    const year: number = timestamp.getUTCFullYear();

    // 3. New month, calculate histogram data
    if (i === list.length - 1 || month !== monthBucket || year !== yearBucket) {
      histogramByMonth.push({
        timestamp: serializeDateNum(new Date(yearBucket, monthBucket, 1)),
        histogram: Object.keys(countMap).map((outputKey: string) => ({
          x: outputKey as unknown as number,
          y: countMap[outputKey],
        })),
      });

      // 4. Reset countMap
      countMap = {...initialCountMap};

      // 5. Update monthBucket/Year
      monthBucket = month;
      yearBucket = year;
    }

    // 6. Increment output occurence for month
    for (const output of outputs) {
      const outputKey: number = outputValueMap[output];

      if (countMap[outputKey] === undefined) countMap[outputKey] = 1;
      else countMap[outputKey]++;
    }
  }
  // // 7. Handle last month
  // histogramByMonth.push({
  //   timestamp: serializeDateNum(new Date(yearBucket, monthBucket, 1)),
  //   histogram: Object.keys(countMap).map((outputKey: string) => ({
  //     x: outputKey as unknown as number,
  //     y: countMap[outputKey],
  //   })),
  // });

  return histogramByMonth;
};

const getNodeOverlapVenn = async ({
  sliceName,
  nodeIds,
}: GetNodeOverlapArgs): Promise<VennByMonth[]> => {
  console.log('GETNODEOVERLAPVENN-------------------');
  console.log(nodeIds);
  const list: SidewaysSnapshotRow[] = await dbDriver.getList(sliceName);

  // 0. Short-circuit
  if (list.length === 0) return [];

  // 1. Hash nodeIds to number value
  const nodeIdValueMap: Dict<number> = nodeIds.reduce<Dict<number>>(
    (acc, cur, i) => {
      acc[cur] = i;
      return acc;
    },
    {},
  );

  // 2. Create an array for each nodeId
  const initialNodeMap: ChartBar[][] =
    nodeIds.length > 0 ? nodeIds.map(() => []) : [[]];
  console.log('INITIAL NODE MAP------------------------------------');
  console.log(initialNodeMap);

  // 3. For each month's worth of snapshots...
  let monthBucket: number = getMonth(list[0].timestamp);
  let yearBucket: number = getYear(list[0].timestamp);
  let monthNodePoints: ChartBar[][] = deepCopy(initialNodeMap);
  let monthOutputs: string[][] = [];
  const vennByMonth: VennByMonth[] = [];
  for (let i = 0; i < list.length; i++) {
    const daySnapshot: SidewaysSnapshotRow = list[i];
    const {timestamp, inputs, outputs: dayOutputs} = daySnapshot;

    const month: number = getMonth(timestamp);
    const year: number = getYear(timestamp);

    // 4. New month, calculate histogram data
    if (i === list.length - 1 || month !== monthBucket || year !== yearBucket) {
      const firstDay: number = 1;
      const lastDay: number = getDaysInMonthMY(monthBucket, yearBucket);
      // For each node
      console.log('ADDING MONTHNODEPOINTS---------------------');

      // try {
      //   for (let nodeKey = 0; nodeKey < monthNodePoints.length; nodeKey++) {
      //     const monthPoints = monthNodePoints[nodeKey as unknown as number];

      //     console.log(nodeKey);
      //     console.log(monthPoints);
      //     console.log(monthPoints[0].x);
      //     console.log(monthPoints[monthPoints.length - 1].x);

      //     for (let i = 0; i < monthPoints.length; i++) {
      //       if (monthPoints[i].x !== i) {
      //         monthPoints.splice(i, 0, {
      //           x: i,
      //           y: 0,
      //           y0: nodeKey as unknown as number,
      //         });
      //       }
      //     }

      //     // Add first day if not present
      //     // if (monthPoints[0].x > firstDay)
      //     //   monthPoints.unshift({
      //     //     x: firstDay,
      //     //     y: 0,
      //     //     y0: nodeKey as unknown as number,
      //     //   });

      //     // // Add last day if not present
      //     // if (monthPoints[monthPoints.length - 1].x < lastDay)
      //     //   monthPoints.push({
      //     //     x: lastDay,
      //     //     y: 0,
      //     //     y0: nodeKey as unknown as number,
      //     //   });
      //   }
      // } catch (err) {
      //   console.log('ERRRRRRRRRRRRRRRRRRRRRRRROR-----------------------------');
      //   console.log(err);
      // }

      vennByMonth.push({
        timestamp: serializeDateNum(new Date(yearBucket, monthBucket, 1)),
        venn: monthNodePoints,
        outputs: monthOutputs,
      });

      // 5. Reset Node Points + Outputs
      monthNodePoints = deepCopy(initialNodeMap);
      monthOutputs = [];

      // 6. Update monthBucket/Year
      monthBucket = month;
      yearBucket = year;
    }

    // 7. Record daily outputs
    // Push onto front, so timestmps are 'ascending',
    // Else VictoryChart will only display last point
    monthOutputs.unshift(dayOutputs);

    // 8. Record desired nodeIds that appear in the snapshot
    for (const nodeId of inputs) {
      // Unwanted nodeId
      if (nodeIdValueMap[nodeId] === undefined) continue;

      // Wanted nodeId, track timestamp + height of 1 + y0 starts at nodeIdKey
      const nodeIdKey: number = nodeIdValueMap[nodeId];
      // Push onto front, so timestmps are 'ascending',
      // Else VictoryChart will only display last point
      monthNodePoints[nodeIdKey].unshift({
        x: getDate(timestamp),
        y: 1,
        y0: nodeIdKey,
      });
    }
  }
  // // 9. Handle last month
  // vennByMonth.push({
  //   timestamp: serializeDateNum(new Date(yearBucket, monthBucket, 1)),
  //   venn: monthNodePoints,
  //   outputs: monthOutputs,
  // });

  console.log('AYAYAYAYAYAYOOOOOO');
  console.log(JSON.stringify(vennByMonth));

  return vennByMonth;
};

const getDailyOutputHM = async ({
  sliceName,
}: GetTimeseriesArgs): Promise<HeatMapByMonth[]> => {
  const list: SidewaysSnapshotRow[] = await dbDriver.getList(sliceName);

  // 0. Short-circuit
  if (list.length === 0) return [];

  // 1. For each month's worth of snapshots...
  let monthBucket: number = getMonth(list[0].timestamp);
  let yearBucket: number = getYear(list[0].timestamp);
  let monthOutputs: HeatMapDay[] = [];
  const heatmapByMonth: HeatMapByMonth[] = [];
  for (let i = 0; i < list.length; i++) {
    const daySnapshot: SidewaysSnapshotRow = list[i];
    const {timestamp, inputs, outputs: dayOutputs} = daySnapshot;

    const month: number = timestamp.getMonth();
    const year: number = timestamp.getUTCFullYear();

    // 2. New month, calculate histogram data
    if (i === list.length - 1 || month !== monthBucket || year !== yearBucket) {
      heatmapByMonth.push({
        timestamp: serializeDateNum(new Date(yearBucket, monthBucket, 1)),
        heatMap: monthOutputs,
      });

      // 3. Reset Node Points + Outputs
      monthOutputs = [];

      // 4. Update prevMonth/Year
      monthBucket = month;
      yearBucket = year;
    }

    // 5. Record daily outputs
    monthOutputs.push({date: getDate(timestamp), outputs: dayOutputs});
  }
  // // 6. Handle last month
  // heatmapByMonth.push({
  //   timestamp: serializeDateNum(new Date(yearBucket, monthBucket, 1)),
  //   heatMap: monthOutputs,
  // });

  return heatmapByMonth;
};

const Driver: TimeseriesDriverType = {
  getDailyOutputLG,
  getMonthlyOutputHistogram,
  getNodeOverlapVenn,
  getDailyOutputHM,
};

export default Driver;
