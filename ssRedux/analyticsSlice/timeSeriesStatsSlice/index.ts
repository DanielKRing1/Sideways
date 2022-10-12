import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GrowingIdText as VennInput } from '../../../ssComponents/Input/GrowingIdList';
export type { GrowingIdText as VennInput } from '../../../ssComponents/Input/GrowingIdList';
import dbDriver from 'ssDatabase/api/core/dbDriver';
import timeSeriesDriver from '../../../ssDatabase/api/analytics/timeSeriesStatsDriver';

import { ThunkConfig } from '../../types';
import { floorDay } from '../../../ssUtils/date';
import { LineGraph, HistogramByMonth, VennByMonth, HeatMapByMonth } from 'ssDatabase/hardware/realm/analytics/timeSeriesStatsDriver';

// INITIAL STATE

export const LINE_GRAPH = 'Line Graph' as const;
export const HISTOGRAM = 'Histogram' as const;
export const VENN_PLOT = 'Venn Plot' as const;
export const HEAT_MAP = 'Heat Map' as const;
type SelectableGraph = typeof LINE_GRAPH | typeof HISTOGRAM | typeof VENN_PLOT | typeof HEAT_MAP;
export const GRAPH_TYPES = {
  [LINE_GRAPH]: LINE_GRAPH,
  [HISTOGRAM]: HISTOGRAM,
  [VENN_PLOT]: VENN_PLOT,
  [HEAT_MAP]: HEAT_MAP,
}

export interface TimeStatsState {
  analyzedSliceName: string;
  isFresh: boolean;

  // INPUTS
  // Graph Selection
  selectedGraph: SelectableGraph;
  // Date Selection
  dayInput: Date;       // Derive day/month-based stats date range from this day
  monthIndex: number;
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
  // FRESHNESS
  analyzedSliceName: '',
  isFresh: false,
  
