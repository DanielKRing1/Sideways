import { Dict } from "../../../global";
import { floorDay, splitDay } from "../../../utils/date";
import { deepCopy } from "../../../utils/object";
import dbDriver from "../../dbDriver";
import { SidewaysSnapshotRow, TimeSeriesDriverType } from "../../types";

type GetTimeSeriesArgs = {
    sliceName: string;
    outputs: string[];
};
type LineGraph = DailyOutput[];
type DailyOutput = {
    x: Date;
    y: number;
};
const getDailyOutputLG = async ({ sliceName, outputs }: GetTimeSeriesArgs): Promise<LineGraph> => {
    const list: SidewaysSnapshotRow[] = await dbDriver.getList(sliceName);

    // 1. Hash outputs to number value
    const outputValueMap: Dict<number> = outputs.reduce<Dict<number>>((acc, cur, i) => {
        acc[cur] = i;
        return acc;
    }, {});

    // 2. Map each output for each day to a DailyOutput coordinate
    return list.reduce((acc: LineGraph, daySnapshot: SidewaysSnapshotRow) => {
        // 3. For each output, split the day into an equal day segment
        const dates: Date[] = splitDay(new Date(), daySnapshot.outputs.length);

        // 4. For each day segment, record timestamp and output
        for(let i = 0; i < dates.length; i++) {
            const date: Date = dates[i];
            acc.push({ x: date, y: outputValueMap[daySnapshot.outputs[i]] });
        }

        return acc;
    }, []);
};

type HistogramByMonth = {
    timestamp: Date;
    histogram: ChartBar[];
};
type ChartBar = {
    x: number | string | Date;
    y: number | string | Date;
    y0?: number | string | Date;
};
const getMonthlyOutputHistogram = async ({ sliceName, outputs }: GetTimeSeriesArgs): Promise<HistogramByMonth[]> => {
    const list: SidewaysSnapshotRow[] = await dbDriver.getList(sliceName);

    // 1. Hash outputs to number value
    const outputValueMap: Dict<number> = outputs.reduce<Dict<number>>((acc, cur, i) => {
        acc[cur] = i;
        return acc;
    }, {});

    const initialCountMap: Dict<number> = outputs.reduce<Dict<number>>((acc, output) => {
        const outputKey: number = outputValueMap[output];
        acc[outputKey] = 0;

        return acc;
    }, {});

    // 2. For each month's worth of snapshots...
    let prevMonth: number = -1;
    let prevYear: number = -1;
    let countMap: Dict<number> = { ...initialCountMap };
    const histogramByMonth: HistogramByMonth[] = [];
    for(let i = 0; i < list.length; i++) {
        const daySnapshot: SidewaysSnapshotRow = list[i];
        const { timestamp, outputs } = daySnapshot;
        
        const month: number = timestamp.getMonth();
        const year: number = timestamp.getUTCFullYear();

        // 3. New month, calculate histogram data
        if(month !== prevMonth && year !== prevYear) {
            histogramByMonth.push({
                timestamp: new Date(prevYear, prevMonth, 1),
                histogram: Object.keys(countMap).map((outputKey: string) => ({ x: outputKey, y: countMap[outputKey] })),
            });

            // 4. Reset countMap
            countMap = { ...initialCountMap };

            // 5. Update prevMonth/Year
            prevMonth = month;
            prevYear = year;
        }

        // 6. Increment output occurence for month
        for(const output of outputs) {
            const outputKey: number = outputValueMap[output];

            if(countMap[outputKey] === undefined) countMap[outputKey] = 1;
            else countMap[outputKey]++;
        }
    }
    // 7. Handle last month
    histogramByMonth.push({
        timestamp: new Date(prevYear, prevMonth, 1),
        histogram: Object.keys(countMap).map((outputKey: string) => ({ x: outputKey, y: countMap[outputKey] })),
    });

    return histogramByMonth;
};

