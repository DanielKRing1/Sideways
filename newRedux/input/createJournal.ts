import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {GrowingIdItem} from 'ssComponents/Input/GrowingIdList';
export type CreateSliceOutput = GrowingIdItem<string>;
import DbDriver from 'ssDatabase/api/core/dbDriver';
import {DAILY_JOURNAL_CATEGORY_SET} from 'ssDatabase/api/userJson/category/constants';
import globalDriver from 'ssDatabase/api/userJson/globalDriver';
import {startSetActiveSliceName} from 'ssRedux/readSidewaysSlice';
import {ThunkConfig} from '../types';

// INITIAL STATE

export interface CreateSSState {
  newSliceName: string;
  possibleOutputs: CreateSliceOutput[];
  csId: string;

  createdSignature: {};
}

const initialState: CreateSSState = {
  newSliceName: '',
  possibleOutputs: [],
  csId: DAILY_JOURNAL_CATEGORY_SET.csId,

  createdSignature: {},
};

// ASYNC THUNKS

export const startCreateSlice = createAsyncThunk<
  boolean,
  undefined,
  ThunkConfig
>('createSS/startCreateSlice', async (undef, thunkAPI) => {
  const {newSliceName, possibleOutputs, csId} =
    thunkAPI.getState().createSidewaysSlice;

  // 1. Create Stack (also reloads stack LoadableRealm)
  const stackPromise: Promise<void> = DbDriver.createStack(newSliceName);

  // 2. Create Graph (also reloads graph LoadableRealm)
  const outputTextList: string[] = possibleOutputs.map(
    (possibleOutput: CreateSliceOutput) => possibleOutput.item,
  );
  const graphPromise: Promise<void> = DbDriver.createGraphs(
    newSliceName,
    outputTextList,
  );

  // 3. Add SLICE NAME -> CATEGORY SET mapping
  globalDriver.addSliceToCSMapping(newSliceName, csId);

  const results: [void, void] = await Promise.all([stackPromise, graphPromise]);

  // 4. Reset newSliceName, ouputs, csId
  thunkAPI.dispatch(reset());

  // 5. Select created alice as active slice
  thunkAPI.dispatch(startSetActiveSliceName(newSliceName));

  thunkAPI.dispatch(forceSignatureRerender());

  return true;
});

// ACTION TYPES

type ForceSSRerenderAction = PayloadAction<undefined>;
type SetNewSliceNameAction = PayloadAction<string>;
type SetCSIdAction = PayloadAction<string>;
type SetPossibleOutputsAction = PayloadAction<CreateSliceOutput[]>;
type AddPossibleOutputAction = PayloadAction<CreateSliceOutput>;
type EditPossibleOutputAction = PayloadAction<{index: number; newText: string}>;
type RmPossibleOutputAction = PayloadAction<number>;
type ResetAction = PayloadAction<undefined>;
type StartCreateSSFulfilled = PayloadAction<boolean>;

// SLICE

export const createSS = createSlice({
  name: 'createSS',
  initialState,
  reducers: {
    setNewSliceName: (state: CreateSSState, action: SetNewSliceNameAction) => {
      state.newSliceName = action.payload;
    },
    setCSId: (state: CreateSSState, action: SetCSIdAction) => {
      state.csId = action.payload;
    },
    setPossibleOutputs: (
      state: CreateSSState,
      action: SetPossibleOutputsAction,
    ) => {
      state.possibleOutputs = action.payload;
    },
    addPossibleOutput: (
      state: CreateSSState,
      action: AddPossibleOutputAction,
    ) => {
      state.possibleOutputs.push(action.payload);
    },
    editPossibleOutput: (
      state: CreateSSState,
      action: EditPossibleOutputAction,
    ) => {
      const {index, newText} = action.payload;

      state.possibleOutputs[index].item = newText;
    },
    removePossibleOutput: (
      state: CreateSSState,
      action: RmPossibleOutputAction,
    ) => {
      // Do not need to set state bcus Redux Toolkit uses Immer, which
      // applies mutations to the state
      state.possibleOutputs.splice(action.payload, 1);
    },
    reset: (state: CreateSSState, action: ResetAction) => {
      state.newSliceName = '';
      state.possibleOutputs = [];
      state.csId = DAILY_JOURNAL_CATEGORY_SET.csId;
    },
    forceSignatureRerender: (
      state: CreateSSState,
      action: ForceSSRerenderAction,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // 1. Create the set of sideways slices
      state.createdSignature = {};
    },
  },
  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      startCreateSlice.fulfilled,
      (state, action: StartCreateSSFulfilled) => {
        // Add user to the state array

        state.createdSignature = {};
      },
    );
    builder.addCase(startCreateSlice.rejected, (state, action) => {
      console.log(action.error.message);
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  setNewSliceName,
  setCSId,
  setPossibleOutputs,
  addPossibleOutput,
  editPossibleOutput,
  removePossibleOutput,
  forceSignatureRerender,
} = createSS.actions;

const {reset} = createSS.actions;

export default createSS.reducer;
