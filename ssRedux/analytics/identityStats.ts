import {RankedNode} from '@asianpersonn/realm-graph';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import recommendationsDriver from 'ssDatabase/api/analytics/recommendation/recommendationStatsDriver';
import identityDriver from 'ssDatabase/api/analytics/identity/identityStatsDriver';
import {
  HiLoRanking,
  HiLoRankingByOutput,
  GraphPropType,
  GRAPH_PROP_KEYS,
  NODE_POSTFIX,
  GOOD_POSTFIX,
  addNodePostfix,
} from 'ssDatabase/api/types';
import {ThunkConfig} from '../../ssRedux/types';
import {
  GetNodeStatsArgs,
  GetNodeStatsByOutputArgs,
} from 'ssDatabase/api/analytics/identity/types';
import {GraphType} from 'ssDatabase/api/core/types';
import {TimerMan} from 'ssUtils/timer';

// INITIAL STATE

export interface IdentityStatsState {
  analyzedSliceName: string;
  isFresh: boolean;

  typingNodeIdInput: string;
  nodeIdInput: string;
  goodOrBad: NODE_POSTFIX;
  listLength: number;

  // Identity Stats
  identityNodes: HiLoRankingByOutput;
  // Tandem Stats
  nodeStats: RankedNode | undefined;
  collectivelyTandemNodes: HiLoRanking;
  singlyTandemNodes: HiLoRankingByOutput;
  highlyRatedTandemNodes: HiLoRankingByOutput;
}

const initialState: IdentityStatsState = {
  // FRESHNESS
  analyzedSliceName: '',
  isFresh: false,

  // INPUTS
  typingNodeIdInput: '',
  nodeIdInput: '',
  goodOrBad: GOOD_POSTFIX,
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
};

// THUNKS

// Freshness
export const startAssureFreshness = createAsyncThunk<
  boolean,
  undefined,
  ThunkConfig
>('identityStatsSS/startAssureFreshness', async (undef, thunkAPI) => {
  const activeSliceName: string =
    thunkAPI.getState().appState.activeJournal.activeSliceName;
  const {analyzedSliceName, isFresh, nodeIdInput, goodOrBad} =
    thunkAPI.getState().analytics.identityStats;

  console.log('START ASSURE FRESHNESS');
  console.log(activeSliceName);
  console.log(analyzedSliceName);

  TimerMan.getTimer('startAssureFreshness').restart();

  // 1. 'activeSliceName' changed
  if (activeSliceName !== analyzedSliceName) {
    // Recompute identityNodes + reset stats bcus inputNode is now unknown
    thunkAPI.dispatch(resetNodesAndStats());
    thunkAPI.dispatch(startComputeIdentityNodes());

    TimerMan.getTimer('startAssureFreshness').logInterval(
      'startAssureFreshness end 1-----------------: ',
    );
  }
  // 2. Freshness changed (rate, undo rate, ...)
  else if (!isFresh) {
    // Recompute identityNodes + Recompute inputNode stats + Rerender identity and input stats
    thunkAPI.dispatch(startComputeIdentityNodes());
    // TODO: Assure freshness only updates Input and not Category GraphType analytics for now
    thunkAPI.dispatch(
      startSetNodeIdInput({nodeIdInput, goodOrBad, graphType: GraphType.Input}),
    );

    TimerMan.getTimer('startAssureFreshness').logInterval(
      'startAssureFreshness end2-----------------: ',
    );
  }

  // 3. Is now fresh
  if (activeSliceName !== analyzedSliceName) {
    thunkAPI.dispatch(setAnalyzedSliceName(activeSliceName));
  }
  if (!isFresh) {
    thunkAPI.dispatch(markNodeStatsFresh());
  }

  return true;
});

// Identity Stats

/**
 * Execute when Active Slice changes
 */
const startComputeIdentityNodes = createAsyncThunk<
  boolean,
  undefined,
  ThunkConfig
