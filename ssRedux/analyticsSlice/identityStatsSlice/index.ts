import {RankedNode} from '@asianpersonn/realm-graph';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import dbDriver from '../../../ssDatabase/api/core/dbDriver';
import recommendationsDriver from '../../../ssDatabase/api/analytics/recommendationStatsDriver';
import identityDriver from '../../../ssDatabase/api/analytics/identityStatsDriver';
import {
  GetNodeStatsArgs,
  GetNodeStatsByOutputArgs,
  HiLoRanking,
  HiLoRankingByOutput,
  OutputKeyType,
  OUTPUT_KEYS,
  SINGLE_KEY,
} from '../../../ssDatabase/api/types';
import {ThunkConfig} from '../../types';

// INITIAL STATE

export interface IdentityStatsState {
  analyzedSliceName: string;
  isFresh: boolean;

  searchedNodeIdInput: string;
  nodeIdInput: string;
  listLength: number;

  // Identity Stats
  identityNodes: HiLoRankingByOutput;
  // Tandem Stats
  nodeStats: RankedNode | undefined;
  collectivelyTandemNodes: HiLoRanking;
  singlyTandemNodes: HiLoRankingByOutput;
  highlyRatedTandemNodes: HiLoRankingByOutput;

  identityStatsSignature: {};
  inputStatsSignature: {};
}

const initialState: IdentityStatsState = {
  // FRESHNESS
  analyzedSliceName: '',
  isFresh: false,

  // INPUTS
  searchedNodeIdInput: '',
  nodeIdInput: '',
  listLength: 5,

  // STATS
  identityNodes: {},
  nodeStats: undefined,
  collectivelyTandemNodes: {
    highestRanked: [],
    lowestRanked: [],
  },
  singlyTandemNodes: {},
  highlyRatedTandemNodes: {},

  // RERENDER
  identityStatsSignature: {},
  inputStatsSignature: {},
};

// THUNKS

// Freshness
export const startAssureFreshness = createAsyncThunk<
  boolean,
  undefined,
  ThunkConfig
>('identityStatsSS/startAssureFreshness', async (undef, thunkAPI) => {
  const activeSliceName: string =
    thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
  const analyzedSliceName: string =
    thunkAPI.getState().analyticsSlice.identityStatsSlice.analyzedSliceName;
  const isFresh: boolean =
    thunkAPI.getState().analyticsSlice.identityStatsSlice.isFresh;

  // 1. 'activeSliceName' changed
  if (activeSliceName !== analyzedSliceName) {
    // Recompute identityNodes + reset stats bcus inputNode is now unknown
    thunkAPI.dispatch(startGetIdentityNodes());
    thunkAPI.dispatch(resetNodesAndStats());
  }
  // 2. Freshness changed (rate, undo rate, ...)
  else if (!isFresh) {
    // Recompute identityNodes + Recompute inputNode stats + Rerender identity and input stats
    thunkAPI.dispatch(startGetIdentityNodes());
    thunkAPI.dispatch(
      startSetNodeIdInput(
        thunkAPI.getState().analyticsSlice.identityStatsSlice.nodeIdInput,
      ),
    );
    thunkAPI.dispatch(forceIdentityStatsSignatureRerender());
    thunkAPI.dispatch(forceInputStatsSignatureRerender());
  }

  // 3. Is now fresh
  if (!isFresh) thunkAPI.dispatch(setFreshness(true));
  if (activeSliceName !== analyzedSliceName)
    thunkAPI.dispatch(setAnalyzedSliceName(activeSliceName));

  return true;
});

// Identity Stats

const startGetIdentityNodes = createAsyncThunk<boolean, undefined, ThunkConfig>(
  'identityStatsSS/startGetIdentityNodes',
  async (undef, thunkAPI) => {
    const activeSliceName: string =
      thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
    const rawOutputs: string[] =
      dbDriver.getSlicePropertyNames(activeSliceName);
    const listLength: number = 5;
    const outputType: OutputKeyType = OUTPUT_KEYS[SINGLE_KEY];
    const iterations: number = 20;
    const dampingFactor: number = 0.85;

    const hiLoRankings: HiLoRankingByOutput = recommendationsDriver.pageRank({
      graphName: activeSliceName,
      rawOutputs,
      listLength,
      outputType,
      iterations,
      dampingFactor,
    });

    thunkAPI.dispatch(setIdentityNodes(hiLoRankings));
    thunkAPI.dispatch(forceIdentityStatsSignatureRerender());

    return true;
  },
);

