import { RankedNode } from '@asianpersonn/realm-graph';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import dbDriver from '../../database/dbDriver';
import recommendationsDriver from '../../database/recommendationsDriver';
import { GetNodeStatsArgs, GetNodeStatsByOutputArgs, GetRecommendationsArgs, HiLoRanking, HiLoRankingByOutput, OUTPUT_KEYS, PageRankArgs, SidewaysSnapshotRow } from '../../database/types';
import { forceSignatureRerender } from '../createSidewaysSlice';
import { ThunkConfig } from '../types';

// INITIAL STATE

export interface StatsState {
  searchedNodeIdInput: string;
  nodeIdInput: string;
  listLength: number;

  // Identity Stats
  identityNodes: HiLoRankingByOutput,
  // Tandem Stats
  nodeStats: RankedNode | undefined,
  collectivelyTandemNodes: HiLoRanking,
  singlyTandemNodes: HiLoRankingByOutput,
  highlyRatedTandemNodes: HiLoRankingByOutput,
  // Recommendations
  recommendations: RankedNode[],

  identityStatsSignature: {};
  inputStatsSignature: {};
  recommendationsSignature: {};
};

const initialState: StatsState = {
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
  // RECOMMENDATIONS
  recommendations: [],

  // RERENDER
  identityStatsSignature: {},
  inputStatsSignature: {},
  recommendationsSignature: {},
};

// THUNKS

// Identity Stats

export const startGetIdentityNodes = createAsyncThunk<
  boolean,
  PageRankArgs,
  ThunkConfig
>(
  'statsSS/startGetIdentityNodes',
  async ({ graphName, possibleOutputs, listLength, outputType, iterations, dampingFactor }: PageRankArgs, thunkAPI) => {
    const hiLoRankings: HiLoRankingByOutput = recommendationsDriver.pageRank({ graphName, possibleOutputs, listLength, outputType, iterations, dampingFactor });

    thunkAPI.dispatch(setIdentityNodes(hiLoRankings));
    thunkAPI.dispatch(forceIdentityStatsSignatureRerender());

    return true;
  }
);

// Input Stats

type StartSetNodeIdInputArgs = string;
export const startSetNodeIdInput = createAsyncThunk<
  boolean,
  StartSetNodeIdInputArgs,
  ThunkConfig
>(
  'statsSS/startGetNodeStats',
  async (nodeIdInput: StartSetNodeIdInputArgs, thunkAPI) => {
    // 1. Set node id input
    thunkAPI.dispatch(setNodeIdInput(nodeIdInput));

    // 2. Get state
    const activeSliceName: string = thunkAPI.getState().readSidewaysSlice.toplevelReadReducer.activeSliceName;
    const listLength: number = thunkAPI.getState().statsSlice.listLength;
    const rawOutputs: string[] = dbDriver.getSlicePropertyNames(activeSliceName);

    // 3. Dispatch stats thunks
    const p1: Promise<any> = thunkAPI.dispatch(startGetNodeStats({ graphName: activeSliceName, nodeId: nodeIdInput, rawOutputs: dbDriver.getSlicePropertyNames(activeSliceName) }));
    const p2: Promise<any> = thunkAPI.dispatch(startGetCollectivelyTandemNodes({ graphName: activeSliceName, nodeId: nodeIdInput, rawOutputs, listLength }));
    const p3: Promise<any> = thunkAPI.dispatch(startGetSinglyTandemNodes({ graphName: activeSliceName, nodeId: nodeIdInput, rawOutputs, listLength }));
    const p4: Promise<any> = thunkAPI.dispatch(startGetHighlyRatedTandemNodes({ graphName: activeSliceName, nodeId: nodeIdInput, rawOutputs, listLength }));

    // 4. Await promises
    await Promise.all([ p1, p2, p3, p4 ]);

    // 5. Dispatch rerender
    thunkAPI.dispatch(forceInputStatsSignatureRerender());

    return true;
  }
);

export const startGetNodeStats = createAsyncThunk<
  boolean,
  GetNodeStatsArgs,
  ThunkConfig
>(
  'statsSS/startGetNodeStats',
  async ({ graphName, nodeId, rawOutputs }: GetNodeStatsArgs, thunkAPI) => {
    const nodeStats: RankedNode | undefined = recommendationsDriver.getNodeStats({ graphName, nodeId, rawOutputs });
    if(nodeStats === undefined) return false;

    thunkAPI.dispatch(setNodeStats(nodeStats));
    thunkAPI.dispatch(forceInputStatsSignatureRerender());

    return true;
  }
);
export const startGetCollectivelyTandemNodes = createAsyncThunk<
  boolean,
  GetNodeStatsByOutputArgs,
  ThunkConfig
>(
  'statsSS/startGetCollectivelyTandemNodes',
  async ({ graphName, nodeId, rawOutputs, listLength }: GetNodeStatsByOutputArgs, thunkAPI) => {
    const hiLoRankings: HiLoRanking = await recommendationsDriver.getCollectivelyTandemNodes({ graphName, nodeId, rawOutputs, listLength });

    thunkAPI.dispatch(setCollectivelyTandemNode(hiLoRankings));
    thunkAPI.dispatch(forceInputStatsSignatureRerender());

    return true;
  }
);
export const startGetSinglyTandemNodes = createAsyncThunk<
  boolean,
  GetNodeStatsByOutputArgs,
  ThunkConfig
