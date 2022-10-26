// TYPES
export type DailyOutput = {
  x: Date;
  y: number;
};
export type LineGraph = DailyOutput[];

export type ChartBar = {
  x: number | Date;
  y: number | Date;
  y0?: number | Date;
};
export type HistogramByMonth = {
  timestamp: Date;
  histogram: ChartBar[];
};

export type VennByMonth = {
  timestamp: Date;
  venn: ChartBar[][];
  outputs: string[][];
};

export type HeatMapDay = {
  outputs: string[];
};
export type HeatMapByMonth = {
  timestamp: Date;
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
