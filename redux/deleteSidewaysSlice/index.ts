import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThunkConfig } from '../types';

// INITIAL STATE

export interface DeleteSSState {
  sliceName: string;

  deletedSignature: {};
};

const initialState: DeleteSSState = {
  sliceName: '',

  deletedSignature: {},
};

// ASYNC THUNKS

type DeleteSSThunkArgs = {
  sliceName: string;
};

export const startDelete = createAsyncThunk<
  boolean,
  DeleteSSThunkArgs,
  ThunkConfig<DeleteSSState>
>(
  'deleteSS/startDelete',
  async ({ sliceName }: DeleteSSThunkArgs, thunkAPI) => {

    // 1. Add to Stack
    
    
    // 2. Add to Graph

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
      state.deletedSignature = {};
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(startDelete.fulfilled, (state, action: StartRateSSFulfilled) => {
      // Add user to the state array
      
      // 1. Update the ratings
      state.deletedSignature = {};

    });
    builder.addCase(startDelete.rejected, (state, action) => {
        console.log(action.error.message);
    });
  },
});

// Action creators are generated for each case reducer function
export const { forceSignatureRerender } = deleteSS.actions;

export default deleteSS.reducer;
