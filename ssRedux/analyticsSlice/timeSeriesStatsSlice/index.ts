import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {GrowingIdText as VennInput} from 'ssComponents/Input/GrowingIdList';
export type {GrowingIdText as VennInput} from 'ssComponents/Input/GrowingIdList';
import dbDriver from 'ssDatabase/api/core/dbDriver';
import timeseriesDriver from 'ssDatabase/api/analytics/timeseries/timeseriesStatsDriver';

import {ThunkConfig} from '../../types';
import {deserializeDate, floorDay, serializeDate} from 'ssUtils/date';
import {} from 'ssDatabase/hardware/realm/analytics/timeseries/timeseriesStatsDriver';
import {
  LineGraph,
  HistogramByMonth,
  VennByMonth,
  HeatMapByMonth,
} from 'ssDatabase/api/analytics/timeseries/types';

// INITIAL STATE

export const LINE_GRAPH = 'Line Graph' as const;
export const HISTOGRAM = 'Histogram' as const;
export const VENN_PLOT = 'Venn Plot' as const;
export const HEAT_MAP = 'Heat Map' as const;
type SelectableGraph =
  | typeof LINE_GRAPH
  | typeof HISTOGRAM
  | typeof VENN_PLOT
  | typeof HEAT_MAP;
export const CHART_TYPES = {
  [LINE_GRAPH]: LINE_GRAPH,
  [HISTOGRAM]: HISTOGRAM,
  [VENN_PLOT]: VENN_PLOT,
  [HEAT_MAP]: HEAT_MAP,
};

export interface TimeStatsState {
  analyzedSliceName: string;
  isFresh: boolean;

  // INPUTS
  // Graph Selection
  selectedChart: SelectableGraph;
  // Date Selection
  dayInput: string; // Derive day/month-based stats date range from this day
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
}

