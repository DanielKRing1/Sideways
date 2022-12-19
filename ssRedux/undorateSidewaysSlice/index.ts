import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

export type {GrowingIdText as UndoRateInput} from 'ssComponents/Input/GrowingIdList';
import DbDriver from 'ssDatabase/api/core/dbDriver';
import {
  GraphType,
  SidewaysSnapshotRowPrimitive,
} from 'ssDatabase/api/core/types';
import {InputState} from 'ssRedux/rateSidewaysSlice';
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
  inputs: InputState[];
  outputs: string[];
  rating: number;

  undoratedSignature: {};
}

const initialState: UndoRateSSState = {
  // ORIGINAL RATING
  indexToUpdate: 0,
  originalSnapshot: {
    inputs: [],
    categories: [],
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
  const newInputs: string[] = newInputObjs.map(({name}) => name);
  const newCategories: string[] = newInputObjs.map(({category}) => category);

  // ORIGINAL SNAPSHOT
  const {originalSnapshot} = thunkAPI.getState().undorateSidewaysSlice;
  const {
    inputs: originalInputs,
    categories: originalCategories,
    outputs: originalOutputs,
    rating: originalRating,
  } = originalSnapshot;

  // 1. Undo Graph rating
  const undoInputGraphPromises: Promise<any>[] = originalOutputs.map(
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

  const undoCategoryGraphPromises: Promise<any>[] = originalOutputs.map(
    (originalOutput: string) =>
      DbDriver.undoRateGraph(
        activeSliceName,
        originalOutput,
        originalCategories,
        originalRating,
        new Array(originalInputs.length).fill(
          1 / originalInputs.length / originalOutputs.length,
        ),
        GraphType.Category,
      ),
  );

  await Promise.all([...undoInputGraphPromises, ...undoCategoryGraphPromises]);

  // 2. Apply new Graph rating
  const updateInputGraphPromises: Promise<any>[] = newOutputs.map(
    (newOutput: string) =>
      DbDriver.rateGraph(
        activeSliceName,
        newOutput,
        newInputs,
        newRating,
        new Array(newInputs.length).fill(
          1 / newInputs.length / newOutput.length,
        ),
      ),
  );

  const updateCategoryGraphPromises: Promise<any>[] = newOutputs.map(
    (newOutput: string) =>
      DbDriver.rateGraph(
        activeSliceName,
        newOutput,
        newCategories,
        newRating,
        new Array(newInputs.length).fill(
          1 / newInputs.length / newOutput.length,
        ),
        GraphType.Category,
      ),
  );

  // 3. Update snapshot
  const updateSnapshotPromise: Promise<any> = DbDriver.updateSnapshot(
    activeSliceName,
    indexToUpdate,
    newInputs,
    newOutputs,
    newRating,
  );

  await Promise.all([
    ...updateInputGraphPromises,
    ...updateCategoryGraphPromises,
    updateSnapshotPromise,
  ]);

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
    categories: originalCategories,
    outputs: originalOutputs,
    rating: originalRating,
  } = originalSnapshot;

  // 1. Undo Graph rating
  const undoInputGraphPromises: Promise<any>[] = originalOutputs.map(
    (output: string) =>
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

  const undoCategoryGraphPromises: Promise<any>[] = originalOutputs.map(
    (output: string) =>
      DbDriver.undoRateGraph(
        activeSliceName,
        output,
        originalCategories,
        originalRating,
        new Array(originalInputs.length).fill(
          1 / originalInputs.length / originalOutputs.length,
        ),
        GraphType.Category,
      ),
  );

  // 2. Remove from Stack
  const deleteSnapshotPromise: Promise<any> = DbDriver.deleteSnapshotIndexes(
    activeSliceName,
    [indexToRm],
  );

  await Promise.all([
    ...undoInputGraphPromises,
    ...undoCategoryGraphPromises,
    deleteSnapshotPromise,
  ]);

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
type SetInputsAction = PayloadAction<InputState[]>;
type AddInputAction = PayloadAction<InputState>;
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
        name: input,
        category: originalSnapshot.categories[i],
      }));
      state.outputs = originalSnapshot.outputs;
      state.rating = originalSnapshot.rating;
    },
    reset: (state: UndoRateSSState, action: ResetAction) => {
      // ORIGINAL RATING
      state.indexToUpdate = 0;

      state.originalSnapshot = {
        inputs: [],
        categories: [],
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
  setSnapshot,
  reset,
} = undorateSS.actions;

export default undorateSS.reducer;
