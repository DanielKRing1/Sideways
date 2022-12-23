import {RankedNode} from '@asianpersonn/realm-graph';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import recommendationsDriver from 'ssDatabase/api/analytics/recommendation/recommendationStatsDriver';
import identityDriver from 'ssDatabase/api/analytics/identity/identityStatsDriver';
import {
  HiLoRanking,
  HiLoRankingByOutput,
  GraphPropType,
  GRAPH_PROP_KEYS,
} from 'ssDatabase/api/types';
import {ThunkConfig} from '../../types';
import {
  GetNodeStatsArgs,
  GetNodeStatsByOutputArgs,
} from 'ssDatabase/api/analytics/identity/types';
import {GraphType} from 'ssDatabase/api/core/types';

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

  console.log('START ASSURE FRESHNESS');
  console.log(activeSliceName);
  console.log(analyzedSliceName);

  // 1. 'activeSliceName' changed
  if (activeSliceName !== analyzedSliceName) {
    // Recompute identityNodes + reset stats bcus inputNode is now unknown
    thunkAPI.dispatch(resetNodesAndStats());
    thunkAPI.dispatch(startGetIdentityNodes());
  }
  // 2. Freshness changed (rate, undo rate, ...)
  else if (!isFresh) {
    // Recompute identityNodes + Recompute inputNode stats + Rerender identity and input stats
    thunkAPI.dispatch(startGetIdentityNodes());
    const nodeIdInput: string =
      thunkAPI.getState().analyticsSlice.identityStatsSlice.nodeIdInput;
    // TODO: Assure freshness only updates Input and not Category GraphType analytics for now
    thunkAPI.dispatch(
      startSetNodeIdInput({nodeIdInput, graphType: GraphType.Input}),
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
    console.log('in startGetIdentityNodes-------------------');
    const {activeSliceName, allDbOutputs} =
      thunkAPI.getState().readSidewaysSlice.toplevelReadReducer;
    const listLength: number = 5;
    const outputType: GraphPropType = GRAPH_PROP_KEYS.SINGLE;
    const iterations: number = 20;
    const dampingFactor: number = 0.85;

    console.log('startGetIdentityNodes------------------- 1');
    const hiLoRankings: HiLoRankingByOutput = recommendationsDriver.pageRank({
      activeSliceName,
      graphType: GraphType.Input,
      rawOutputs: allDbOutputs,
      listLength,
      outputType,
      iterations,
      dampingFactor,
    });
    console.log('startGetIdentityNodes------------------- 2');

    console.log(hiLoRankings);

    thunkAPI.dispatch(setIdentityNodes(hiLoRankings));
    thunkAPI.dispatch(forceIdentityStatsSignatureRerender());

    return true;
  },
);

// Input Stats

type StartSetNodeIdInputArgs = {
  nodeIdInput: string;
  graphType: GraphType;
};
export const startSetNodeIdInput = createAsyncThunk<
  boolean,
  StartSetNodeIdInputArgs,
  ThunkConfig
