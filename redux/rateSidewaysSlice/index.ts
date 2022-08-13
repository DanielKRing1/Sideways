import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import DbDriver from '../../database/dbDriver';
import { ThunkConfig } from '../types';

// INITIAL STATE

export interface RateSSState {
  inputs: string[];
  outputs: string[];
  rating: number;

  ratedSignature: {};
};

const initialState: RateSSState = {
  inputs: [],
  outputs: [],
  rating: 0,

  ratedSignature: {},
};

// ASYNC THUNKS

type RateSSThunkArgs = {
  sliceName: string;

  inputs: string[];
  outputs: string[];
  rating: number;
};

export const startRate = createAsyncThunk<
  boolean,
  RateSSThunkArgs,
  ThunkConfig<RateSSState>
>(
  'rateSS/startRate',
  async ({ sliceName, inputs, outputs, rating }: RateSSThunkArgs, thunkAPI) => {

    // 1. Add to Stack
    DbDriver.pushOntoStack(sliceName, {
      inputs,
      outputs,
      rating,
    });
    
    // 2. Rate Graph
    for(const output of outputs) {
      DbDriver.rateGraph(sliceName, output, inputs, rating, new Array(inputs.length).fill(1));
    }

    thunkAPI.dispatch(forceSignatureRerender());
    

    return true;
  }
)

// ACTION TYPES

type ForceRatingsRerenderAction = PayloadAction<undefined>;
type SetRatingAction = PayloadAction<number>;
type SetInputsAction = PayloadAction<string[]>;
type AddInputAction = PayloadAction<string>;
type RmInputAction = PayloadAction<number>;
type SetOutputAction = PayloadAction<string[]>;
type StartRateSSFulfilled = PayloadAction<boolean>;

// SLICE

export const rateSS = createSlice({
  name: 'rateSS',
  initialState,
  reducers: {
    setRating: (state: RateSSState, action: SetRatingAction) => {
      state.rating = action.payload;
    },
    setInputs: (state: RateSSState, action: SetInputsAction) => {
      state.inputs = action.payload;
    },
    addInput: (state: RateSSState, action: AddInputAction) => {
      state.inputs = [ ...state.inputs, action.payload ];
    },
    removeInput: (state: RateSSState, action: RmInputAction) => {
      state.inputs = [ ...state.inputs.splice(action.payload, 1) ];
    },
    setOutputs: (state: RateSSState, action: SetOutputAction) => {
      state.outputs = action.payload;
    },
    forceSignatureRerender: (state: RateSSState, action: ForceRatingsRerenderAction) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // 1. Update the ratings
      state.ratedSignature = {};
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(startRate.fulfilled, (state, action: StartRateSSFulfilled) => {
      // Add user to the state array
      
      // 1. Update the ratings
      state.ratedSignature = {};

    });
    builder.addCase(startRate.rejected, (state, action) => {
        console.log(action.error.message);
    });
  },
});

// Action creators are generated for each case reducer function
export const { forceSignatureRerender, setRating, setInputs, addInput, removeInput, setOutputs } = rateSS.actions;

export default rateSS.reducer;
