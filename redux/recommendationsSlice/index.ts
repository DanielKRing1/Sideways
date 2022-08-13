import { combineReducers } from 'redux';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// INITIAL STATE

export interface RecommendationsState {
  recommendationSliceOutput: string;
  recommendationsInputNodeIds: string[];

  recommendationsSignature: {};
};

const initialState: RecommendationsState = {
  recommendationSliceOutput: '',
  recommendationsInputNodeIds: [],

  recommendationsSignature: {},
};

// ACTION TYPES

type ForceRecommendationsRerenderAction = PayloadAction<undefined>;
type SetRecommendationSliceOuputAction = PayloadAction<string>;
type SetRecommendationInputNodeIds = PayloadAction<string[]>;
type AddRecommendationInputNodeId = PayloadAction<string>;
type RemoveRecommendationInputNodeId = PayloadAction<number>;

// SLICE

export const recommendationsSlice = createSlice({
  name: 'recommendationsSlice',
  initialState,
  reducers: {
    setRecommendationSliceOutput: (state: RecommendationsState, action: SetRecommendationSliceOuputAction) => {
      state.recommendationSliceOutput = action.payload;
    },
    setRecommendationInputNodeIds: (state: RecommendationsState, action: SetRecommendationInputNodeIds) => {
      state.recommendationsInputNodeIds = action.payload;
    },
    addRecommendationInputNodeId: (state: RecommendationsState, action: AddRecommendationInputNodeId) => {
      state.recommendationsInputNodeIds = [ ...state.recommendationsInputNodeIds, action.payload ];
    },
    removeRecommendationInputNodeId: (state: RecommendationsState, action: RemoveRecommendationInputNodeId) => {
      state.recommendationsInputNodeIds = [ ...state.recommendationsInputNodeIds.splice(action.payload, 1) ];
    },
    forceSignatureRerender: (state: RecommendationsState, action: ForceRecommendationsRerenderAction) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // 1. Update the ratings
      state.recommendationsSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRecommendationSliceOutput, setRecommendationInputNodeIds, addRecommendationInputNodeId, removeRecommendationInputNodeId, forceSignatureRerender } = recommendationsSlice.actions;


export default recommendationsSlice.reducer;
