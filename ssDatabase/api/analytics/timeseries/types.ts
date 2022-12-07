// TYPES
export type DailyOutput = {
  x: number;
  y: number;
};
export type LineGraph = DailyOutput[];

export type ChartBar = {
  x: number;
  y: number;
  y0?: number;
};
export type HistogramByMonth = {
  timestamp: number;
  histogram: ChartBar[];
};

export type VennByMonth = {
  timestamp: number;
  venn: ChartBar[][];
  outputs: string[][];
};

export type HeatMapDay = {
  outputs: string[];
};
export type HeatMapByMonth = {
  timestamp: number;
  heatMap: HeatMapDay[];
};

// Methods
export type GetTimeseriesArgs = {
  sliceName: string;
  outputs: string[];
};

export type GetNodeOverlapArgs = {
  nodeIds: string[];
} & Omit<GetTimeseriesArgs, 'outputs'>;

// Driver type
export type TimeseriesDriverType = {
  getDailyOutputLG: ({
    sliceName,
    outputs,
  }: GetTimeseriesArgs) => Promise<LineGraph>;
  getMonthlyOutputHistogram: ({
    sliceName,
    outputs,
  }: GetTimeseriesArgs) => Promise<HistogramByMonth[]>;
  getNodeOverlapVenn: ({
    sliceName,
    nodeIds,
  }: GetNodeOverlapArgs) => Promise<VennByMonth[]>;
  getDailyOutputHM: ({
    sliceName,
  }: GetTimeseriesArgs) => Promise<HeatMapByMonth[]>;
};
