import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {GrowingIdItem} from 'ssComponents/Input/GrowingIdList';
export type RecoInput = GrowingIdItem<NODE_ID_COMPONENTS>;
import recommendationsDriver from 'ssDatabase/api/analytics/recommendation/recommendationStatsDriver';
import {GetRecommendationsArgs} from 'ssDatabase/api/analytics/recommendation/types';
import {
  HiLoRankingByOutput,
  GRAPH_PROP_KEYS,
  NODE_ID_COMPONENTS,
  addNodePostfix,
} from 'ssDatabase/api/types';
import {ThunkConfig} from '../../ssRedux/types';

// INITIAL STATE

export interface RecommendationsState {
  searchInput: string;
  recommendationInputs: RecoInput[];
  recommendations: HiLoRankingByOutput;
}

const initialState: RecommendationsState = {
  searchInput: '',
  recommendationInputs: [],
  recommendations: {},
};

// THUNKS

type StartGetRecommendationsArgs = Omit<
  GetRecommendationsArgs,
  | 'activeSliceName'
  | 'listLength'
  | 'rawOutputs'
  | 'outputType'
  | 'graphName'
  | 'inputNodeIds'
>;
export const startComputeRecommendations = createAsyncThunk<
  boolean,
  StartGetRecommendationsArgs,
  ThunkConfig
>(
  'recommendationStatsSS/startComputeRecommendations',
  async (
    {graphType, iterations, dampingFactor}: StartGetRecommendationsArgs,
    thunkAPI,
  ) => {
    const {activeSliceName} = thunkAPI.getState().appState.activeJournal;
    const {allDbOutputs} = thunkAPI.getState().fetched.cachedInputsOutputs;

    const inputNodeFullIds: string[] = thunkAPI
      .getState()
      .analytics.recommendationsStats.recommendationInputs.map(
        (input: GrowingIdItem<NODE_ID_COMPONENTS>) =>
          addNodePostfix(input.item.id, input.item.postfix),
      );

    const recommendations: HiLoRankingByOutput =
      recommendationsDriver.getRecommendations({
        activeSliceName,
        graphType,
        inputNodeIds: inputNodeFullIds,
        rawOutputs: allDbOutputs,
        outputType: GRAPH_PROP_KEYS.SINGLE,
        listLength: 5,
        iterations,
        dampingFactor,
      });

    thunkAPI.dispatch(setRecommendations(recommendations));

    return true;
  },
);

// ACTION TYPES

// Input
type EditSearchInput = PayloadAction<string>;
type SetRecommendationInputs = PayloadAction<RecoInput[]>;
type EditRecommendationInputs = PayloadAction<{
  index: number;
  input: RecoInput;
}>;
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
    editSearchInput: (state: RecommendationsState, action: EditSearchInput) => {
      state.searchInput = action.payload;
    },
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
      state.recommendationInputs.push(action.payload);

      // Reset
      state.searchInput = '';
    },
    editRecommendationInput: (
      state: RecommendationsState,
      action: EditRecommendationInputs,
    ) => {
      state.recommendationInputs[action.payload.index] = action.payload.input;
    },
    removeRecommendationInput: (
      state: RecommendationsState,
      action: RemoveRecommendationInput,
    ) => {
      state.recommendationInputs.splice(action.payload, 1);
    },
    setRecommendations: (
      state: RecommendationsState,
      action: SetRecommendationsAction,
    ) => {
      state.recommendations = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
const {setRecommendations} = recommendationStatsSlice.actions;
export const {
  editSearchInput,
  setRecommendationInputs,
  addRecommendationInput,
  editRecommendationInput,
  removeRecommendationInput,
} = recommendationStatsSlice.actions;

export default recommendationStatsSlice.reducer;