// Input Stats

type StartSetNodeIdInputArgs = string;
export const startSetNodeIdInput = createAsyncThunk<
  boolean,
  StartSetNodeIdInputArgs,
  ThunkConfig
>(
  'identityStatsSS/startGetNodeStats',
  async (nodeIdInput: StartSetNodeIdInputArgs, thunkAPI) => {
    // 1. Set node id input
    thunkAPI.dispatch(setNodeIdInput(nodeIdInput));

    // 2. Get state
    const activeSliceName: string =
      thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
    const listLength: number =
      thunkAPI.getState().analyticsSlice.identityStatsSlice.listLength;
    const rawOutputs: string[] =
      dbDriver.getSlicePropertyNames(activeSliceName);

    // 3. Dispatch stats thunks
    const p1: Promise<any> = thunkAPI.dispatch(
      startGetNodeStats({
        graphName: activeSliceName,
        nodeId: nodeIdInput,
        rawOutputs,
      }),
    );
    const p2: Promise<any> = thunkAPI.dispatch(
      startGetCollectivelyTandemNodes({
        graphName: activeSliceName,
        nodeId: nodeIdInput,
        rawOutputs,
        listLength,
      }),
    );
    const p3: Promise<any> = thunkAPI.dispatch(
      startGetSinglyTandemNodes({
        graphName: activeSliceName,
        nodeId: nodeIdInput,
        rawOutputs,
        listLength,
      }),
    );
    const p4: Promise<any> = thunkAPI.dispatch(
      startGetHighlyRatedTandemNodes({
        graphName: activeSliceName,
        nodeId: nodeIdInput,
        rawOutputs,
        listLength,
      }),
    );

    // 4. Await promises
    await Promise.all([p1, p2, p3, p4]);

    // 5. Dispatch rerender
    thunkAPI.dispatch(forceInputStatsSignatureRerender());

    return true;
  },
);

export const startGetNodeStats = createAsyncThunk<
  boolean,
  GetNodeStatsArgs,
  ThunkConfig
>(
  'identityStatsSS/startGetNodeStats',
  async ({graphName, nodeId, rawOutputs}: GetNodeStatsArgs, thunkAPI) => {
    const nodeStats: RankedNode | undefined = identityDriver.getNodeStats({
      graphName,
      nodeId,
      rawOutputs,
    });
    if (nodeStats === undefined) return false;

    thunkAPI.dispatch(setNodeStats(nodeStats));

    return true;
  },
);
export const startGetCollectivelyTandemNodes = createAsyncThunk<
  boolean,
  GetNodeStatsByOutputArgs,
  ThunkConfig
>(
  'identityStatsSS/startGetCollectivelyTandemNodes',
  async (
    {graphName, nodeId, rawOutputs, listLength}: GetNodeStatsByOutputArgs,
    thunkAPI,
  ) => {
    const hiLoRankings: HiLoRanking =
      await identityDriver.getCollectivelyTandemNodes({
        graphName,
        nodeId,
        rawOutputs,
        listLength,
      });

    thunkAPI.dispatch(setCollectivelyTandemNode(hiLoRankings));

    return true;
  },
);
export const startGetSinglyTandemNodes = createAsyncThunk<
  boolean,
  GetNodeStatsByOutputArgs,
  ThunkConfig
>(
  'identityStatsSS/startGetSinglyTandemNodes',
  async (
    {graphName, nodeId, rawOutputs, listLength}: GetNodeStatsByOutputArgs,
    thunkAPI,
  ) => {
    const hiLoRankings: HiLoRankingByOutput =
      await identityDriver.getSinglyTandemNodes({
        graphName,
        nodeId,
        rawOutputs,
        listLength,
      });

    thunkAPI.dispatch(setSinglyTandemNodes(hiLoRankings));

    return true;
  },
);
export const startGetHighlyRatedTandemNodes = createAsyncThunk<
  boolean,
  GetNodeStatsByOutputArgs,
  ThunkConfig
>(
  'identityStatsSS/startGetHighlyRatedTandemNodes',
  async (
    {graphName, nodeId, rawOutputs, listLength}: GetNodeStatsByOutputArgs,
    thunkAPI,
  ) => {
    const hiLoRankings: HiLoRankingByOutput =
      await identityDriver.getHighlyRatedTandemNodes({
        graphName,
        nodeId,
        rawOutputs,
        listLength,
      });

    thunkAPI.dispatch(setHighlyRatedTandemNodes(hiLoRankings));

    return true;
  },
);

