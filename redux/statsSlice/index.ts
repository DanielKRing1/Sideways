import { RankedNode } from '@asianpersonn/realm-graph';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import dbDriver from '../../database/dbDriver';
import recommendationsDriver from '../../database/recommendationsDriver';
import { GetNodeStatsArgs, GetNodeStatsByOutputArgs, GetRecommendationsArgs, HiLoRanking, HiLoRankingByOutput, OUTPUT_KEYS, PageRankArgs, SidewaysSnapshotRow } from '../../database/types';
import { forceSignatureRerender } from '../createSidewaysSlice';
import { ThunkConfig } from '../types';

// INITIAL STATE

export interface StatsState {
  searchedStatsInput: string;
  statsInput: string;

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
  searchedStatsInput: '',
  statsInput: '',

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
type SetSearchedStatsInputAction = PayloadAction<string>;
type SetStatsInputAction = PayloadAction<string>;
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
    setSearchStatsInput: (state: StatsState, action: SetSearchedStatsInputAction) => {
      state.searchedStatsInput = action.payload;
    },
    setStatsInput: (state: StatsState, action: SetStatsInputAction) => {
      state.statsInput = action.payload;
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
  setSearchStatsInput,
  setStatsInput,

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
