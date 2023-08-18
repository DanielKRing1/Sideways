import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {GrowingIdItem} from 'ssComponents/Input/GrowingIdList';
export type VennInput = GrowingIdItem<NODE_ID_COMPONENTS>;
import timeseriesDriver from 'ssDatabase/api/analytics/timeseries/timeseriesStatsDriver';

import {floorDay, serializeDateNum} from 'ssUtils/date';
import {
  LineGraph,
  HistogramByMonth,
  VennByMonth,
  HeatMapByMonth,
} from 'ssDatabase/api/analytics/timeseries/types';
import {
  addNodePostfix,
  NODE_ID,
  NODE_ID_COMPONENTS,
} from 'ssDatabase/api/types';
import {ThunkConfig} from '../../ssRedux/types';

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
  dayInput: number; // Derive day/month-based stats date range from this day
  monthIndex: number;

  // Node Input
  searchInput: string;
  vennNodeInputs: VennInput[];

  // CHARTS
  lineGraph: LineGraph;
  histogramByMonth: HistogramByMonth[];
  vennByMonth: VennByMonth[];
  heatMapByMonth: HeatMapByMonth[];
}

const initialState: TimeStatsState = {
  // FRESHNESS
  analyzedSliceName: '',
  isFresh: false,

  // INPUTS
  // Graph Selection
  selectedChart: HEAT_MAP,
  // Date Selection
  dayInput: serializeDateNum(floorDay(new Date())), // Set to today
  monthIndex: 0,

  // Node Input
  searchInput: '',
  vennNodeInputs: [],

  // CHARTS
  lineGraph: [],
  histogramByMonth: [],
  vennByMonth: [],
  heatMapByMonth: [],
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
    thunkAPI.getState().appState.activeJournal.activeSliceName;
  const {analyzedSliceName, isFresh} =
    thunkAPI.getState().analytics.timeseriesStats;

  // 1. 'activeSliceName' changed
  if (activeSliceName !== analyzedSliceName) {
    // Recompute charts + reset stats bcus vennNodes are now unknown
    thunkAPI.dispatch(resetNodesAndStats());
    thunkAPI.dispatch(startComputeAllTimeseriesStats());
  }
  // 2. Freshness changed (rate, undo rate, ...)
  else if (!isFresh) {
    // Recompute charts + Rerender
    thunkAPI.dispatch(startComputeAllTimeseriesStats());
  }

  // 3. Is now fresh
  if (activeSliceName !== analyzedSliceName) {
    thunkAPI.dispatch(setAnalyzedSliceName(activeSliceName));
  }
  if (!isFresh) {
    thunkAPI.dispatch(markTimeseriesStatsFresh());
  }

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
    thunkAPI.dispatch(startComputeVenn());

    return true;
  },
);
type StartEditVennInputsArg = {index: number; input: VennInput};
export const startEditVennInput = createAsyncThunk<
  boolean,
  StartEditVennInputsArg,
  ThunkConfig
>(
  'timeseriesStatsSS/startEditVennInput',
  async (args: StartEditVennInputsArg, thunkAPI) => {
    // 1. Add venn input
    thunkAPI.dispatch(editVennInput(args));

    // 2. Recalculate venn
    thunkAPI.dispatch(startComputeVenn());

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
    thunkAPI.dispatch(startComputeVenn());

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
    thunkAPI.dispatch(startComputeVenn());

    return true;
  },
);

// Charts
type StartSetAllTimeStatsArgs = undefined;
const startComputeAllTimeseriesStats = createAsyncThunk<
  boolean,
  StartSetAllTimeStatsArgs,
  ThunkConfig
>(
  'timeseriesStatsSS/startGetTimeStats',
  async (undef: StartSetAllTimeStatsArgs, thunkAPI) => {
    const p1: Promise<any> = thunkAPI.dispatch(startComputeLineGraph());
    const p2: Promise<any> = thunkAPI.dispatch(startComputeHistogram());
    const p3: Promise<any> = thunkAPI.dispatch(startComputeVenn());
    const p4: Promise<any> = thunkAPI.dispatch(startComputeHeatMap());

    await Promise.all([p1, p2, p3, p4]);

    return true;
  },
);

type StartComputeLineGraphArgs = undefined;
const startComputeLineGraph = createAsyncThunk<
  boolean,
  StartComputeLineGraphArgs,
  ThunkConfig
>(
  'timeseriesStatsSS/startComputeLineGraph',
  async (undef: StartComputeLineGraphArgs, thunkAPI) => {
    const {activeSliceName} = thunkAPI.getState().appState.activeJournal;
    const {allDbOutputs} = thunkAPI.getState().fetched.cachedInputsOutputs;

    const lineGraph: LineGraph = await timeseriesDriver.getDailyOutputLG({
      sliceName: activeSliceName,
      outputs: allDbOutputs,
    });

    thunkAPI.dispatch(setLineGraph(lineGraph));

    return true;
  },
);

type StartComputeHistogramArgs = undefined;
const startComputeHistogram = createAsyncThunk<
  boolean,
  StartComputeHistogramArgs,
  ThunkConfig
