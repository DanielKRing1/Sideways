import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GrowingIdText as RateInput } from '../../components/Input/GrowingIdList';
export type { GrowingIdText as RateInput } from '../../components/Input/GrowingIdList';
import DbDriver from '../../database/dbDriver';
import { ThunkConfig } from '../types';

// INITIAL STATE

export interface RateSSState {
  inputs: RateInput[];
  outputs: RateInput[];
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

  inputs: RateInput[];
  outputs: RateInput[];
  rating: number;
};

export const startRate = createAsyncThunk<
  boolean,
  undefined,
  ThunkConfig
>(
  'rateSS/startRate',
  async (undefined, thunkAPI) => {

    const { activeSliceName } = thunkAPI.getState().readSidewaysSlice.toplevelReadReducer;
    const { inputs, outputs, rating } = thunkAPI.getState().rateSidewaysSlice;

    // 1. Add to Stack
    DbDriver.push(activeSliceName, {
      inputs,
      outputs,
      rating,
    });

    // 2. Rate Graph
    const inputTexts: string[] = inputs.map((input: RateInput) => input.text);
    for (const output of outputs) {
      await DbDriver.rateGraph(activeSliceName, output.text, inputTexts, rating, new Array(inputs.length).fill(1));
    }

    thunkAPI.dispatch(setRating(0));
    thunkAPI.dispatch(setOutputs([]));
    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  }
)

// ACTION TYPES

type ForceRatingsRerenderAction = PayloadAction<undefined>;
type SetRatingAction = PayloadAction<number>;
type SetInputsAction = PayloadAction<RateInput[]>;
type AddInputAction = PayloadAction<RateInput>;
type RmInputAction = PayloadAction<number>;
type SetOutputAction = PayloadAction<RateInput[]>;
type AddOutputAction = PayloadAction<RateInput>;
type RmOutputAction = PayloadAction<number>;
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
      state.inputs = [...state.inputs, action.payload];
    },
    removeInput: (state: RateSSState, action: RmInputAction) => {
      state.inputs = [...state.inputs.splice(action.payload, 1)];
    },
    setOutputs: (state: RateSSState, action: SetOutputAction) => {
      state.outputs = action.payload;
    },
    addOutput: (state: RateSSState, action: AddOutputAction) => {
      state.outputs = [...state.outputs, action.payload];
    },
    removeOutput: (state: RateSSState, action: RmOutputAction) => {
      state.outputs = [...state.outputs.splice(action.payload, 1)];
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
export const { forceSignatureRerender, setRating, setInputs, addInput, removeInput, setOutputs, addOutput, removeOutput } = rateSS.actions;

export default rateSS.reducer;
