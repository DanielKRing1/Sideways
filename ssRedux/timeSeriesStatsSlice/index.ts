import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GrowingIdText as VennInput } from '../../ssComponents/Input/GrowingIdList';
export type { GrowingIdText as VennInput } from '../../ssComponents/Input/GrowingIdList';
import dbDriver from 'ssDatabase/api/dbDriver';
import timeSeriesDriver from '../../ssDatabase/api/analytics/timeSeriesStatsDriver';

import { HiLoRankingByOutput, OUTPUT_KEYS } from '../../ssDatabase/api/types';
import { ThunkConfig } from '../types';
import { floorDay, floorMonth, getNDaysAgo } from '../../ssUtils/date';
import { LineGraph, HistogramByMonth, VennByMonth, HeatMapByMonth } from 'ssDatabase/hardware/realm/analytics/timeSeriesStatsDriver';

// INITIAL STATE

const LINE_GRAPH = 'Line Graph' as const;
const HISTOGRAM = 'Histogram' as const;
const VENN_PLOT = 'Venn Plot' as const;
const HEAT_MAP = 'Heat Map' as const;
type SelectableGraph = typeof LINE_GRAPH | typeof HISTOGRAM | typeof VENN_PLOT | typeof HEAT_MAP;

export interface TimeStatsState {
  // INPUTS
  // Graph Selection
  selectedGraph: SelectableGraph;
  // Date Selection
  dayInput: Date;     // Derive day/month-based stats date range from this day
  // Node Input
  vennNodeInputs: VennInput[];

  // CHARTS
  lineGraph: LineGraph;
  histogramByMonth: HistogramByMonth[];
  vennByMonth: VennByMonth[];
  heatMapByMonth: HeatMapByMonth[];

  // RERENDER
  graphsSignature: {};
};

const initialState: TimeStatsState = {
  // INPUTS
  // Graph Selection
  selectedGraph: HEAT_MAP,
  // Date Selection
  dayInput: floorDay(new Date()),   // Set to today
  // Node Input
  vennNodeInputs: [],

  // CHARTS
  lineGraph: [],
  histogramByMonth: [],
  vennByMonth: [],
  heatMapByMonth: [],


  // RERENDER
  graphsSignature: {},
};

// const histogramByMonth: HistogramByMonth[] = await TimeSeriesStatsDriver.getMonthlyOutputHistogram({ sliceName: TEST_SLICE_NAME, outputs: TEST_OUPUTS_ALL });
// const vennByMonth: VennByMonth[] = await TimeSeriesStatsDriver.getNodeOverlapVenn({ sliceName: TEST_SLICE_NAME, nodeIds: TEST_NODES_VENN  });
// const heatMapByMonth: HeatMapByMonth[] = await TimeSeriesStatsDriver.getDailyOutputHM({ sliceName: TEST_SLICE_NAME, outputs: TEST_OUPUTS_ALL });


// THUNKS

type StartSetAllTimeStatsArgs = undefined;
export const startGetAllTimeSeriesStats = createAsyncThunk<
  boolean,
  StartSetAllTimeStatsArgs,
  ThunkConfig
>(
  'timeSeriesStatsSS/startGetTimeStats',
  async (undefined: StartSetAllTimeStatsArgs, thunkAPI) => {

    const p1: Promise<any> = thunkAPI.dispatch(startGetLineGraph());
    const p2: Promise<any> = thunkAPI.dispatch(startGetHistogram());
    const p3: Promise<any> = thunkAPI.dispatch(startGetVenn());
    const p4: Promise<any> = thunkAPI.dispatch(startGetHeatMap());
    
    await Promise.all([ p1, p2, p3, p4 ]);
    
    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  }
);

type StartGetLineGraphArgs = undefined;
export const startGetLineGraph = createAsyncThunk<
  boolean,
  StartGetLineGraphArgs,
  ThunkConfig
>(
  'timeSeriesStatsSS/startGetLineGraph',
  async (undefined: StartGetLineGraphArgs, thunkAPI) => {
    const activeSliceName: string = thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
    const rawOutputs: string[] = dbDriver.getSlicePropertyNames(activeSliceName);

    const lineGraph: LineGraph = await timeSeriesDriver.getDailyOutputLG({ sliceName: activeSliceName, outputs: rawOutputs });

    thunkAPI.dispatch(setLineGraph(lineGraph));

    return true;
  }
);

type StartGetHistogramArgs = undefined;
export const startGetHistogram = createAsyncThunk<
  boolean,
  StartGetHistogramArgs,
  ThunkConfig
