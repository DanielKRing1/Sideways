import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {GrowingIdText as UndoRateInput} from 'ssComponents/Input/GrowingIdList';
export type {GrowingIdText as UndoRateInput} from 'ssComponents/Input/GrowingIdList';
import DbDriver from 'ssDatabase/api/core/dbDriver';
import {SidewaysSnapshotRowPrimitive} from 'ssDatabase/api/core/types';
import {startCacheAllDbInputsOutputs} from 'ssRedux/readSidewaysSlice';
import {startCleanInputCategories} from 'ssRedux/userJson';
import {ThunkConfig} from '../types';

// INITIAL STATE

export interface UndoRateSSState {
  // ORIGINAL RATING
  originalSnapshot: SidewaysSnapshotRowPrimitive;

  // NEW RATING
  // Current input
  typingInput: string;

  // Final values
  inputs: UndoRateInput[];
  outputs: string[];
  rating: number;

  undoratedSignature: {};
}

const initialState: UndoRateSSState = {
  // ORIGINAL RATING
  originalSnapshot: {
    inputs: [],
    outputs: [],
    rating: 0,
    timestamp: 0,
  },

  // NEW RATING
  // Current input
  typingInput: '',

  // Final values
  inputs: [],
  outputs: [],
  rating: 0,

  undoratedSignature: {},
};

// ASYNC THUNKS

type UndoRateSSThunkArgs = {
  sliceName: string;

  inputs: UndoRateInput[];
  outputs: UndoRateInput[];
  rating: number;
};

export const startUndoRate = createAsyncThunk<boolean, undefined, ThunkConfig>(
  'undorateSS/startUndoRate',
  async (undef, thunkAPI) => {
    const {activeSliceName} =
      thunkAPI.getState().readSidewaysSlice.toplevelReadReducer;
    // TODO
    const {originalSnapshot, inputs, outputs, rating} =
      thunkAPI.getState().undorateSidewaysSlice;

    const inputTexts: string[] = inputs.map(
      (input: UndoRateInput) => input.text,
    );

    // 1. Add to Stack

    DbDriver.push(activeSliceName, {
      inputs: inputTexts,
      outputs,
      rating,
    });

    // 2. UndoRate Graph
    const promises: Promise<any>[] = outputs.map((output: string) =>
      // TODO
      DbDriver.undoRateGraph(
        activeSliceName,
        output,
        inputTexts,
        rating,
        new Array(inputs.length).fill(1 / inputs.length / outputs.length),
      ),
    );
    await Promise.all(promises);

    // 3. Clean input to category mapping
    thunkAPI.dispatch(startCleanInputCategories());

    // 4. Update all in/outputs
    thunkAPI.dispatch(startCacheAllDbInputsOutputs());

    // 5. Reset rating inputs
    thunkAPI.dispatch(reset());
    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  },
);

// ACTION TYPES

type ForceRatingsRerenderAction = PayloadAction<undefined>;
type SetRatingAction = PayloadAction<number>;
type SetInputsAction = PayloadAction<UndoRateInput[]>;
type AddInputAction = PayloadAction<UndoRateInput>;
type RmInputAction = PayloadAction<number>;
type SetOutputAction = PayloadAction<string[]>;
type AddOutputAction = PayloadAction<string>;
type RmOutputAction = PayloadAction<number>;
type ResetAction = PayloadAction<undefined>;
type StartUndoRateSSFulfilled = PayloadAction<boolean>;

// SLICE

export const undorateSS = createSlice({
  name: 'undorateSS',
  initialState,
  reducers: {
    setReplacementRating: (state: UndoRateSSState, action: SetRatingAction) => {
      state.rating = action.payload;
    },
    setReplacementInputs: (state: UndoRateSSState, action: SetInputsAction) => {
      state.inputs = action.payload;
    },
    addReplacementInput: (state: UndoRateSSState, action: AddInputAction) => {
      state.inputs.push(action.payload);
    },
    removeReplacementInput: (state: UndoRateSSState, action: RmInputAction) => {
      // Do not need to set state bcus Redux Toolkit uses Immer, which
      // applies mutations to the state
      state.inputs.splice(action.payload, 1);
    },
    setReplacementOutputs: (
      state: UndoRateSSState,
      action: SetOutputAction,
    ) => {
      state.outputs = action.payload;
    },
    addReplacementOutput: (state: UndoRateSSState, action: AddOutputAction) => {
      state.outputs.push(action.payload);
    },
    removeReplacementOutput: (
      state: UndoRateSSState,
      action: RmOutputAction,
    ) => {
      state.outputs.splice(action.payload, 1);
    },
    reset: (state: UndoRateSSState, action: ResetAction) => {
      // ORIGINAL RATING
      state.originalSnapshot = {
        inputs: [],
        outputs: [],
        rating: 0,
        timestamp: 0,
      };

      // NEW RATING
      // Current input
      state.typingInput = '';

      // Final values
      state.inputs = [];
      state.outputs = [];
      state.rating = 0;
    },
    forceSignatureRerender: (
      state: UndoRateSSState,
      action: ForceRatingsRerenderAction,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // 1. Update the ratings
      state.undoratedSignature = {};
    },
  },
  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      startUndoRate.fulfilled,
      (state, action: StartUndoRateSSFulfilled) => {
        // Add user to the state array

        // 1. Update the ratings
        state.undoratedSignature = {};
      },
    );
    builder.addCase(startUndoRate.rejected, (state, action) => {
      console.log(action.error.message);
    });
  },
});

// Action creators are geneundorated for each case reducer function
export const {
  forceSignatureRerender,
  setReplacementRating,
  setReplacementInputs,
  addReplacementInput,
  removeReplacementInput,
  setReplacementOutputs,
  addReplacementOutput,
  removeReplacementOutput,
  reset,
} = undorateSS.actions;

export default undorateSS.reducer;
