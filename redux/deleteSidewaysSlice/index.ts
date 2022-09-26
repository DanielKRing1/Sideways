import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import dbDriver from '../../database/dbDriver';
import { ThunkConfig } from '../types';

// INITIAL STATE

export interface DeleteSSState {
  deleteSSSignature: {};
};

const initialState: DeleteSSState = {
  deleteSSSignature: {},
};

// ASYNC THUNKS

type DeleteSSThunkArgs = string;

export const startDeleteSlice = createAsyncThunk<
  boolean,
  DeleteSSThunkArgs,
  ThunkConfig
>(
  'deleteSS/startDelete',
  async (sliceName: DeleteSSThunkArgs, thunkAPI) => {

    // 1. Delete from Stack
    const p1: Promise<any> = dbDriver.deleteStack(sliceName);
    // 2. Delete from Graph
    const p2: Promise<any> = dbDriver.deleteGraph(sliceName);

    await Promise.all([ p1, p2 ]);

    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  }
)

// ACTION TYPES

type ForceRatingsRerenderAction = PayloadAction<undefined>;
type StartRateSSFulfilled = PayloadAction<boolean>;

// SLICE

export const deleteSS = createSlice({
  name: 'deleteSS',
  initialState,
  reducers: {
    forceSignatureRerender: (state: DeleteSSState, action: ForceRatingsRerenderAction) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // 1. Update the ratings
      state.deleteSSSignature = {};
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(startDeleteSlice.fulfilled, (state, action: StartRateSSFulfilled) => {
      // Add user to the state array
      
      // 1. Update the ratings
      state.deleteSSSignature = {};

    });
    builder.addCase(startDeleteSlice.rejected, (state, action) => {
        console.log(action.error.message);
    });
  },
});

// Action creators are generated for each case reducer function
export const { forceSignatureRerender } = deleteSS.actions;

export default deleteSS.reducer;