type GetNodeOverlapArgs = {
    nodeIds: string[];
} & GetTimeSeriesArgs;
type VennByMonth = {
    timestamp: Date;
    venn: ChartBar[][];
    outputs: string[][];
};
const getNodeOverlapVenn = async ({ sliceName, nodeIds }: GetNodeOverlapArgs): Promise<VennByMonth[]> => {
    const list: SidewaysSnapshotRow[] = await dbDriver.getList(sliceName);

    // 1. Hash nodeIds to number value
    const nodeIdValueMap: Dict<number> = nodeIds.reduce<Dict<number>>((acc, cur, i) => {
        acc[cur] = i;
        return acc;
    }, {});

    // 2. Create an array for each nodeId
    const initialNodeMap: ChartBar[][] = nodeIds.map(() => []);
    
    // 3. For each month's worth of snapshots...
    let prevMonth: number = -1;
    let prevYear: number = -1;
    let monthNodePoints: ChartBar[][] = deepCopy(initialNodeMap);
    let monthOutputs: string[][] = [];
    const vennByMonth: VennByMonth[] = [];
    for(let i = 0; i < list.length; i++) {
        const daySnapshot: SidewaysSnapshotRow = list[i];
        const { timestamp, inputs, outputs: dayOutputs } = daySnapshot;
        
        const month: number = timestamp.getMonth();
        const year: number = timestamp.getUTCFullYear();

        // 4. New month, calculate histogram data
        if(month !== prevMonth && year !== prevYear) {
            vennByMonth.push({
                timestamp: new Date(prevYear, prevMonth, 1),
                venn: monthNodePoints,
                outputs: monthOutputs,
            });

            // 5. Reset Node Points + Outputs
            monthNodePoints = deepCopy(initialNodeMap);
            monthOutputs = []

            // 6. Update prevMonth/Year
            prevMonth = month;
            prevYear = year;
        }

        // 7. Record daily outputs
        monthOutputs.push(dayOutputs);

        // 8. Record desired nodeIds that appear in the snapshot
        for(const nodeId of inputs) {
            // Unwanted nodeId
            if(nodeIdValueMap[nodeId] === undefined) continue;

            // Wanted nodeId, track timestamp + height of 1 + y0 starts at nodeIdKey
            const nodeIdKey: number = nodeIdValueMap[nodeId];
            monthNodePoints[nodeIdKey].push({ x: floorDay(timestamp), y: 1, y0: nodeIdKey });
        }
    }
    // 9. Handle last month
    vennByMonth.push({
        timestamp: new Date(prevYear, prevMonth, 1),
        venn: monthNodePoints,
        outputs: monthOutputs,
    });

    return vennByMonth;
};

type HeatMapDay = {
    outputs: string[];
};
type HeatMapByMonth = {
    timestamp: Date;
    heatMap: HeatMapDay[];
}
const getDailyOutputHM = async({ sliceName }: GetTimeSeriesArgs): Promise<HeatMapByMonth[]> => {
    const list: SidewaysSnapshotRow[] = await dbDriver.getList(sliceName);

    // 1. For each month's worth of snapshots...
    let prevMonth: number = -1;
    let prevYear: number = -1;
    let monthOutputs: HeatMapDay[] = [];
    const heatmapByMonth: HeatMapByMonth[] = [];
    for(let i = 0; i < list.length; i++) {
        const daySnapshot: SidewaysSnapshotRow = list[i];
        const { timestamp, inputs, outputs: dayOutputs } = daySnapshot;
        
        const month: number = timestamp.getMonth();
        const year: number = timestamp.getUTCFullYear();

        // 2. New month, calculate histogram data
        if(month !== prevMonth && year !== prevYear) {
            heatmapByMonth.push({
                timestamp: new Date(prevYear, prevMonth, 1),
                heatMap: monthOutputs,
            });

            // 3. Reset Node Points + Outputs
            monthOutputs = [];

            // 4. Update prevMonth/Year
            prevMonth = month;
            prevYear = year;
        }

        // 5. Record daily outputs
        monthOutputs.push({ outputs: dayOutputs });
    }
    // 6. Handle last month
    heatmapByMonth.push({
        timestamp: new Date(prevYear, prevMonth, 1),
        heatMap: monthOutputs,
    });

    return heatmapByMonth;
};

const Driver: TimeSeriesDriverType = {
    getDailyOutputLG,
    getMonthlyOutputHistogram,
    getNodeOverlapVenn,
    getDailyOutputHM,
};

export default Driver;