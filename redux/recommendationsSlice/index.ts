import { combineReducers } from 'redux';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GrowingIdText as RecoInput } from '../../components/Input/GrowingIdList';
export type { GrowingIdText as RecoInput } from '../../components/Input/GrowingIdList';

// INITIAL STATE

export interface RecommendationsState {
  recommendationSliceOutput: string;
  recommendationInputs: RecoInput[];

  recommendationsSignature: {};
};

const initialState: RecommendationsState = {
  recommendationSliceOutput: '',
  recommendationInputs: [],

  recommendationsSignature: {},
};

// ACTION TYPES

type ForceRecommendationsRerenderAction = PayloadAction<undefined>;
type SetRecommendationSliceOuputAction = PayloadAction<string>;
type SetRecommendationInputs = PayloadAction<RecoInput[]>;
type AddRecommendationInput = PayloadAction<RecoInput>;
type RemoveRecommendationInput = PayloadAction<number>;

// SLICE

export const recommendationsSlice = createSlice({
  name: 'recommendationsSlice',
  initialState,
  reducers: {
    setRecommendationSliceOutput: (state: RecommendationsState, action: SetRecommendationSliceOuputAction) => {
      state.recommendationSliceOutput = action.payload;
    },
    setRecommendationInputs: (state: RecommendationsState, action: SetRecommendationInputs) => {
      state.recommendationInputs = action.payload;
    },
    addRecommendationInput: (state: RecommendationsState, action: AddRecommendationInput) => {
      state.recommendationInputs = [ ...state.recommendationInputs, action.payload ];
    },
    removeRecommendationInput: (state: RecommendationsState, action: RemoveRecommendationInput) => {
      state.recommendationInputs = [ ...state.recommendationInputs.splice(action.payload, 1) ];
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
export const { setRecommendationSliceOutput, setRecommendationInputs, addRecommendationInput, removeRecommendationInput, forceSignatureRerender } = recommendationsSlice.actions;


export default recommendationsSlice.reducer;
