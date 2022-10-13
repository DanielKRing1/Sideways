import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import decorationDriver from 'ssDatabase/api/userJson/decoration';

import { DecorationInfo, DecorationJsonMap, DECORATION_ROW_KEY } from '../../../ssDatabase/api/types';
import { ThunkConfig } from '../../types';

// INITIAL STATE

export interface DecorationState {
  // DECORATIONS
  fullDecorationMap: DecorationJsonMap;

  // RERENDER
  decorationsSignature: {};
};

const initialState: DecorationState = {
  // DEACORATIONS
  fullDecorationMap: {
    [DECORATION_ROW_KEY.INPUT]: {},
    [DECORATION_ROW_KEY.OUTPUT]: {},
  },

  // RERENDER
  decorationsSignature: {},
};

// THUNKS

type StartSetAllDecorationsArgs = undefined;
export const startSetAllDecorations = createAsyncThunk<
  boolean,
  StartSetAllDecorationsArgs,
  ThunkConfig
>(
  'decorationSlice/startSetAllDecorations',
  async (undefined: StartSetAllDecorationsArgs, thunkAPI) => {

    const fullDecorationMap: DecorationJsonMap = await decorationDriver.getAllDecorations();
    
    thunkAPI.dispatch(setDecorations(fullDecorationMap));
    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  }
);

type StartAddDecorationsArgs = DecorationInfo[];
export const startAddDecorations = createAsyncThunk<
  boolean,
  StartAddDecorationsArgs,
  ThunkConfig
>(
  'decorationSlice/startAddDecorations',
  async (newDecorations: StartAddDecorationsArgs, thunkAPI) => {

    await decorationDriver.saveDecorations(newDecorations);
    
    thunkAPI.dispatch(startSetAllDecorations());

    return true;
  }
);

type StartRmDecorationsArgs = Omit<DecorationInfo, 'decoration'>[];
export const startRmDecorations = createAsyncThunk<
  boolean,
  StartRmDecorationsArgs,
  ThunkConfig
>(
  'decorationSlice/startRmDecorations',
  async (decorationsToRm: StartRmDecorationsArgs, thunkAPI) => {

    await decorationDriver.rmDecorations(decorationsToRm);
    
    thunkAPI.dispatch(startSetAllDecorations());

    return true;
  }
);

// ACTION TYPES

// Decoration
type SetDecorationsAction = PayloadAction<DecorationJsonMap>;
// Rerender
type ForceDecorationRerenderAction = PayloadAction<undefined>;

// SLICE

export const decorationSlice = createSlice({
  name: 'decorationSlice',
  initialState,
  reducers: {
    // COLORS
    setDecorations: (state: DecorationState, action: SetDecorationsAction) => {
      state.fullDecorationMap = action.payload;
    },
    
    // RERENDER
    forceSignatureRerender: (state: DecorationState, action: ForceDecorationRerenderAction) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.decorationsSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDecorations, forceSignatureRerender } = decorationSlice.actions;


export default decorationSlice.reducer;