>(
  'identityStatsSS/startSetNodeStats',
  async ({nodeIdInput, graphType}: StartSetNodeIdInputArgs, thunkAPI) => {
    // 1. Set node id input
    thunkAPI.dispatch(setNodeIdInput(nodeIdInput));

    // 2. Get state
    const {activeSliceName, allDbOutputs} =
      thunkAPI.getState().readSidewaysSlice.toplevelReadReducer;
    const listLength: number =
      thunkAPI.getState().analyticsSlice.identityStatsSlice.listLength;

    // 3. Dispatch stats thunks
    const p1: Promise<any> = thunkAPI.dispatch(
      startGetNodeStats({
        activeSliceName,
        graphType,
        nodeId: nodeIdInput,
        rawOutputs: allDbOutputs,
      }),
    );
    const p2: Promise<any> = thunkAPI.dispatch(
      startGetCollectivelyTandemNodes({
        activeSliceName,
        graphType,
        nodeId: nodeIdInput,
        rawOutputs: allDbOutputs,
        listLength,
      }),
    );
    const p3: Promise<any> = thunkAPI.dispatch(
      startGetSinglyTandemNodes({
        activeSliceName,
        graphType,
        nodeId: nodeIdInput,
        rawOutputs: allDbOutputs,
        listLength,
      }),
    );
    const p4: Promise<any> = thunkAPI.dispatch(
      startGetHighlyRatedTandemNodes({
        activeSliceName,
        graphType,
        nodeId: nodeIdInput,
        rawOutputs: allDbOutputs,
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
  async (
    {activeSliceName, graphType, nodeId, rawOutputs}: GetNodeStatsArgs,
    thunkAPI,
  ) => {
    const t0 = new Date().getTime();
    const nodeStats: RankedNode | undefined = identityDriver.getNodeStats({
      activeSliceName,
      graphType,
      nodeId,
      rawOutputs,
    });
    if (nodeStats === undefined) return false;

    thunkAPI.dispatch(setNodeStats(nodeStats));
    const t1 = new Date().getTime();
    console.log('startGetNodeStats');
    console.log('HEEEEERRRREEEEE-----------------------------');
    console.log(t1 - t0);

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
    {
      activeSliceName,
      graphType,
      nodeId,
      rawOutputs,
      listLength,
    }: GetNodeStatsByOutputArgs,
    thunkAPI,
  ) => {
    const t0 = new Date().getTime();
    const hiLoRankings: HiLoRanking =
      await identityDriver.getCollectivelyTandemNodes({
        activeSliceName,
        graphType,
        nodeId,
        rawOutputs,
        listLength,
      });

    thunkAPI.dispatch(setCollectivelyTandemNode(hiLoRankings));
    const t1 = new Date().getTime();
    console.log('startGetCollectivelyTandemNodes');
    console.log('HEEEEERRRREEEEE-----------------------------');
    console.log(t1 - t0);

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
    {
      activeSliceName,
      graphType,
      nodeId,
      rawOutputs,
      listLength,
    }: GetNodeStatsByOutputArgs,
    thunkAPI,
  ) => {
    const t0 = new Date().getTime();
    const hiLoRankings: HiLoRankingByOutput =
      await identityDriver.getSinglyTandemNodes({
        activeSliceName,
        graphType,
        nodeId,
        rawOutputs,
        listLength,
      });

    thunkAPI.dispatch(setSinglyTandemNodes(hiLoRankings));
    const t1 = new Date().getTime();
    console.log('startGetSinglyTandemNodes');
    console.log('HEEEEERRRREEEEE-----------------------------');
    console.log(t1 - t0);

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
    {
      activeSliceName,
      graphType,
      nodeId,
      rawOutputs,
      listLength,
    }: GetNodeStatsByOutputArgs,
    thunkAPI,
  ) => {
    const t0 = new Date().getTime();
    const hiLoRankings: HiLoRankingByOutput =
      await identityDriver.getHighlyRatedTandemNodes({
        activeSliceName,
        graphType,
        nodeId,
        rawOutputs,
        listLength,
      });

    thunkAPI.dispatch(setHighlyRatedTandemNodes(hiLoRankings));
    const t1 = new Date().getTime();
    console.log('startGetHighlyRatedTandemNodes');
    console.log('HEEEEERRRREEEEE-----------------------------');
    console.log(t1 - t0);

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
      console.log('setNodeInput');
      console.log(state.nodeIdInput);
      state.nodeIdInput = action.payload;
      console.log(state.nodeIdInput);
    },
    setListLength: (state: IdentityStatsState, action: SetListLengthAction) => {
      state.listLength = action.payload;
    },

    // Stats
    setIdentityNodes: (
      state: IdentityStatsState,
      action: SetIdentityNodesAction,
    ) => {
      console.log('Identity Nodes about to change');
      console.log(state.identityNodes);
      state.identityNodes = action.payload;
      console.log(state.identityNodes);
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
      console.log('RESET');
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