  // INPUTS
  // Graph Selection
  selectedGraph: HEAT_MAP,
  // Date Selection
  dayInput: floorDay(new Date()),   // Set to today
  monthIndex: 0,
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

// Freshness
export const startAssureFreshness = createAsyncThunk<
  boolean,
  undefined,
  ThunkConfig
>(
  'timeSeriesStatsSS/startAssureFreshness',
  async (undefined, thunkAPI) => {
    const activeSliceName: string = thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
    const analyzedSliceName: string = thunkAPI.getState().analyticsSlice.timeseriesStatsSlice.analyzedSliceName;
    const isFresh: boolean = thunkAPI.getState().analyticsSlice.timeseriesStatsSlice.isFresh;

    // 1. 'activeSliceName' changed
    if(activeSliceName !== analyzedSliceName) {
      // Recompute charts + reset stats bcus vennNodes are now unknown
      thunkAPI.dispatch(startGetAllTimeSeriesStats());
      thunkAPI.dispatch(resetNodesAndStats());
    }
    // 2. Freshness changed (rate, undo rate, ...)
    else if(!isFresh) {
      // Recompute charts + Rerender
      thunkAPI.dispatch(startGetAllTimeSeriesStats());
      thunkAPI.dispatch(forceSignatureRerender()); 
    }
    
    // 3. Is now fresh
    if(!isFresh) thunkAPI.dispatch(setFreshness(true));
    if(activeSliceName !== analyzedSliceName) thunkAPI.dispatch(setAnalyzedSliceName(activeSliceName));

    return true;
  }
);

// Inputs
type StartAddVennInputsArg = VennInput;
export const startAddVennInput = createAsyncThunk<
  boolean,
  StartAddVennInputsArg,
  ThunkConfig
>(
  'timeSeriesStatsSS/startAddVennInput',
  async (vennInput: StartAddVennInputsArg, thunkAPI) => {
    // 1. Add venn input
    thunkAPI.dispatch(addVennInput(vennInput));

    // 2. Recalculate venn
    thunkAPI.dispatch(startGetVenn());

    return true;
  }
);
type StartRmVennInputsArg = number;
export const startRmVennInput = createAsyncThunk<
  boolean,
  StartRmVennInputsArg,
  ThunkConfig
>(
  'timeSeriesStatsSS/startRmVennInput',
  async (indexToRm: StartRmVennInputsArg, thunkAPI) => {
    // 1. Add venn input
    thunkAPI.dispatch(removeVennInput(indexToRm));

    // 2. Recalculate venn
    thunkAPI.dispatch(startGetVenn());

    return true;
  }
);
type StartSetVennInputsArgs = VennInput[];
export const startSetVennInputs = createAsyncThunk<
  boolean,
  StartSetVennInputsArgs,
  ThunkConfig
>(
  'timeSeriesStatsSS/startSetVennInputs',
  async (vennInputs: StartSetVennInputsArgs, thunkAPI) => {
    // 1. Set venn inputs
    thunkAPI.dispatch(setVennInputs(vennInputs));

    // 2. Recalculate venn
    thunkAPI.dispatch(startGetVenn());

    return true;
  }
);

// Charts
type StartSetAllTimeStatsArgs = undefined;
const startGetAllTimeSeriesStats = createAsyncThunk<
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
const startGetLineGraph = createAsyncThunk<
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
const startGetHistogram = createAsyncThunk<
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
const startGetVenn = createAsyncThunk<
  boolean,
  StartGetVennArgs,
  ThunkConfig
>(
  'timeSeriesStatsSS/startGetVenn',
  async (undefined: StartGetVennArgs, thunkAPI) => {
    const activeSliceName: string = thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
    const inputNodeIds: string[] = thunkAPI.getState().analyticsSlice.timeseriesStatsSlice.vennNodeInputs.map((vennInput: VennInput) => vennInput.text);

    // const venn: VennByMonth[] = await timeSeriesDriver.getMonthlyOutputHistogram({ sliceName: activeSliceName, outputs: [] }) as VennByMonth[];
    const venn: VennByMonth[] = await timeSeriesDriver.getNodeOverlapVenn({ sliceName: activeSliceName, nodeIds: inputNodeIds });

    thunkAPI.dispatch(setVenn(venn));

    return true;
  }
);

type StartGetHeatMapArgs = undefined;
const startGetHeatMap = createAsyncThunk<
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

// Freshness
type SetFreshnessAction = PayloadAction<boolean>;
type SetAnalyzedSliceName = PayloadAction<string>;
// Input
type SetGraphSelectionAction = PayloadAction<SelectableGraph>;
type SetDayInputAction = PayloadAction<Date>;
type AddVennInput = PayloadAction<VennInput>;
type RemoveVennInput = PayloadAction<number>;
type SetVennInputs = PayloadAction<VennInput[]>;
type SetMonthIndex = PayloadAction<number>;
// TimeStats
type SetLineGraphAction = PayloadAction<LineGraph>;
type SetHistogramAction = PayloadAction<HistogramByMonth[]>;
type SetVennAction = PayloadAction<VennByMonth[]>;
type SetHeatMapAction = PayloadAction<HeatMapByMonth[]>;
// Reset
type ResetNodesAndStatsAction = PayloadAction<undefined>;
// Rerender
type ForceTimeStatsRerenderAction = PayloadAction<undefined>;

// SLICE

export const timeSeriesStatsSlice = createSlice({
  name: 'timeSeriesStatsSlice',
  initialState,
  reducers: {
    // FRESHNESS
    setFreshness: (state: TimeStatsState, action: SetFreshnessAction) => {
      state.isFresh = action.payload;
    },
    setAnalyzedSliceName: (state: TimeStatsState, action: SetAnalyzedSliceName) => {
      state.analyzedSliceName = action.payload;
    },
    
    // INPUTS
    setGraphSelection: (state: TimeStatsState, action: SetGraphSelectionAction) => {
      state.graphsSignature = action.payload;
    },
    setDayInput: (state: TimeStatsState, action: SetDayInputAction) => {
      state.dayInput = action.payload;
    },
    addVennInput: (state: TimeStatsState, action: AddVennInput) => {
      state.vennNodeInputs = [ ...state.vennNodeInputs, action.payload ];
      // Force rerender/recalculate Venn (and all)
      state.graphsSignature = {};
    },
    removeVennInput: (state: TimeStatsState, action: RemoveVennInput) => {
      state.vennNodeInputs = [ ...state.vennNodeInputs.splice(action.payload, 1) ];
      // Force rerender/recalculate Venn (and all)
      state.graphsSignature = {};
    },
    setVennInputs: (state: TimeStatsState, action: SetVennInputs) => {
      state.vennNodeInputs = action.payload;
      // Force rerender/recalculate Venn (and all)
      state.graphsSignature = {};
    },
    setMonthIndex: (state: TimeStatsState, action: SetMonthIndex) => {
      // 1. Set month index
      state.monthIndex = action.payload;

      // 2. Also set dayInput Date, based on selected graph type
      switch(state.selectedGraph) {
        case HISTOGRAM:
          state.dayInput = state.histogramByMonth[state.monthIndex].timestamp;
          break;
        case VENN_PLOT:
          state.dayInput = state.vennByMonth[state.monthIndex].timestamp;
          break;
        case HEAT_MAP:
        default:
          state.dayInput = state.heatMapByMonth[state.monthIndex].timestamp;
          break;
      }
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

    // Reset
    resetNodesAndStats: (state: TimeStatsState, action: ResetNodesAndStatsAction) => {
      // INPUTS
      // Node Input
      state.vennNodeInputs = [];

      // CHARTS
      state.lineGraph = [];
      state.histogramByMonth = [];
      state.vennByMonth = [];
      state.heatMapByMonth = [];

      // RERENDER
      state.graphsSignature = {};
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
const { addVennInput, removeVennInput, setVennInputs, setLineGraph, setHistogram, setVenn, setHeatMap, setFreshness, setAnalyzedSliceName, resetNodesAndStats } = timeSeriesStatsSlice.actions;
export const { setGraphSelection, setDayInput, setMonthIndex, forceSignatureRerender } = timeSeriesStatsSlice.actions;


export default timeSeriesStatsSlice.reducer;
