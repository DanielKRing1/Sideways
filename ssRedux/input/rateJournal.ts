import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {GrowingIdItem} from 'ssComponents/Input/GrowingIdList';
export type RateInput = GrowingIdItem<NODE_ID_COMPONENTS & {category: string}>;
import DbDriver from 'ssDatabase/api/core/dbDriver';
import {GraphType} from 'ssDatabase/api/core/types';
import {ThunkConfig} from '../../ssRedux/types';
import {startCleanInputCategories} from 'ssRedux/fetched/userJson';
import {
  addNodePostfix,
  NODE_ID,
  NODE_ID_COMPONENTS,
} from 'ssDatabase/api/types';
import {startCacheAllDbInputsOutputs} from 'ssRedux/fetched/cachedInputsOutputs';
import {markNodeStatsUnfresh} from 'ssRedux/analytics/identityStats';
import {markTimeseriesStatsUnfresh} from 'ssRedux/analytics/timeseriesStats';

// INITIAL STATE

export interface RateSSState {
  // Current input
  typingInput: string;

  // Final values
  inputs: RateInput[];
  outputs: string[];
  rating: number;
}

const initialState: RateSSState = {
  // Current input
  typingInput: '',

  // Final values
  inputs: [],
  outputs: [],
  rating: 0,
};

// ASYNC THUNKS

export const startRate = createAsyncThunk<boolean, undefined, ThunkConfig>(
  'rateSS/startRate',
  async (undef, thunkAPI) => {
    const {activeSliceName} = thunkAPI.getState().appState.activeJournal;
    const {inputs, outputs, rating} = thunkAPI.getState().input.rateJournal;
    const {fullUserJsonMap} = thunkAPI.getState().fetched.userJson;

    const inputNames: NODE_ID[] = inputs.map(({item}) =>
      addNodePostfix(item.id, item.postfix),
    );
    const inputCategories: string[] = inputs.map(({item}) => item.category);

    // 1. Add to Stack
    DbDriver.push(activeSliceName, {
      inputs: inputNames,
      categories: inputCategories,
      outputs,
      rating,
    });

    // 2. Rate Graphs
    // Input Graph
    const inputGraphPromises: Promise<any>[] = outputs.map((output: string) =>
      DbDriver.rateGraph(
        activeSliceName,
        output,
        inputNames,
        rating,
        // TODO AUG 15, 2023: Make util method for getting rating weight
        new Array(inputs.length).fill(1 / inputs.length / outputs.length),
      ),
    );
    // Category Graph
    const categoryGraphPromises: Promise<any>[] = outputs.map(
      (output: string) =>
        DbDriver.rateGraph(
          activeSliceName,
          output,
          inputCategories,
          rating,
          new Array(inputs.length).fill(1 / inputs.length / outputs.length),
          GraphType.Category,
        ),
    );
    await Promise.all([...inputGraphPromises, ...categoryGraphPromises]);

    // 3. Reset rating inputs
    thunkAPI.dispatch(reset());

    // 4. Refresh UI (Stack + Input names)
    thunkAPI.dispatch(startRefreshUiAfterRate());

    return true;
  },
);

export const startRefreshUiAfterRate = createAsyncThunk<
  boolean,
  undefined,
  ThunkConfig
>('rateSS/startRefreshUiAfterRate', async (undef, thunkAPI) => {
  // 1. Clean input to category mapping
  thunkAPI.dispatch(startCleanInputCategories());

  // 2. Update all in/outputs
  thunkAPI.dispatch(startCacheAllDbInputsOutputs());

  // 3. Refresh Node + Identity Stats
  thunkAPI.dispatch(markNodeStatsUnfresh());
  thunkAPI.dispatch(markTimeseriesStatsUnfresh());

  // 4. TODO Aug 18, 2023: Potentially need to manually Refresh stack if stack list is not updated by un/rating
  // thunkAPI.dispatch(forceStackSignatureRerender());

  return true;
});

// ACTION TYPES

type SetRatingAction = PayloadAction<number>;
type AddInputAction = PayloadAction<RateInput>;
type EditInputAction = PayloadAction<{index: number; input: RateInput}>;
type SetInputsAction = PayloadAction<RateInput[]>;
type RmInputAction = PayloadAction<number>;
type SetOutputAction = PayloadAction<string[]>;
type AddOutputAction = PayloadAction<string>;
type RmOutputAction = PayloadAction<number>;
type ResetAction = PayloadAction<void>;

type StartRateSSFulfilled = PayloadAction<boolean>;

// SLICE

export const rateSS = createSlice({
  name: 'rateSS',
  initialState,
  reducers: {
    setRating: (state: RateSSState, action: SetRatingAction) => {
      state.rating = action.payload;
    },
    setInputs: (state: RateSSState, action: SetInputsAction) => {
      state.inputs = action.payload;
    },
    addInput: (state: RateSSState, action: AddInputAction) => {
      state.inputs.push(action.payload);
    },
    editInput: (state: RateSSState, action: EditInputAction) => {
      state.inputs[action.payload.index] = action.payload.input;
    },
    removeInput: (state: RateSSState, action: RmInputAction) => {
      // Do not need to set state bcus Redux Toolkit uses Immer, which
      // applies mutations to the state
      state.inputs.splice(action.payload, 1);
    },
    setOutputs: (state: RateSSState, action: SetOutputAction) => {
      state.outputs = action.payload;
    },
    addOutput: (state: RateSSState, action: AddOutputAction) => {
      state.outputs.push(action.payload);
    },
    removeOutput: (state: RateSSState, action: RmOutputAction) => {
      state.outputs.splice(action.payload, 1);
    },
    reset: (state: RateSSState, action: ResetAction) => {
      state.inputs = [];
      state.outputs = [];
      state.rating = 0;
    },
  },
  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      startRate.fulfilled,
      (state, action: StartRateSSFulfilled) => {},
    );
    builder.addCase(startRate.rejected, (state, action) => {});
  },
});

// Action creators are generated for each case reducer function
export const {
  setRating,
  setInputs,
  editInput,
  addInput,
  removeInput,
  setOutputs,
  addOutput,
  removeOutput,
} = rateSS.actions;
const {reset} = rateSS.actions;

export default rateSS.reducer;