>(
  'statsSS/startGetSinglyTandemNodes',
  async ({ graphName, nodeId, rawOutputs, listLength }: GetNodeStatsByOutputArgs, thunkAPI) => {
    const hiLoRankings: HiLoRankingByOutput = await recommendationsDriver.getSinglyTandemNodes({ graphName, nodeId, rawOutputs, listLength });

    thunkAPI.dispatch(setSinglyTandemNodes(hiLoRankings));
    thunkAPI.dispatch(forceInputStatsSignatureRerender());

    return true;
  }
);
export const startGetHighlyRatedTandemNodes = createAsyncThunk<
  boolean,
  GetNodeStatsByOutputArgs,
  ThunkConfig
>(
  'statsSS/startGetHighlyRatedTandemNodes',
  async ({ graphName, nodeId, rawOutputs, listLength }: GetNodeStatsByOutputArgs, thunkAPI) => {
    const hiLoRankings: HiLoRankingByOutput = await recommendationsDriver.getHighlyRatedTandemNodes({ graphName, nodeId, rawOutputs, listLength });

    thunkAPI.dispatch(setHighlyRatedTandemNodes(hiLoRankings));
    thunkAPI.dispatch(forceInputStatsSignatureRerender());

    return true;
  }
);

// Recommendations

export const startGetRecommendations = createAsyncThunk<
  boolean,
  GetRecommendationsArgs,
  ThunkConfig
>(
  'statsSS/startGetRecommendations',
  async ({ graphName, targetOutput, inputNodeIds, iterations, dampingFactor }: GetRecommendationsArgs, thunkAPI) => {
    const recommendations: RankedNode[] = recommendationsDriver.getRecommendations({ graphName, targetOutput, inputNodeIds, outputType: OUTPUT_KEYS.SINGLE, iterations, dampingFactor });

    thunkAPI.dispatch(setRecommendations(recommendations));
    thunkAPI.dispatch(forceRecommendationsSignatureRerender());

    return true;
  }
);

// ACTION TYPES

// Input
type SetSearchedNodeIdInputAction = PayloadAction<string>;
type SetNodeIdInputAction = PayloadAction<string>;
type SetListLengthAction = PayloadAction<number>;
// Recommendations
type SetIdentityNodesAction = PayloadAction<HiLoRankingByOutput>;
type SetNodeStatsAction = PayloadAction<RankedNode>;
type SetCollectivelyTandemNodesAction = PayloadAction<HiLoRanking>;
type SetSinglyTandemNodesAction = PayloadAction<HiLoRankingByOutput>;
type SetHighlyRatedTandemNodesAction = PayloadAction<HiLoRankingByOutput>;
type SetRecommendationsAction = PayloadAction<RankedNode[]>;
// Rerender
type ForceIdentityStatsRerenderAction = PayloadAction<undefined>;
type ForceInputStatsRerenderAction = PayloadAction<undefined>;
type ForceRecommendationsRerenderAction = PayloadAction<undefined>;

// SLICE

export const statsSlice = createSlice({
  name: 'statsSlice',
  initialState,
  reducers: {
    // Inputs
    setSearchNodeIdInput: (state: StatsState, action: SetSearchedNodeIdInputAction) => {
      state.searchedNodeIdInput = action.payload;
    },
    setNodeIdInput: (state: StatsState, action: SetNodeIdInputAction) => {
      state.nodeIdInput = action.payload;
    },
    setListLength: (state: StatsState, action: SetListLengthAction) => {
      state.listLength = action.payload;
    },

    // Recommendations
    setIdentityNodes: (state: StatsState, action: SetIdentityNodesAction) => {
      state.identityNodes = action.payload;
    },
    setNodeStats: (state: StatsState, action: SetNodeStatsAction) => {
      state.nodeStats = action.payload;
    },
    setCollectivelyTandemNode: (state: StatsState, action: SetCollectivelyTandemNodesAction) => {
      state.collectivelyTandemNodes = action.payload;
    },
    setSinglyTandemNodes: (state: StatsState, action: SetSinglyTandemNodesAction) => {
      state.singlyTandemNodes = action.payload;
    },
    setHighlyRatedTandemNodes: (state: StatsState, action: SetHighlyRatedTandemNodesAction) => {
      state.highlyRatedTandemNodes = action.payload;
    },
    setRecommendations: (state: StatsState, action: SetRecommendationsAction) => {
      state.recommendations = action.payload;
    },

    // Rerender
    forceIdentityStatsSignatureRerender: (state: StatsState, action: ForceIdentityStatsRerenderAction) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.identityStatsSignature = {};
    },
    forceInputStatsSignatureRerender: (state: StatsState, action: ForceInputStatsRerenderAction) => {
      state.inputStatsSignature = {};
    },
    forceRecommendationsSignatureRerender: (state: StatsState, action: ForceRecommendationsRerenderAction) => {
      state.recommendationsSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  // Input
  setSearchNodeIdInput,
  setNodeIdInput,

  // Stats
  setIdentityNodes,
  setNodeStats,
  setCollectivelyTandemNode,
  setSinglyTandemNodes,
  setHighlyRatedTandemNodes,
  // Recommendations
  setRecommendations,

  // Rerender
  forceIdentityStatsSignatureRerender,
  forceInputStatsSignatureRerender,
  forceRecommendationsSignatureRerender,
} = statsSlice.actions;


export default statsSlice.reducer;
