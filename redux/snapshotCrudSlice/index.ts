import { combineReducers } from 'redux';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import dbDriver from '../../database/dbDriver';
import { ThunkConfig } from '../types';

// INITIAL STATE

export interface SnapshotCrudState {
  snapshotCrudSignature: {};
};

const initialState: SnapshotCrudState = {
  snapshotCrudSignature: {},
};

// ASYNC THUNKS

type DeleteSnapshotThunkArgs = {
  sliceName: string;
  snapshot: Realm.Object & SidewaysSnapshotRow;
  index: number;
}

export const startDeleteSnapshot = createAsyncThunk<
  boolean,
  DeleteSnapshotThunkArgs,
  ThunkConfig
>(
  'deleteSS/startDeleteSnapshot',
  async ({ sliceName, snapshot, index }: DeleteSnapshotThunkArgs, thunkAPI) => {

    // 1. Delete index from RealmStack
    await dbDriver.deleteSnapshotIndexes(sliceName, [index]);

    // 2. Undo RealmGraph rating
    const { inputs, outputs, rating } = snapshot;
    for(const output of outputs) {
      await dbDriver.undoRateGraph(sliceName, output, inputs, rating);
    }

    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  }
)

type UpdateSnapshotThunkArgs = {
  sliceName: string;
  oldSnapshot: Realm.Object & SidewaysSnapshotRow;
  newInputs: string[];
  newOutputs: string[];
  newRating: number;
}

export const startUpdateSnapshot = createAsyncThunk<
  boolean,
  UpdateSnapshotThunkArgs,
  ThunkConfig
>(
  'deleteSS/startUpdateSnapshot',
  async ({ sliceName, oldSnapshot, newInputs, newOutputs, newRating }: UpdateSnapshotThunkArgs, thunkAPI) => {

    // 1. Delete indexes from RealmStack
    await dbDriver.updateSnapshot(sliceName, oldSnapshot, newInputs, newOutputs, newRating);

    // 2. Undo RealmGraph rating
    const { inputs: oldInputs, outputs: oldOutputs, rating: oldRating } = oldSnapshot;
    for(const output of oldOutputs) {
      await dbDriver.undoRateGraph(sliceName, output, oldInputs, oldRating, new Array(oldInputs.length).fill(1/oldInputs.length/oldOutputs.length));
    }

    // 3. Redo RealmGraph rating
    for (const newOutput of newOutputs) {
      await dbDriver.rateGraph(sliceName, newOutput, newInputs, newRating, new Array(newInputs.length).fill(1/newInputs.length/newOutput.length));
    }

    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  }
)

// ACTION TYPES

type ForceStatsRerenderAction = PayloadAction<undefined>;

// SLICE

export const snapshotCrudSlice = createSlice({
  name: 'snapshotCrudSlice',
  initialState,
  reducers: {
    forceSignatureRerender: (state: SnapshotCrudState, action: ForceStatsRerenderAction) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // 1. Update the ratings
      state.snapshotCrudSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { forceSignatureRerender } = snapshotCrudSlice.actions;


export default snapshotCrudSlice.reducer;
