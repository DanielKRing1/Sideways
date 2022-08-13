import { combineReducers } from 'redux';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import readGraphReducer, { setInputSelections, setOutputSelections, forceSignatureRerender as _forceGraphRerender } from './readGraph';
import readStackReducer, { setStartDate, forceSignatureRerender as _forceStackRerender } from './readStack';
import { ThunkConfig } from '../types';

// INITIAL STATE

export interface ReadSSState {
  activeSliceName: string;
  searchedSliceName: string;

  readSSSignature: {};
};

const initialState: ReadSSState = {
  activeSliceName: '',
  searchedSliceName: '',

  readSSSignature: {},
};

// ACTION TYPES

type ForceRatingsRerenderAction = PayloadAction<undefined>;
type SetActiveSliceAction = PayloadAction<string>;
type SetSearchedSliceAction = PayloadAction<string>;

// SLICE

export const readSS = createSlice({
  name: 'readSS',
  initialState,
  reducers: {
    setActiveSliceName: (state: ReadSSState, action: SetActiveSliceAction) => {
      state.activeSliceName = action.payload;
    },
    setSearchedSliceName: (state: ReadSSState, action: SetSearchedSliceAction) => {
      state.searchedSliceName = action.payload;
    },
    forceSignatureRerender: (state: ReadSSState, action: ForceRatingsRerenderAction) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // 1. Update the ratings
      state.readSSSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { forceSignatureRerender, setActiveSliceName, setSearchedSliceName } = readSS.actions;

const internalReadReducer = combineReducers({
  readGraphReducer,
  readStackReducer,
});

export default combineReducers({
  toplevelReadReducer: readSS.reducer,
  internalReadReducer,
});
