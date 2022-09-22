import { combineReducers } from 'redux';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// INITIAL STATE

export interface StatsState {
  statsOutput: string;
  statsInput: string;

  statsSignature: {};
};

const initialState: StatsState = {
  statsInput: '',
  statsOutput: '',

  statsSignature: {},
};

// ACTION TYPES

type ForceStatsRerenderAction = PayloadAction<undefined>;
type SetStatsOutputAction = PayloadAction<string>;
type SetStatsInputAction = PayloadAction<string>;

// SLICE

export const statsSlice = createSlice({
  name: 'statsSlice',
  initialState,
  reducers: {
    setStatsInput: (state: StatsState, action: SetStatsInputAction) => {
      state.statsInput = action.payload;
    },
    setStatsOutput: (state: StatsState, action: SetStatsInputAction) => {
      state.statsOutput = action.payload;
    },
    forceSignatureRerender: (state: StatsState, action: ForceStatsRerenderAction) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // 1. Update the ratings
      state.statsSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setStatsInput, setStatsOutput, forceSignatureRerender } = statsSlice.actions;


export default statsSlice.reducer;
