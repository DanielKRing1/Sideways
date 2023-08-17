import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {ThunkConfig} from 'ssRedux/types';
import dbDriver from 'ssDatabase/api/core/dbDriver';
import {CGNode} from '@asianpersonn/realm-graph';
import {stripNodePostfix} from 'ssDatabase/api/types';
import {rmDuplicates} from 'ssUtils/list';

// INITIAL STATE

export interface ReadSSState {
  allDbInputs: string[];
  allDbOutputs: string[];
}

const initialState: ReadSSState = {
  allDbInputs: [],
  allDbOutputs: [],
};

// THUNKS

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

type SetAllOutputsAction = PayloadAction<string[]>;
type SetAllInputsAction = PayloadAction<string[]>;

// SLICE

export const readSS = createSlice({
  name: 'readSS',
  initialState,
  reducers: {
    // ALL IN/OUTPUT
    setAllDbInputs: (state: ReadSSState, action: SetAllInputsAction) => {
      state.allDbInputs = action.payload;
    },
    setAllDbOutputs: (state: ReadSSState, action: SetAllOutputsAction) => {
      state.allDbOutputs = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {} = readSS.actions;
const {setAllDbInputs, setAllDbOutputs} = readSS.actions;

export default readSS.reducer;