>('identityStatsSS/startComputeIdentityNodes', async (undef, thunkAPI) => {
  console.log('in startComputeIdentityNodes-------------------');
  const {activeSliceName} = thunkAPI.getState().appState.activeJournal;
  const {allDbOutputs} = thunkAPI.getState().fetched.cachedInputsOutputs;

  const listLength: number = 5;
  const outputType: GraphPropType = GRAPH_PROP_KEYS.SINGLE;
  const iterations: number = 20;
  const dampingFactor: number = 0.85;

  console.log('startComputeIdentityNodes------------------- 1');
  const hiLoRankings: HiLoRankingByOutput = recommendationsDriver.pageRank({
    activeSliceName,
    graphType: GraphType.Input,
    rawOutputs: allDbOutputs,
    listLength,
    outputType,
    iterations,
    dampingFactor,
  });
  console.log('startComputeIdentityNodes------------------- 2');

  console.log(hiLoRankings);

  thunkAPI.dispatch(setIdentityNodes(hiLoRankings));

  return true;
});

// Input Stats

/**
 * Execute when Input Node or Freshness (rate, unrate, etc) change
 */
type StartSetNodeIdInputArgs = {
  nodeIdInput: string;
  goodOrBad: NODE_POSTFIX;
  graphType: GraphType;
};
export const startSetNodeIdInput = createAsyncThunk<
  boolean,
  StartSetNodeIdInputArgs,
  ThunkConfig
>(
  'identityStatsSS/startSetNodeStats',
  async (
    {nodeIdInput, goodOrBad, graphType}: StartSetNodeIdInputArgs,
    thunkAPI,
  ) => {
    try {
      // 1. Set node id input
      thunkAPI.dispatch(setNodeIdInput(nodeIdInput));

      // 2. Get state
      const {activeSliceName} = thunkAPI.getState().appState.activeJournal;
      const {allDbOutputs} = thunkAPI.getState().fetched.cachedInputsOutputs;
      const listLength: number =
        thunkAPI.getState().analytics.identityStats.listLength;

      // 3. Dispatch stats thunks
      TimerMan.getTimer('startComputeNodeStats').restart();
      const p1: Promise<any> = thunkAPI.dispatch(
        startComputeNodeStats({
          activeSliceName,
          graphType,
          nodeId: addNodePostfix(nodeIdInput, goodOrBad),
          rawOutputs: allDbOutputs,
        }),
      );
      TimerMan.getTimer('startComputeNodeStats').logInterval(
        'startComputeNodeStats end: ----------------------------------1: ',
      );

      TimerMan.getTimer('startComputeCollectivelyTandemNodes').restart();
      const p2: Promise<any> = thunkAPI.dispatch(
        startComputeCollectivelyTandemNodes({
          activeSliceName,
          graphType,
          nodeId: addNodePostfix(nodeIdInput, goodOrBad),
          rawOutputs: allDbOutputs,
          listLength,
        }),
      );
      TimerMan.getTimer('startComputeCollectivelyTandemNodes').logInterval(
        'startComputeCollectivelyTandemNodes end: ----------------------------------2: ',
      );

      TimerMan.getTimer('startComputeSinglyTandemNodes').restart();
      const p3: Promise<any> = thunkAPI.dispatch(
        startComputeSinglyTandemNodes({
          activeSliceName,
          graphType,
          nodeId: addNodePostfix(nodeIdInput, goodOrBad),
          rawOutputs: allDbOutputs,
          listLength,
        }),
      );
      TimerMan.getTimer('startComputeSinglyTandemNodes').logInterval(
        'startComputeSinglyTandemNodes end: ----------------------------------3: ',
      );

      TimerMan.getTimer('startComputeHighlyRatedTandemNodes').restart();
      const p4: Promise<any> = thunkAPI.dispatch(
        startComputeHighlyRatedTandemNodes({
          activeSliceName,
          graphType,
          nodeId: addNodePostfix(nodeIdInput, goodOrBad),
          rawOutputs: allDbOutputs,
          listLength,
        }),
      );
      TimerMan.getTimer('startComputeHighlyRatedTandemNodes').logInterval(
        'startComputeHighlyRatedTandemNodes end: ----------------------------------4: ',
      );

      // 4. Await promises
      TimerMan.getTimer('startSetNodeStats').restart();
      await Promise.all([p1, p2, p3, p4]);
      TimerMan.getTimer('startSetNodeStats').logInterval(
        'startSetNodeStats end-------------------: ',
      );
    } catch (err) {
      console.log(err);
    }
    return true;
  },
);

