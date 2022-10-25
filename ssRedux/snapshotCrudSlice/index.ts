import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import dbDriver from 'ssDatabase/api/core/dbDriver';
import {ThunkConfig} from '../types';
import {SidewaysSnapshotRow} from '../../ssDatabase/api/types';

// INITIAL STATE

export interface SnapshotCrudState {
  snapshotCrudSignature: {};
}

const initialState: SnapshotCrudState = {
  snapshotCrudSignature: {},
};

// ASYNC THUNKS

type DeleteSnapshotThunkArgs = {
  sliceName: string;
  snapshot: Realm.Object & SidewaysSnapshotRow;
  index: number;
};

export const startDeleteSnapshot = createAsyncThunk<
  boolean,
  DeleteSnapshotThunkArgs,
  ThunkConfig
>(
  'deleteSS/startDeleteSnapshot',
  async ({sliceName, snapshot, index}: DeleteSnapshotThunkArgs, thunkAPI) => {
    // 1. Delete index from RealmStack
    await dbDriver.deleteSnapshotIndexes(sliceName, [index]);

    // 2. Undo RealmGraph rating
    const {inputs, outputs, rating} = snapshot;
    const promises: Promise<any>[] = outputs.map((output: string) =>
      dbDriver.undoRateGraph(sliceName, output, inputs, rating),
    );
    await Promise.all(promises);

    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  },
);

type UpdateSnapshotThunkArgs = {
  sliceName: string;
  oldSnapshot: Realm.Object & SidewaysSnapshotRow;
  newInputs: string[];
  newOutputs: string[];
  newRating: number;
};

export const startUpdateSnapshot = createAsyncThunk<
  boolean,
  UpdateSnapshotThunkArgs,
  ThunkConfig
>(
  'deleteSS/startUpdateSnapshot',
  async (
    {
      sliceName,
      oldSnapshot,
      newInputs,
      newOutputs,
      newRating,
    }: UpdateSnapshotThunkArgs,
    thunkAPI,
  ) => {
    // 1. Delete indexes from RealmStack
    await dbDriver.updateSnapshot(
      sliceName,
      oldSnapshot,
      newInputs,
      newOutputs,
      newRating,
    );

    // 2. Undo RealmGraph rating
    const {
      inputs: oldInputs,
      outputs: oldOutputs,
      rating: oldRating,
    } = oldSnapshot;
    const undoPromises: Promise<any>[] = oldOutputs.map((oldOutput: string) =>
      dbDriver.undoRateGraph(
        sliceName,
        oldOutput,
        oldInputs,
        oldRating,
        new Array(oldInputs.length).fill(
          1 / oldInputs.length / oldOutputs.length,
        ),
      ),
    );
    await Promise.all(undoPromises);

    // 3. Redo RealmGraph rating
    const redoPromises: Promise<any>[] = newOutputs.map((newOutput: string) =>
      dbDriver.rateGraph(
        sliceName,
        newOutput,
        newInputs,
        newRating,
        new Array(newInputs.length).fill(
          1 / newInputs.length / newOutput.length,
        ),
      ),
    );
    await Promise.all(redoPromises);

    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  },
);

// ACTION TYPES

type ForceStatsRerenderAction = PayloadAction<undefined>;

// SLICE

export const snapshotCrudSlice = createSlice({
  name: 'snapshotCrudSlice',
  initialState,
  reducers: {
    forceSignatureRerender: (
      state: SnapshotCrudState,
      action: ForceStatsRerenderAction,
    ) => {
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
export const {forceSignatureRerender} = snapshotCrudSlice.actions;

export default snapshotCrudSlice.reducer;