>(
  'timeseriesStatsSS/startComputeHistogram',
  async (undef: StartComputeHistogramArgs, thunkAPI) => {
    const {activeSliceName} = thunkAPI.getState().appState.activeJournal;
    const {allDbOutputs} = thunkAPI.getState().fetched.cachedInputsOutputs;

    const histogram: HistogramByMonth[] =
      await timeseriesDriver.getMonthlyOutputHistogram({
        sliceName: activeSliceName,
        outputs: allDbOutputs,
      });

    thunkAPI.dispatch(setHistogram(histogram));

    return true;
  },
);

type StartComputeVennArgs = undefined;
const startComputeVenn = createAsyncThunk<
  boolean,
  StartComputeVennArgs,
  ThunkConfig
>(
  'timeseriesStatsSS/startComputeVenn',
  async (undef: StartComputeVennArgs, thunkAPI) => {
    const activeSliceName: string =
      thunkAPI.getState().appState.activeJournal.activeSliceName;
    const inputNodeFullIds: NODE_ID[] = thunkAPI
      .getState()
      .analytics.timeseriesStats.vennNodeInputs.map((vennInput: VennInput) =>
        addNodePostfix(vennInput.item.id, vennInput.item.postfix),
      );

    // const venn: VennByMonth[] = await timeseriesDriver.getMonthlyOutputHistogram({ sliceName: activeSliceName, outputs: [] }) as VennByMonth[];
    const venn: VennByMonth[] = await timeseriesDriver.getNodeOverlapVenn({
      sliceName: activeSliceName,
      nodeIds: inputNodeFullIds,
    });

    thunkAPI.dispatch(setVenn(venn));

    return true;
  },
);

type StartComputeHeatMapArgs = undefined;
const startComputeHeatMap = createAsyncThunk<
  boolean,
  StartComputeHeatMapArgs,
  ThunkConfig
>(
  'timeseriesStatsSS/startComputeHeatMap',
  async (undef: StartComputeHeatMapArgs, thunkAPI) => {
    const {activeSliceName} = thunkAPI.getState().appState.activeJournal;
    const {allDbOutputs} = thunkAPI.getState().fetched.cachedInputsOutputs;

    const heatmap: HeatMapByMonth[] = await timeseriesDriver.getDailyOutputHM({
      sliceName: activeSliceName,
      outputs: allDbOutputs,
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
type SetSearchInput = PayloadAction<string>;
type AddVennInput = PayloadAction<VennInput>;
type EditVennInput = PayloadAction<StartEditVennInputsArg>;
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

// SLICE

export const timeseriesStatsSlice = createSlice({
  name: 'timeseriesStatsSlice',
  initialState,
  reducers: {
    // FRESHNESS
    setFreshness: (state: TimeStatsState, action: SetFreshnessAction) => {
      state.isFresh = action.payload;
    },
    markTimeseriesStatsFresh: (state: TimeStatsState) => {
      if (state.isFresh !== true) {
        state.isFresh = true;
      }
    },
    markTimeseriesStatsUnfresh: (state: TimeStatsState) => {
      if (state.isFresh !== false) {
        state.isFresh = false;
      }
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
      let {dayInput} = state;
      let {monthIndex} = state;

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
      state.dayInput = serializeDateNum(action.payload);
    },
    setMonthIndex: (state: TimeStatsState, action: SetMonthIndex) => {
      // 1. Set month index
      state.monthIndex = action.payload;

      // 2. Also set dayInput Date, based on selected chart type
      switch (state.selectedChart) {
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
    setSearchInput: (state: TimeStatsState, action: SetSearchInput) => {
      state.searchInput = action.payload;
    },
    addVennInput: (state: TimeStatsState, action: AddVennInput) => {
      state.vennNodeInputs.push(action.payload);
      // Force rerender/recalculate Venn (and all)
    },
    editVennInput: (state: TimeStatsState, action: EditVennInput) => {
      state.vennNodeInputs[action.payload.index] = action.payload.input;
      // Force rerender/recalculate Venn (and all)
    },
    removeVennInput: (state: TimeStatsState, action: RemoveVennInput) => {
      // Do not need to set state bcus Redux Toolkit uses Immer, which
      // applies mutations to the state
      state.vennNodeInputs.splice(action.payload, 1);
      // Force rerender/recalculate Venn (and all)
    },
    setVennInputs: (state: TimeStatsState, action: SetVennInputs) => {
      state.vennNodeInputs = action.payload;
      // Force rerender/recalculate Venn (and all)
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
    },
  },
});

// Action creators are generated for each case reducer function
const {
  addVennInput,
  editVennInput,
  removeVennInput,
  setVennInputs,
  setLineGraph,
  setHistogram,
  setVenn,
  setHeatMap,
  markTimeseriesStatsFresh,
  setAnalyzedSliceName,
  resetNodesAndStats,
} = timeseriesStatsSlice.actions;
export const {
  setSearchInput,
  setChartSelection,
  setDayInput,
  setMonthIndex,
  markTimeseriesStatsUnfresh,
} = timeseriesStatsSlice.actions;

export default timeseriesStatsSlice.reducer;
