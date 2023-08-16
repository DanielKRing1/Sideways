import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {GrowingIdItem} from 'ssComponents/Input/GrowingIdList';
export type RateInput = GrowingIdItem<NODE_ID_COMPONENTS & {category: string}>;
import DbDriver from 'ssDatabase/api/core/dbDriver';
import {GraphType} from 'ssDatabase/api/core/types';
import {startCacheAllDbInputsOutputs} from 'ssRedux/readSidewaysSlice';
import {startCleanInputCategories} from 'ssRedux/userJson';
import {forceSignatureRerender as forceStackSignatureRerender} from 'ssRedux/readSidewaysSlice/readStack';
import {ThunkConfig} from '../types';
import {
  addNodePostfix,
  NODE_ID,
  NODE_ID_COMPONENTS,
} from 'ssDatabase/api/types';

// INITIAL STATE

export interface RateSSState {
  // Current input
  typingInput: string;

  // Final values
  inputs: RateInput[];
  outputs: string[];
  rating: number;

  ratedSignature: {};
}

const initialState: RateSSState = {
  // Current input
  typingInput: '',

  // Final values
  inputs: [],
  outputs: [],
  rating: 0,

  ratedSignature: {},
};

// ASYNC THUNKS

type RateSSThunkArgs = {
  sliceName: string;

  inputs: RateInput[];
  outputs: RateInput[];
  rating: number;
};

export const startRate = createAsyncThunk<boolean, undefined, ThunkConfig>(
  'rateSS/startRate',
  async (undef, thunkAPI) => {
    const {activeSliceName} =
      thunkAPI.getState().readSidewaysSlice.toplevelReadReducer;
    const {inputs, outputs, rating} = thunkAPI.getState().rateSidewaysSlice;
    const {fullUserJsonMap} = thunkAPI.getState().userJsonSlice;

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

    // 2. Rate Graph
    const inputGraphPromises: Promise<any>[] = outputs.map((output: string) =>
      DbDriver.rateGraph(
        activeSliceName,
        output,
        inputNames,
        rating,
        new Array(inputs.length).fill(1 / inputs.length / outputs.length),
      ),
    );
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
    thunkAPI.dispatch(setInputs([]));
    thunkAPI.dispatch(setOutputs([]));
    thunkAPI.dispatch(setRating(0));
    thunkAPI.dispatch(forceSignatureRerender());

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

  // 3. Refresh stack
  thunkAPI.dispatch(forceStackSignatureRerender());

  return true;
});

// ACTION TYPES

type ForceRatingsRerenderAction = PayloadAction<undefined>;
type SetRatingAction = PayloadAction<number>;
type AddInputAction = PayloadAction<RateInput>;
type EditInputAction = PayloadAction<{index: number; input: RateInput}>;
type SetInputsAction = PayloadAction<RateInput[]>;
type RmInputAction = PayloadAction<number>;
type SetOutputAction = PayloadAction<string[]>;
type AddOutputAction = PayloadAction<string>;
type RmOutputAction = PayloadAction<number>;
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
    forceSignatureRerender: (
      state: RateSSState,
      action: ForceRatingsRerenderAction,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // 1. Update the ratings
      state.ratedSignature = {};
    },
  },
  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      startRate.fulfilled,
      (state, action: StartRateSSFulfilled) => {
        // Add user to the state array

        // 1. Update the ratings
        state.ratedSignature = {};
      },
    );
    builder.addCase(startRate.rejected, (state, action) => {
      console.log(action.error.message);
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  forceSignatureRerender,
  setRating,
  setInputs,
  editInput,
  addInput,
  removeInput,
  setOutputs,
  addOutput,
  removeOutput,
} = rateSS.actions;

export default rateSS.reducer;