// ACTION TYPES

// Freshness
type SetFreshnessAction = PayloadAction<boolean>;
type SetAnalyzedSliceName = PayloadAction<string>;
// Input
type SetSearchedNodeIdInputAction = PayloadAction<string>;
type SetNodeIdInputAction = PayloadAction<string>;
type SetListLengthAction = PayloadAction<number>;
// Stats
type SetIdentityNodesAction = PayloadAction<HiLoRankingByOutput>;
type SetNodeStatsAction = PayloadAction<RankedNode>;
type SetCollectivelyTandemNodesAction = PayloadAction<HiLoRanking>;
type SetSinglyTandemNodesAction = PayloadAction<HiLoRankingByOutput>;
type SetHighlyRatedTandemNodesAction = PayloadAction<HiLoRankingByOutput>;
// Reset
type ResetNodesAndStatsAction = PayloadAction<undefined>;
// Rerender
type ForceIdentityStatsRerenderAction = PayloadAction<undefined>;
type ForceInputStatsRerenderAction = PayloadAction<undefined>;

// SLICE

export const identityStatsSlice = createSlice({
  name: 'identityStatsSlice',
  initialState,
  reducers: {
    // FRESHNESS
    setFreshness: (state: IdentityStatsState, action: SetFreshnessAction) => {
      state.isFresh = action.payload;
    },
    setAnalyzedSliceName: (
      state: IdentityStatsState,
      action: SetAnalyzedSliceName,
    ) => {
      state.analyzedSliceName = action.payload;
    },

    // Inputs
    setSearchNodeIdInput: (
      state: IdentityStatsState,
      action: SetSearchedNodeIdInputAction,
    ) => {
      state.searchedNodeIdInput = action.payload;
    },
    setNodeIdInput: (
      state: IdentityStatsState,
      action: SetNodeIdInputAction,
    ) => {
      state.nodeIdInput = action.payload;
    },
    setListLength: (state: IdentityStatsState, action: SetListLengthAction) => {
      state.listLength = action.payload;
    },

    // Stats
    setIdentityNodes: (
      state: IdentityStatsState,
      action: SetIdentityNodesAction,
    ) => {
      state.identityNodes = action.payload;
    },
    setNodeStats: (state: IdentityStatsState, action: SetNodeStatsAction) => {
      state.nodeStats = action.payload;
    },
    setCollectivelyTandemNode: (
      state: IdentityStatsState,
      action: SetCollectivelyTandemNodesAction,
    ) => {
      state.collectivelyTandemNodes = action.payload;
    },
    setSinglyTandemNodes: (
      state: IdentityStatsState,
      action: SetSinglyTandemNodesAction,
    ) => {
      state.singlyTandemNodes = action.payload;
    },
    setHighlyRatedTandemNodes: (
      state: IdentityStatsState,
      action: SetHighlyRatedTandemNodesAction,
    ) => {
      state.highlyRatedTandemNodes = action.payload;
    },

    // Reset
    resetNodesAndStats: (
      state: IdentityStatsState,
      action: ResetNodesAndStatsAction,
    ) => {
      // Input
      state.searchedNodeIdInput = '';
      state.nodeIdInput = '';

      // Stats
      state.identityNodes = {};
      state.nodeStats = undefined;
      state.collectivelyTandemNodes = {highestRanked: [], lowestRanked: []};
      state.singlyTandemNodes = {};
      state.highlyRatedTandemNodes = {};

      // Rerender
      state.identityStatsSignature = {};
      state.inputStatsSignature = {};
    },

    // Rerender
    forceIdentityStatsSignatureRerender: (
      state: IdentityStatsState,
      action: ForceIdentityStatsRerenderAction,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.identityStatsSignature = {};
    },
    forceInputStatsSignatureRerender: (
      state: IdentityStatsState,
      action: ForceInputStatsRerenderAction,
    ) => {
      state.inputStatsSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
const {
  // Stats
  setIdentityNodes,
  setNodeStats,
  setCollectivelyTandemNode,
  setSinglyTandemNodes,
  setHighlyRatedTandemNodes,

  setFreshness,
  setAnalyzedSliceName,
} = identityStatsSlice.actions;
const {resetNodesAndStats} = identityStatsSlice.actions;
export const {
  // Input
  setSearchNodeIdInput,
  setNodeIdInput,

  // Rerender
  forceIdentityStatsSignatureRerender,
  forceInputStatsSignatureRerender,
} = identityStatsSlice.actions;

export default identityStatsSlice.reducer;