const initialState: TimeStatsState = {
  // FRESHNESS
  analyzedSliceName: '',
  isFresh: false,

  // INPUTS
  // Graph Selection
  selectedChart: HEAT_MAP,
  // Date Selection
  dayInput: serializeDate(floorDay(new Date())), // Set to today
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

// const histogramByMonth: HistogramByMonth[] = await TimeseriesStatsDriver.getMonthlyOutputHistogram({ sliceName: TEST_SLICE_NAME, outputs: TEST_OUPUTS_ALL });
// const vennByMonth: VennByMonth[] = await TimeseriesStatsDriver.getNodeOverlapVenn({ sliceName: TEST_SLICE_NAME, nodeIds: TEST_NODES_VENN  });
// const heatMapByMonth: HeatMapByMonth[] = await TimeseriesStatsDriver.getDailyOutputHM({ sliceName: TEST_SLICE_NAME, outputs: TEST_OUPUTS_ALL });

// THUNKS

// Freshness
export const startAssureFreshness = createAsyncThunk<
  boolean,
  undefined,
  ThunkConfig
>('timeseriesStatsSS/startAssureFreshness', async (undef, thunkAPI) => {
  const activeSliceName: string =
    thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
  const analyzedSliceName: string =
    thunkAPI.getState().analyticsSlice.timeseriesStatsSlice.analyzedSliceName;
  const isFresh: boolean =
    thunkAPI.getState().analyticsSlice.timeseriesStatsSlice.isFresh;

  // 1. 'activeSliceName' changed
  if (activeSliceName !== analyzedSliceName) {
    // Recompute charts + reset stats bcus vennNodes are now unknown
    thunkAPI.dispatch(startGetAllTimeseriesStats());
    thunkAPI.dispatch(resetNodesAndStats());
  }
  // 2. Freshness changed (rate, undo rate, ...)
  else if (!isFresh) {
    // Recompute charts + Rerender
    thunkAPI.dispatch(startGetAllTimeseriesStats());
    thunkAPI.dispatch(forceSignatureRerender());
  }

  // 3. Is now fresh
  if (!isFresh) thunkAPI.dispatch(setFreshness(true));
  if (activeSliceName !== analyzedSliceName)
    thunkAPI.dispatch(setAnalyzedSliceName(activeSliceName));

  return true;
});

// Inputs
type StartAddVennInputsArg = VennInput;
export const startAddVennInput = createAsyncThunk<
  boolean,
  StartAddVennInputsArg,
  ThunkConfig
>(
  'timeseriesStatsSS/startAddVennInput',
  async (vennInput: StartAddVennInputsArg, thunkAPI) => {
    // 1. Add venn input
    thunkAPI.dispatch(addVennInput(vennInput));

    // 2. Recalculate venn
    thunkAPI.dispatch(startGetVenn());

    return true;
  },
);
type StartRmVennInputsArg = number;
export const startRmVennInput = createAsyncThunk<
  boolean,
  StartRmVennInputsArg,
  ThunkConfig
>(
  'timeseriesStatsSS/startRmVennInput',
  async (indexToRm: StartRmVennInputsArg, thunkAPI) => {
    // 1. Add venn input
    thunkAPI.dispatch(removeVennInput(indexToRm));

    // 2. Recalculate venn
    thunkAPI.dispatch(startGetVenn());

    return true;
  },
);
type StartSetVennInputsArgs = VennInput[];
export const startSetVennInputs = createAsyncThunk<
  boolean,
  StartSetVennInputsArgs,
  ThunkConfig
>(
  'timeseriesStatsSS/startSetVennInputs',
  async (vennInputs: StartSetVennInputsArgs, thunkAPI) => {
    // 1. Set venn inputs
    thunkAPI.dispatch(setVennInputs(vennInputs));

    // 2. Recalculate venn
    thunkAPI.dispatch(startGetVenn());

    return true;
  },
);

// Charts
type StartSetAllTimeStatsArgs = undefined;
const startGetAllTimeseriesStats = createAsyncThunk<
  boolean,
  StartSetAllTimeStatsArgs,
  ThunkConfig
>(
  'timeseriesStatsSS/startGetTimeStats',
  async (undef: StartSetAllTimeStatsArgs, thunkAPI) => {
    const p1: Promise<any> = thunkAPI.dispatch(startGetLineGraph());
    const p2: Promise<any> = thunkAPI.dispatch(startGetHistogram());
    const p3: Promise<any> = thunkAPI.dispatch(startGetVenn());
    const p4: Promise<any> = thunkAPI.dispatch(startGetHeatMap());

    await Promise.all([p1, p2, p3, p4]);

    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  },
);

type StartGetLineGraphArgs = undefined;
const startGetLineGraph = createAsyncThunk<
  boolean,
  StartGetLineGraphArgs,
  ThunkConfig
>(
  'timeseriesStatsSS/startGetLineGraph',
  async (undef: StartGetLineGraphArgs, thunkAPI) => {
    const activeSliceName: string =
      thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
    const rawOutputs: string[] =
      dbDriver.getSlicePropertyNames(activeSliceName);

    const lineGraph: LineGraph = await timeseriesDriver.getDailyOutputLG({
      sliceName: activeSliceName,
      outputs: rawOutputs,
    });

    thunkAPI.dispatch(setLineGraph(lineGraph));

    return true;
  },
);

type StartGetHistogramArgs = undefined;
const startGetHistogram = createAsyncThunk<
  boolean,
  StartGetHistogramArgs,
  ThunkConfig
>(
  'timeseriesStatsSS/startGetHistogram',
  async (undef: StartGetHistogramArgs, thunkAPI) => {
    const activeSliceName: string =
      thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
    const rawOutputs: string[] =
      dbDriver.getSlicePropertyNames(activeSliceName);

    const histogram: HistogramByMonth[] =
      await timeseriesDriver.getMonthlyOutputHistogram({
        sliceName: activeSliceName,
        outputs: rawOutputs,
      });

    thunkAPI.dispatch(setHistogram(histogram));

    return true;
  },
);

type StartGetVennArgs = undefined;
const startGetVenn = createAsyncThunk<boolean, StartGetVennArgs, ThunkConfig>(
  'timeseriesStatsSS/startGetVenn',
  async (undef: StartGetVennArgs, thunkAPI) => {
    const activeSliceName: string =
      thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
    const inputNodeIds: string[] = thunkAPI
      .getState()
      .analyticsSlice.timeseriesStatsSlice.vennNodeInputs.map(
        (vennInput: VennInput) => vennInput.text,
      );

    // const venn: VennByMonth[] = await timeseriesDriver.getMonthlyOutputHistogram({ sliceName: activeSliceName, outputs: [] }) as VennByMonth[];
    const venn: VennByMonth[] = await timeseriesDriver.getNodeOverlapVenn({
      sliceName: activeSliceName,
      nodeIds: inputNodeIds,
    });

    thunkAPI.dispatch(setVenn(venn));

    return true;
  },
);

type StartGetHeatMapArgs = undefined;
const startGetHeatMap = createAsyncThunk<
  boolean,
  StartGetHeatMapArgs,
  ThunkConfig
>(
  'timeseriesStatsSS/startGetHeatMap',
  async (undef: StartGetHeatMapArgs, thunkAPI) => {
    const activeSliceName: string =
      thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
    const rawOutputs: string[] =
      dbDriver.getSlicePropertyNames(activeSliceName);

    const heatmap: HeatMapByMonth[] = await timeseriesDriver.getDailyOutputHM({
      sliceName: activeSliceName,
      outputs: rawOutputs,
    });
    // const heatmap: HeatMapByMonth[] = await timeseriesDriver.getDailyOutputHM({ sliceName: activeSliceName, outputs: rawOutputs });

    thunkAPI.dispatch(setHeatMap(heatmap));

    return true;
  },
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

export const timeseriesStatsSlice = createSlice({
  name: 'timeseriesStatsSlice',
  initialState,
  reducers: {
    // FRESHNESS
    setFreshness: (state: TimeStatsState, action: SetFreshnessAction) => {
      state.isFresh = action.payload;
    },
    setAnalyzedSliceName: (
      state: TimeStatsState,
      action: SetAnalyzedSliceName,
    ) => {
      state.analyzedSliceName = action.payload;
    },

    // INPUTS
    setChartSelection: (
      state: TimeStatsState,
      action: SetGraphSelectionAction,
    ) => {
      // 1. Set selected chart
      state.selectedChart = action.payload;

      // 2. Get next greater month index - 1, based on selected chart type
      let dayInput: Date = deserializeDate(state.dayInput);
      let monthIndex: number = state.monthIndex;

      switch (state.selectedChart) {
        case HISTOGRAM:
          monthIndex =
            state.histogramByMonth.findIndex(
              ({timestamp}: HistogramByMonth) => timestamp > dayInput,
            ) - 1;
          break;
        case VENN_PLOT:
          monthIndex =
            state.vennByMonth.findIndex(
              ({timestamp}: VennByMonth) => timestamp > dayInput,
            ) - 1;
          break;
        case HEAT_MAP:
          monthIndex =
            state.heatMapByMonth.findIndex(
              ({timestamp}: HeatMapByMonth) => timestamp > dayInput,
            ) - 1;
          break;
        default:
          // Do nothing
          break;
      }

      // 3. Update month index
      state.monthIndex = monthIndex < 0 ? 0 : monthIndex;
    },
    setDayInput: (state: TimeStatsState, action: SetDayInputAction) => {
      // Serialize to string
      state.dayInput = serializeDate(action.payload);
    },
    setMonthIndex: (state: TimeStatsState, action: SetMonthIndex) => {
      // 1. Set month index
      state.monthIndex = action.payload;

      // 2. Also set dayInput Date, based on selected chart type
      switch (state.selectedChart) {
        case HISTOGRAM:
          state.dayInput = serializeDate(
            state.histogramByMonth[state.monthIndex].timestamp,
          );
          break;
        case VENN_PLOT:
          state.dayInput = serializeDate(
            state.vennByMonth[state.monthIndex].timestamp,
          );
          break;
        case HEAT_MAP:
        default:
          state.dayInput = serializeDate(
            state.heatMapByMonth[state.monthIndex].timestamp,
          );
          break;
      }
    },
    addVennInput: (state: TimeStatsState, action: AddVennInput) => {
      state.vennNodeInputs = [...state.vennNodeInputs, action.payload];
      // Force rerender/recalculate Venn (and all)
      state.graphsSignature = {};
    },
    removeVennInput: (state: TimeStatsState, action: RemoveVennInput) => {
      state.vennNodeInputs = [
        ...state.vennNodeInputs.splice(action.payload, 1),
      ];
      // Force rerender/recalculate Venn (and all)
      state.graphsSignature = {};
    },
    setVennInputs: (state: TimeStatsState, action: SetVennInputs) => {
      state.vennNodeInputs = action.payload;
      // Force rerender/recalculate Venn (and all)
      state.graphsSignature = {};
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
    resetNodesAndStats: (
      state: TimeStatsState,
      action: ResetNodesAndStatsAction,
    ) => {
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
    forceSignatureRerender: (
      state: TimeStatsState,
      action: ForceTimeStatsRerenderAction,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.graphsSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
const {
  addVennInput,
  removeVennInput,
  setVennInputs,
  setLineGraph,
  setHistogram,
  setVenn,
  setHeatMap,
  setFreshness,
  setAnalyzedSliceName,
  resetNodesAndStats,
} = timeseriesStatsSlice.actions;
export const {
  setChartSelection,
  setDayInput,
  setMonthIndex,
  forceSignatureRerender,
} = timeseriesStatsSlice.actions;

export default timeseriesStatsSlice.reducer;