>(
  'timeSeriesStatsSS/startGetHistogram',
  async (undefined: StartGetHistogramArgs, thunkAPI) => {
    const activeSliceName: string = thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
    const rawOutputs: string[] = dbDriver.getSlicePropertyNames(activeSliceName);

    const histogram: HistogramByMonth[] = await timeSeriesDriver.getMonthlyOutputHistogram({ sliceName: activeSliceName, outputs: rawOutputs });

    thunkAPI.dispatch(setHistogram(histogram));

    return true;
  }
);

type StartGetVennArgs = undefined;
export const startGetVenn = createAsyncThunk<
  boolean,
  StartGetVennArgs,
  ThunkConfig
>(
  'timeSeriesStatsSS/startGetVenn',
  async (undefined: StartGetVennArgs, thunkAPI) => {
    const activeSliceName: string = thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
    const inputNodeIds: string[] = thunkAPI.getState().timeSeriesStatsSlice.vennNodeInputs.map((vennInput: VennInput) => vennInput.text);

    // const venn: VennByMonth[] = await timeSeriesDriver.getMonthlyOutputHistogram({ sliceName: activeSliceName, outputs: [] }) as VennByMonth[];
    const venn: VennByMonth[] = await timeSeriesDriver.getNodeOverlapVenn({ sliceName: activeSliceName, nodeIds: inputNodeIds });

    thunkAPI.dispatch(setVenn(venn));

    return true;
  }
);

type StartGetHeatMapArgs = undefined;
export const startGetHeatMap = createAsyncThunk<
  boolean,
  StartGetHeatMapArgs,
  ThunkConfig
>(
  'timeSeriesStatsSS/startGetHeatMap',
  async (undefined: StartGetHeatMapArgs, thunkAPI) => {
    const activeSliceName: string = thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
    const rawOutputs: string[] = dbDriver.getSlicePropertyNames(activeSliceName);

    const heatmap: HeatMapByMonth[] = await timeSeriesDriver.getMonthlyOutputHistogram({ sliceName: activeSliceName, outputs: rawOutputs });
    // const heatmap: HeatMapByMonth[] = await timeSeriesDriver.getDailyOutputHM({ sliceName: activeSliceName, outputs: rawOutputs });

    thunkAPI.dispatch(setHeatMap(heatmap));

    return true;
  }
);

// ACTION TYPES

// Input
type SetGraphSelectionAction = PayloadAction<SelectableGraph>;
type SetDayInputAction = PayloadAction<Date>;
type AddVennInput = PayloadAction<VennInput>;
type RemoveVennInput = PayloadAction<number>;
type SetVennInputs = PayloadAction<VennInput[]>;
// TimeStats
type SetLineGraphAction = PayloadAction<LineGraph>;
type SetHistogramAction = PayloadAction<HistogramByMonth[]>;
type SetVennAction = PayloadAction<VennByMonth[]>;
type SetHeatMapAction = PayloadAction<HeatMapByMonth[]>;
// Rerender
type ForceTimeStatsRerenderAction = PayloadAction<undefined>;

// SLICE

export const timeSeriesStatsSlice = createSlice({
  name: 'timeSeriesStatsSlice',
  initialState,
  reducers: {
    // INPUTS
    setGraphSelection: (state: TimeStatsState, action: SetGraphSelectionAction) => {
      state.graphsSignature = action.payload;
    },
    setDayInput: (state: TimeStatsState, action: SetDayInputAction) => {
      state.dayInput = action.payload;
    },
    addVennInput: (state: TimeStatsState, action: AddVennInput) => {
      state.vennNodeInputs = [ ...state.vennNodeInputs, action.payload ];
    },
    removeVennInput: (state: TimeStatsState, action: RemoveVennInput) => {
      state.vennNodeInputs = [ ...state.vennNodeInputs.splice(action.payload, 1) ];
    },
    setVennInputs: (state: TimeStatsState, action: SetVennInputs) => {
      state.vennNodeInputs = action.payload;
    },
    
    // CHARTS
    setLineGraph: (state: TimeStatsState, action: SetLineGraphAction) => {
      state.lineGraph = action.payload;
    },
    setHistogram: (state: TimeStatsState, action: SetHistogramAction) => {
      state.histogramByMonth = action.payload;
    },
    setVenn: (state: TimeStatsState, action: SetVennAction) => {
      state.vennByMonth = action.payload;
    },
    setHeatMap: (state: TimeStatsState, action: SetHeatMapAction) => {
      state.heatMapByMonth = action.payload;
    },
    
    // RERENDER
    forceSignatureRerender: (state: TimeStatsState, action: ForceTimeStatsRerenderAction) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.graphsSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGraphSelection, setDayInput, addVennInput, removeVennInput, setVennInputs, setLineGraph, setHistogram, setVenn, setHeatMap, forceSignatureRerender } = timeSeriesStatsSlice.actions;


export default timeSeriesStatsSlice.reducer;
