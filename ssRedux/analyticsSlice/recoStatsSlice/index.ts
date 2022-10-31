import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {GrowingIdText as RecoInput} from 'ssComponents/Input/GrowingIdList';
export type {GrowingIdText as RecoInput} from 'ssComponents/Input/GrowingIdList';
import recommendationsDriver from 'ssDatabase/api/analytics/recommendation/recommendationStatsDriver';
import {GetRecommendationsArgs} from 'ssDatabase/api/analytics/recommendation/types';
import dbDriver from 'ssDatabase/api/core/dbDriver';
import {HiLoRankingByOutput, GRAPH_PROP_KEYS} from 'ssDatabase/api/types';
import {ThunkConfig} from '../../types';

// INITIAL STATE

export interface RecommendationsState {
  recommendationInputs: RecoInput[];
  recommendations: HiLoRankingByOutput;

  recommendationsSignature: {};
}

const initialState: RecommendationsState = {
  recommendationInputs: [],
  recommendations: {},

  recommendationsSignature: {},
};

// THUNKS

type StartGetRecommendationsArgs = Omit<
  GetRecommendationsArgs,
  'listLength' | 'rawOutputs' | 'outputType' | 'graphName' | 'inputNodeIds'
>;
export const startGetRecommendations = createAsyncThunk<
  boolean,
  StartGetRecommendationsArgs,
  ThunkConfig
>(
  'recommendationStatsSS/startGetRecommendations',
  async (
    {iterations, dampingFactor}: StartGetRecommendationsArgs,
    thunkAPI,
  ) => {
    const {activeSliceName, allDbOutputs} =
      thunkAPI.getState().readSidewaysSlice.toplevelReadReducer;
    const inputNodeIds: string[] = thunkAPI
      .getState()
      .analyticsSlice.recoStatsSlice.recommendationInputs.map(
        (inputs: RecoInput) => inputs.text,
      );

    const recommendations: HiLoRankingByOutput =
      recommendationsDriver.getRecommendations({
        graphName: activeSliceName,
        inputNodeIds,
        rawOutputs: allDbOutputs,
        outputType: GRAPH_PROP_KEYS.SINGLE,
        listLength: 5,
        iterations,
        dampingFactor,
      });

    thunkAPI.dispatch(setRecommendations(recommendations));
    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  },
);

// ACTION TYPES

// Input
type SetRecommendationInputs = PayloadAction<RecoInput[]>;
type AddRecommendationInput = PayloadAction<RecoInput>;
type RemoveRecommendationInput = PayloadAction<number>;
// Recommendations
type SetRecommendationsAction = PayloadAction<HiLoRankingByOutput>;
// Rerender
type ForceRecommendationsRerenderAction = PayloadAction<undefined>;

// SLICE

export const recommendationStatsSlice = createSlice({
  name: 'recommendationStatsSlice',
  initialState,
  reducers: {
    setRecommendationInputs: (
      state: RecommendationsState,
      action: SetRecommendationInputs,
    ) => {
      state.recommendationInputs = action.payload;
    },
    addRecommendationInput: (
      state: RecommendationsState,
      action: AddRecommendationInput,
    ) => {
      state.recommendationInputs = [
        ...state.recommendationInputs,
        action.payload,
      ];
    },
    removeRecommendationInput: (
      state: RecommendationsState,
      action: RemoveRecommendationInput,
    ) => {
      state.recommendationInputs = [
        ...state.recommendationInputs.splice(action.payload, 1),
      ];
    },
    setRecommendations: (
      state: RecommendationsState,
      action: SetRecommendationsAction,
    ) => {
      state.recommendations = action.payload;
    },
    forceSignatureRerender: (
      state: RecommendationsState,
      action: ForceRecommendationsRerenderAction,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.recommendationsSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
const {setRecommendations} = recommendationStatsSlice.actions;
export const {
  setRecommendationInputs,
  addRecommendationInput,
  removeRecommendationInput,
  forceSignatureRerender,
} = recommendationStatsSlice.actions;

export default recommendationStatsSlice.reducer;
