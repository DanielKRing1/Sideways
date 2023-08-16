import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import dbDriver from 'ssDatabase/api/core/dbDriver';
import {ThunkConfig} from '../../ssRedux/types';

// INITIAL STATE

export interface DeleteSSState {}

const initialState: DeleteSSState = {};

// ASYNC THUNKS

type DeleteSSThunkArgs = string;

export const startDeleteSlice = createAsyncThunk<
  boolean,
  DeleteSSThunkArgs,
  ThunkConfig
>('deleteSS/startDelete', async (sliceName: DeleteSSThunkArgs, thunkAPI) => {
  // 1. Delete from Stack
  const p1: Promise<any> = dbDriver.deleteStack(sliceName);
  // 2. Delete from Graph
  const p2: Promise<any> = dbDriver.deleteGraphs(sliceName);

  await Promise.all([p1, p2]);

  return true;
});

// ACTION TYPES

type StartDeleteSSFulfilled = PayloadAction<boolean>;

// SLICE

export const deleteSS = createSlice({
  name: 'deleteSS',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      startDeleteSlice.fulfilled,
      (state, action: StartDeleteSSFulfilled) => {},
    );
    builder.addCase(startDeleteSlice.rejected, (state, action) => {
      console.log(action.error.message);
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = deleteSS.actions;

export default deleteSS.reducer;
