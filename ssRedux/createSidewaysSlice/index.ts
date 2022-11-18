import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {GrowingIdText as NewSliceOutput} from 'ssComponents/Input/GrowingIdList';
import DbDriver from 'ssDatabase/api/core/dbDriver';
import {ThunkConfig} from '../types';

// INITIAL STATE

export interface CreateSSState {
  newSliceName: string;
  possibleOutputs: NewSliceOutput[];

  createdSignature: {};
}

const initialState: CreateSSState = {
  newSliceName: '',
  possibleOutputs: [],

  createdSignature: {},
};

// ASYNC THUNKS

export const startCreateSlice = createAsyncThunk<
  boolean,
  undefined,
  ThunkConfig
>('createSS/startCreateSlice', async (undef, thunkAPI) => {
  const {newSliceName, possibleOutputs} =
    thunkAPI.getState().createSidewaysSlice;

  // 1. Create Stack (also reloads stack LoadableRealm)
  const stackPromise: Promise<void> = DbDriver.createStack(newSliceName);

  // 2. Create Graph (also reloads graph LoadableRealm)
  const outputTextList: string[] = possibleOutputs.map(
    (possibleOutput: NewSliceOutput) => possibleOutput.text,
  );
  const graphPromise: Promise<void> = DbDriver.createGraph(
    newSliceName,
    outputTextList,
  );

  const results: [void, void] = await Promise.all([stackPromise, graphPromise]);

  thunkAPI.dispatch(setPossibleOutputs([]));

  thunkAPI.dispatch(forceSignatureRerender());

  return true;
});

// ACTION TYPES

type ForceSSRerenderAction = PayloadAction<undefined>;
type SetnewSliceNameAction = PayloadAction<string>;
type SetPossibleOutputsAction = PayloadAction<NewSliceOutput[]>;
type AddPossibleOutputAction = PayloadAction<NewSliceOutput>;
type RmPossibleOutputAction = PayloadAction<number>;
type StartCreateSSFulfilled = PayloadAction<boolean>;

// SLICE

export const createSS = createSlice({
  name: 'createSS',
  initialState,
  reducers: {
    setNewSliceName: (state: CreateSSState, action: SetnewSliceNameAction) => {
      state.newSliceName = action.payload;
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
    removePossibleOutput: (
      state: CreateSSState,
      action: RmPossibleOutputAction,
    ) => {
      // Do not need to set state bcus Redux Toolkit uses Immer, which
      // applies mutations to the state
      state.possibleOutputs.splice(action.payload, 1);
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
  setPossibleOutputs,
  addPossibleOutput,
  removePossibleOutput,
  forceSignatureRerender,
} = createSS.actions;

export default createSS.reducer;
