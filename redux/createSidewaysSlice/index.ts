import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import DbDriver from '../../database/dbDriver';
import { ThunkConfig } from '../types';

// INITIAL STATE

export interface CreateSSState {
  sliceName: string;
  possibleOutputs: string[],

  createdSignature: {},
};

const initialState: CreateSSState = {
  sliceName: '',
  possibleOutputs: [],

  createdSignature: {},
};

// ASYNC THUNKS

type CreateSSThunkArgs = {
  sliceName: string,
  possibleOutputs: string[],
};

export const startCreate = createAsyncThunk<
  boolean,
  CreateSSThunkArgs,
  ThunkConfig<CreateSSState>
>(
  'createSS/startCreate',
  async ({ sliceName, possibleOutputs }: CreateSSThunkArgs, thunkAPI) => {

    // 1. Create Stack
    const stackPromise = DbDriver.createStack(sliceName);
    
    // 2. Create Graph
    const graphPromise = DbDriver.createGraph(sliceName, possibleOutputs);

    await Promise.all([ stackPromise, graphPromise ]);

    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  }
)

// ACTION TYPES

type ForceSSRerenderAction = PayloadAction<undefined>;
type SetSliceNameAction = PayloadAction<string>;
type SetPossibleOutputsAction = PayloadAction<string[]>;
type AddPossibleOutputAction = PayloadAction<string>;
type RmPossibleOutputAction = PayloadAction<number>;
type StartCreateSSFulfilled = PayloadAction<boolean>;

// SLICE

export const createSS = createSlice({
  name: 'createSS',
  initialState,
  reducers: {
    setSliceName: (state: CreateSSState, action: SetSliceNameAction) => {
      state.sliceName = action.payload;
    },
    setPossibleOutputs: (state: CreateSSState, action: SetPossibleOutputsAction) => {
      state.possibleOutputs = action.payload;
    },
    addPossibleOutput: (state: CreateSSState, action: AddPossibleOutputAction) => {
      state.possibleOutputs = [ ...state.possibleOutputs, action.payload ];
    },
    removePossibleOutput: (state: CreateSSState, action: RmPossibleOutputAction) => {
      state.possibleOutputs = [ ...state.possibleOutputs.splice(action.payload, 1) ];
    },
    forceSignatureRerender: (state: CreateSSState, action: ForceSSRerenderAction) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // 1. Create the set of sideways slices
      state.createdSignature = {};
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(startCreate.fulfilled, (state, action: StartCreateSSFulfilled) => {
      // Add user to the state array

      state.createdSignature = {};
      
    });
    builder.addCase(startCreate.rejected, (state, action) => {
        console.log(action.error.message);
    });
  },
});

// Action creators are generated for each case reducer function
export const { setSliceName, setPossibleOutputs, addPossibleOutput, removePossibleOutput, forceSignatureRerender } = createSS.actions;

export default createSS.reducer;
