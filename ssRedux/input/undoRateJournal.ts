import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

export type {GrowingIdItem as UndoRateInput} from 'ssComponents/Input/GrowingIdList';
import DbDriver from 'ssDatabase/api/core/dbDriver';
import {
  GraphType,
  SidewaysSnapshotRowPrimitive,
} from 'ssDatabase/api/core/types';

import {RateInput, startRefreshUiAfterRate} from 'ssRedux/input/rateJournal';

import {addNodePostfix, NODE_ID, stripNodePostfix} from 'ssDatabase/api/types';
import {ThunkConfig} from '../../ssRedux/types';

// LEFT OFF 8/17/2023: Mark NodeStats as Unfresh after Rate, UndoRate, and DeleteRate -> Create MarkUnfresh method in Rate reducer

// INITIAL STATE

export interface UndoRateSSState {
  // ORIGINAL RATING
  indexToUpdate: number;
  originalSnapshot: SidewaysSnapshotRowPrimitive;

  // NEW RATING
  // Current input
  typingInput: string;

  // Final values
  inputs: RateInput[];
  outputs: string[];
  rating: number;
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
};

// ASYNC THUNKS

export const startUpdateRate = createAsyncThunk<
  boolean,
  undefined,
  ThunkConfig
>('undorrateSS/startUpdateRate', async (undef, thunkAPI) => {
  // REDUX STATE
  const {activeSliceName} = thunkAPI.getState().appState.activeJournal;
  // NEW SNAPSHOT
  const {
    indexToUpdate,
    inputs: newInputObjs,
    outputs: newOutputs,
    rating: newRating,
  } = thunkAPI.getState().input.undoRateJournal;
  const newInputs: string[] = newInputObjs.map(({item}) =>
    addNodePostfix(item.id, item.postfix),
  );
  const newCategories: string[] = newInputObjs.map(({item}) => item.category);

  // ORIGINAL SNAPSHOT
  const {originalSnapshot} = thunkAPI.getState().input.undoRateJournal;

  // 1. Delete original Graph rating
  const deleteGraphPromises: Promise<any>[] = deleteGraphRatingHelper(
    activeSliceName,
    originalSnapshot,
  );

  await Promise.all(deleteGraphPromises);

  // 2. Apply new Graph rating
  const updatePromises: Promise<any>[] = updateRatingHelper(
    activeSliceName,
    newOutputs,
    newInputs,
    newCategories,
    newRating,
    indexToUpdate,
  );

  await Promise.all(updatePromises);

  // 3. Refresh UI (Stack + Input names)
  //    and Mark unfresh NodeStats as Unfresh
  thunkAPI.dispatch(startRefreshUiAfterRate());

  // 4. Reset rating inputs
  thunkAPI.dispatch(reset());

  return true;
});

type DeleteRateSSThunkArgs = {
  indexToRm: number;
};

export const startDeleteRate = createAsyncThunk<
  boolean,
  DeleteRateSSThunkArgs,
  ThunkConfig
>('undorrateSS/startDeleteRate', async (args, thunkAPI) => {
  // ARGS
  const {indexToRm} = args;

  const {activeSliceName} = thunkAPI.getState().appState.activeJournal;
  const {originalSnapshot} = thunkAPI.getState().input.undoRateJournal;

  // 1. Delete original Graph rating
  const deleteGraphPromises: Promise<any>[] = deleteGraphRatingHelper(
    activeSliceName,
    originalSnapshot,
  );

  // 2. Remove from Stack
  const deleteSnapshotPromise: Promise<any> = DbDriver.deleteSnapshotIndexes(
    activeSliceName,
    [indexToRm],
  );

  await Promise.all([...deleteGraphPromises, deleteSnapshotPromise]);

  // 3. Refresh UI to reflect new Stack and cleaned cached Db Inputs/Outputs
  //    and Mark unfresh NodeStats as Unfresh
  thunkAPI.dispatch(startRefreshUiAfterRate());

  // 4. Reset rating inputs
  thunkAPI.dispatch(reset());

  return true;
});

/**
 * Deletes Input and Category Graph ratings
 *
 * @param activeSliceName
 * @param originalSnapshot
 * @returns
 */
const deleteGraphRatingHelper = (
  activeSliceName: string,
  originalSnapshot: SidewaysSnapshotRowPrimitive,
) => {
  // ORIGINAL SNAPSHOT
  const {
    inputs: originalInputs,
    categories: originalCategories,
    outputs: originalOutputs,
    rating: originalRating,
  } = originalSnapshot;

  // 1. Undo Input Graph rating
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

  // 2. Undo Category Graph rating
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

  return [...undoInputGraphPromises, ...undoCategoryGraphPromises];
};

/**
 * Updates Input and Category Graph ratings
 * and
 * Update Stack snapshot
 *
 * @param activeSliceName
 * @param newOutputs
 * @param newInputs
 * @param newCategories
 * @param newRating
 * @param indexToUpdate
 * @returns
 */
const updateRatingHelper = (
  activeSliceName: string,
  newOutputs: string[],
  newInputs: string[],
  newCategories: string[],
  newRating: number,
  indexToUpdate: number,
) => {
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

  return [
    ...updateInputGraphPromises,
    ...updateCategoryGraphPromises,
    updateSnapshotPromise,
  ];
};

// ACTION TYPES

type SetRatingAction = PayloadAction<number>;
type SetInputsAction = PayloadAction<RateInput[]>;
type AddInputAction = PayloadAction<RateInput>;
type EditInputAction = PayloadAction<{index: number; input: RateInput}>;
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

export const undorrateSS = createSlice({
  name: 'undorrateSS',
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
    editReplacementInput: (state: UndoRateSSState, action: EditInputAction) => {
      state.inputs[action.payload.index] = action.payload.input;
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
      // Init New Snapshot to Original Snapshot
      state.inputs = originalSnapshot.inputs.map((input: NODE_ID, i) => {
        const {id, postfix} = stripNodePostfix(input);

        return {
          id: i,
          item: {
            id,
            postfix,
            category: originalSnapshot.categories[i],
          },
        };
      });
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
  },
  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      startDeleteRate.fulfilled,
      (state, action: StartUndoRateSSFulfilled) => {},
    );
    builder.addCase(startDeleteRate.rejected, (state, action) => {
      console.log(action.error.message);
    });
  },
});

// Action creators are geneundorated for each case reducer function
export const {
  setReplacementRating,
  setReplacementInputs,
  addReplacementInput,
  editReplacementInput,
  removeReplacementInput,
  setReplacementOutputs,
  addReplacementOutput,
  removeReplacementOutput,
  setSnapshot,
  reset,
} = undorrateSS.actions;

export default undorrateSS.reducer;
