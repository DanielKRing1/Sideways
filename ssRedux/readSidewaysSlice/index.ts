import {combineReducers} from 'redux';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import readGraphReducer, {
  forceSignatureRerender as _forceGraphRerender,
} from './readGraph';
import readStackReducer, {
  forceSignatureRerender as _forceStackRerender,
} from './readStack';
import {ThunkConfig} from 'ssRedux/types';
import dbDriver from 'ssDatabase/api/core/dbDriver';
import {CGNode} from '@asianpersonn/realm-graph';
import {NO_ACTIVE_SLICE_NAME} from 'ssDatabase/api/userJson/category/constants';
import {stripNodePostfix} from 'ssDatabase/api/types';
import {rmDuplicates} from 'ssUtils/list';

// INITIAL STATE

export interface ReadSSState {
  activeSliceName: string;
  searchedSliceName: string;

  allDbInputs: string[];
  allDbOutputs: string[];

  readSSSignature: {};
}

const initialState: ReadSSState = {
  activeSliceName: NO_ACTIVE_SLICE_NAME,
  searchedSliceName: '',

  allDbInputs: [],
  allDbOutputs: [],

  readSSSignature: {},
};

// THUNKS

export const startSetActiveSliceName = createAsyncThunk<
  boolean,
  string,
  ThunkConfig
>(
  'rateSS/startSetActiveSliceName',
  async (selectedActiveSliceName, thunkAPI) => {
    thunkAPI.dispatch(setActiveSliceName(selectedActiveSliceName));

    return true;
  },
);

// CALL THESE 2 THUNKS WHENEVER IN/OUTPUTS ARE ADDED/REMOVED FROM DB

// CALL THIS THUNK WHENEVER ACTIVE SLICE CHANGES
export const startCacheAllDbInputsOutputs = createAsyncThunk<
  boolean,
  undefined,
  ThunkConfig
>('rateSS/startCacheAllDbInputsOutputs', async (undef, thunkAPI) => {
  // 1. Inputs
  thunkAPI.dispatch(startCacheAllDbInputs());
  // 2. Outputs
  thunkAPI.dispatch(startCacheAllDbOutputs());

  return true;
});

// CALL THIS THUNK WHENEVER INPUTS ARE ADDED/REMOVED FROM DB
// (Un/do Rate)
export const startCacheAllDbInputs = createAsyncThunk<
  boolean,
  undefined,
  ThunkConfig
>('rateSS/startCacheAllDbInputs', async (undef, thunkAPI) => {
  const {activeSliceName} =
    thunkAPI.getState().readSidewaysSlice.toplevelReadReducer;

  // 1. Get all inputs
  const allDbInputs: string[] = rmDuplicates(
    dbDriver
      .getAllNodes(activeSliceName)
      .map((node: CGNode) => stripNodePostfix(node.id).id),
  );

  // 2. Set all inputs
  thunkAPI.dispatch(setAllDbInputs(allDbInputs));

  return true;
});
export const startCacheAllDbOutputs = createAsyncThunk<
  boolean,
  undefined,
  ThunkConfig
>('rateSS/startCacheAllDbOutputs', async (undef, thunkAPI) => {
  const {activeSliceName} =
    thunkAPI.getState().readSidewaysSlice.toplevelReadReducer;

  // 1. Get all outputs
  const allDbOutputs: string[] =
    dbDriver.getSlicePropertyNames(activeSliceName);

  // 2. Set all outputs
  thunkAPI.dispatch(setAllDbOutputs(allDbOutputs));

  return true;
});

// ACTION TYPES

type ForceRatingsRerenderAction = PayloadAction<undefined>;
type SetActiveSliceAction = PayloadAction<string>;
type SetSearchedSliceAction = PayloadAction<string>;
type SetAllOutputsAction = PayloadAction<string[]>;
type SetAllInputsAction = PayloadAction<string[]>;

// SLICE

export const readSS = createSlice({
  name: 'readSS',
  initialState,
  reducers: {
    // ACTIVE SLICE NAME
    setActiveSliceName: (state: ReadSSState, action: SetActiveSliceAction) => {
      state.activeSliceName = action.payload;
      state.searchedSliceName = '';
    },
    setSearchedSliceName: (
      state: ReadSSState,
      action: SetSearchedSliceAction,
    ) => {
      state.searchedSliceName = action.payload;
    },

    // ALL IN/OUTPUT
    setAllDbInputs: (state: ReadSSState, action: SetAllInputsAction) => {
      state.allDbInputs = action.payload;
    },
    setAllDbOutputs: (state: ReadSSState, action: SetAllOutputsAction) => {
      state.allDbOutputs = action.payload;
    },

    forceSignatureRerender: (
      state: ReadSSState,
      action: ForceRatingsRerenderAction,
    ) => {
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
export const {forceSignatureRerender, setSearchedSliceName} = readSS.actions;
const {setActiveSliceName, setAllDbInputs, setAllDbOutputs} = readSS.actions;

const internalReadReducer = combineReducers({
  readGraphReducer,
  readStackReducer,
});

export default combineReducers({
  toplevelReadReducer: readSS.reducer,
  internalReadReducer,
});