const startComputeNodeStats = createAsyncThunk<
  boolean,
  GetNodeStatsArgs,
  ThunkConfig
>(
  'identityStatsSS/startComputeNodeStats',
  async (
    {activeSliceName, graphType, nodeId, rawOutputs}: GetNodeStatsArgs,
    thunkAPI,
  ) => {
    const nodeStats: RankedNode | undefined = identityDriver.getNodeStats({
      activeSliceName,
      graphType,
      nodeId,
      rawOutputs,
    });
    if (nodeStats === undefined) {
      return false;
    }

    thunkAPI.dispatch(setNodeStats(nodeStats));

    return true;
  },
);
const startComputeCollectivelyTandemNodes = createAsyncThunk<
  boolean,
  GetNodeStatsByOutputArgs,
  ThunkConfig
>(
  'identityStatsSS/startComputeCollectivelyTandemNodes',
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
    console.log(
      'GET COLLECTIVELY TANDEM NODES--------------------------------',
    );
    try {
      TimerMan.getTimer('startComputeCollectivelyTandemNodes action').restart();
      const hiLoRankings: HiLoRanking =
        await identityDriver.getCollectivelyTandemNodes({
          activeSliceName,
          graphType,
          nodeId,
          rawOutputs,
          listLength,
        });

      thunkAPI.dispatch(setCollectivelyTandemNode(hiLoRankings));
      TimerMan.getTimer(
        'startComputeCollectivelyTandemNodes action',
      ).logInterval(
        'startComputeCollectivelyTandemNodes action end: ----------------------------------4: ',
      );
    } catch (err) {
      console.log(err);
    }

    return true;
  },
);
const startComputeSinglyTandemNodes = createAsyncThunk<
  boolean,
  GetNodeStatsByOutputArgs,
  ThunkConfig
>(
  'identityStatsSS/startComputeSinglyTandemNodes',
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
    const hiLoRankings: HiLoRankingByOutput =
      await identityDriver.getSinglyTandemNodes({
        activeSliceName,
        graphType,
        nodeId,
        rawOutputs,
        listLength,
      });

    thunkAPI.dispatch(setSinglyTandemNodes(hiLoRankings));

    return true;
  },
);
const startComputeHighlyRatedTandemNodes = createAsyncThunk<
  boolean,
  GetNodeStatsByOutputArgs,
  ThunkConfig
>(
  'identityStatsSS/startComputeHighlyRatedTandemNodes',
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
    const hiLoRankings: HiLoRankingByOutput =
      await identityDriver.getHighlyRatedTandemNodes({
        activeSliceName,
        graphType,
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

// SLICE

export const identityStatsSlice = createSlice({
  name: 'identityStatsSlice',
  initialState,
  reducers: {
    // FRESHNESS
    setFreshness: (state: IdentityStatsState, action: SetFreshnessAction) => {
      state.isFresh = action.payload;
    },
    markNodeStatsFresh: (state: IdentityStatsState) => {
      if (state.isFresh !== true) {
        state.isFresh = true;
      }
    },
    markNodeStatsUnfresh: (state: IdentityStatsState) => {
      if (state.isFresh !== false) {
        state.isFresh = false;
      }
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
      state.typingNodeIdInput = action.payload;
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
      state.typingNodeIdInput = '';
      state.nodeIdInput = '';

      // Stats
      state.identityNodes = {};
      state.nodeStats = undefined;
      state.collectivelyTandemNodes = {highestRanked: [], lowestRanked: []};
      state.singlyTandemNodes = {};
      state.highlyRatedTandemNodes = {};
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

  // FRESHNESS
  markNodeStatsFresh,

  setAnalyzedSliceName,
} = identityStatsSlice.actions;
const {resetNodesAndStats} = identityStatsSlice.actions;
export const {
  // FRESHNESS
  markNodeStatsUnfresh,

  // Input
  setSearchNodeIdInput,
  setNodeIdInput,
} = identityStatsSlice.actions;

export default identityStatsSlice.reducer;
