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
  indexToUpdate: number;
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
  indexToUpdate: 0,
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

export const startUpdateRate = createAsyncThunk<
  boolean,
  undefined,
  ThunkConfig
>('undorateSS/startUpdateRate', async (undef, thunkAPI) => {
  // REDUX STATE
  const {activeSliceName} =
    thunkAPI.getState().readSidewaysSlice.toplevelReadReducer;
  // NEW SNAPSHOT
  const {
    indexToUpdate,
    inputs: newInputObjs,
    outputs: newOutputs,
    rating: newRating,
  } = thunkAPI.getState().undorateSidewaysSlice;
  const newInputs: string[] = newInputObjs.map(({text}) => text);

  // ORIGINAL SNAPSHOT
  const {originalSnapshot} = thunkAPI.getState().undorateSidewaysSlice;
  const {
    inputs: originalInputs,
    outputs: originalOutputs,
    rating: originalRating,
  } = originalSnapshot;

  // 1. Undo Graph rating
  const undoPromises: Promise<any>[] = originalOutputs.map(
    (originalOutput: string) =>
      DbDriver.undoRateGraph(
        activeSliceName,
        originalOutput,
        originalInputs,
        originalRating,
        new Array(originalInputs.length).fill(
          1 / originalInputs.length / originalOutputs.length,
        ),
      ),
  );
  await Promise.all(undoPromises);

  // 2. Apply new Graph rating
  const updatePromises: Promise<any>[] = newOutputs.map((newOutput: string) =>
    DbDriver.rateGraph(
      activeSliceName,
      newOutput,
      newInputs,
      newRating,
      new Array(newInputs.length).fill(1 / newInputs.length / newOutput.length),
    ),
  );

  // 3. Update snapshot
  updatePromises.push(
    DbDriver.updateSnapshot(
      activeSliceName,
      indexToUpdate,
      newInputs,
      newOutputs,
      newRating,
    ),
  );

  await Promise.all(updatePromises);

  return true;
});

type DeleteRateSSThunkArgs = {
  indexToRm: number;
};

export const startDeleteRate = createAsyncThunk<
  boolean,
  DeleteRateSSThunkArgs,
  ThunkConfig
>('undorateSS/startDeleteRate', async (args, thunkAPI) => {
  // ARGS
  const {indexToRm} = args;

  // REDUX  STATE
  const {activeSliceName} =
    thunkAPI.getState().readSidewaysSlice.toplevelReadReducer;

  // ORIGINAL SNAPSHOT
  const {originalSnapshot} = thunkAPI.getState().undorateSidewaysSlice;
  const {
    inputs: originalInputs,
    outputs: originalOutputs,
    rating: originalRating,
  } = originalSnapshot;

  // 1. Undo Graph rating
  const promises: Promise<any>[] = originalOutputs.map((output: string) =>
    DbDriver.undoRateGraph(
      activeSliceName,
      output,
      originalInputs,
      originalRating,
      new Array(originalInputs.length).fill(
        1 / originalInputs.length / originalOutputs.length,
      ),
    ),
  );

  // 2. Remove from Stack
  promises.push(DbDriver.deleteSnapshotIndexes(activeSliceName, [indexToRm]));

  await Promise.all(promises);

  // 3. Clean input to category mapping
  thunkAPI.dispatch(startCleanInputCategories());

  // 4. Update all in/outputs
  thunkAPI.dispatch(startCacheAllDbInputsOutputs());

  // 5. Reset rating inputs
  thunkAPI.dispatch(reset());
  thunkAPI.dispatch(forceSignatureRerender());

  return true;
});

// ACTION TYPES

type ForceRatingsRerenderAction = PayloadAction<undefined>;
type SetRatingAction = PayloadAction<number>;
type SetInputsAction = PayloadAction<UndoRateInput[]>;
type AddInputAction = PayloadAction<UndoRateInput>;
type RmInputAction = PayloadAction<number>;
type SetOutputAction = PayloadAction<string[]>;
type AddOutputAction = PayloadAction<string>;
type RmOutputAction = PayloadAction<number>;
type SetSnapshotAction = PayloadAction<{
  indexToUpdate: number;
  originalSnapshot: SidewaysSnapshotRowPrimitive;
}>;
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
    setSnapshot: (state: UndoRateSSState, action: SetSnapshotAction) => {
      const {indexToUpdate, originalSnapshot} = action.payload;

      // ORIGINAL RATING
      state.indexToUpdate = indexToUpdate;
      state.originalSnapshot = originalSnapshot;

      // NEW RATING
      // Start New Rating info as Original Rating info
      state.inputs = originalSnapshot.inputs.map((input, i) => ({
        id: i,
        text: input,
      }));
      state.outputs = originalSnapshot.outputs;
      state.rating = originalSnapshot.rating;
    },
    reset: (state: UndoRateSSState, action: ResetAction) => {
      // ORIGINAL RATING
      state.indexToUpdate = 0;

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
      startDeleteRate.fulfilled,
      (state, action: StartUndoRateSSFulfilled) => {
        // Add user to the state array

        // 1. Update the ratings
        state.undoratedSignature = {};
      },
    );
    builder.addCase(startDeleteRate.rejected, (state, action) => {
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
