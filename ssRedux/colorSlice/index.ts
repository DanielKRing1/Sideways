import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import colorDriver from 'ssDatabase/api/color/colorDriver';

import { ColorInfo, ColorMap } from '../../ssDatabase/api/types';
import { ThunkConfig } from '../types';

// INITIAL STATE

export interface ColorState {
  // COLORS
  colorMap: ColorMap;

  // RERENDER
  colorsSignature: {};
};

const initialState: ColorState = {
  // COLORS
  colorMap: {},

  // RERENDER
  colorsSignature: {},
};

// THUNKS

type StartSetAllColorsArgs = undefined;
export const startSetAllColors = createAsyncThunk<
  boolean,
  StartSetAllColorsArgs,
  ThunkConfig
>(
  'colorSlice/startSetAllColors',
  async (undefined: StartSetAllColorsArgs, thunkAPI) => {

    const colorMap: ColorMap = await colorDriver.getAllColors();
    
    thunkAPI.dispatch(setColors(colorMap));
    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  }
);

type StartAddColorsArgs = ColorInfo[];
export const startAddColors = createAsyncThunk<
  boolean,
  StartAddColorsArgs,
  ThunkConfig
>(
  'colorSlice/startAddColors',
  async (newColors: StartAddColorsArgs, thunkAPI) => {

    await colorDriver.saveColors(newColors);
    
    thunkAPI.dispatch(startSetAllColors());

    return true;
  }
);

type StartRmColorsArgs = Omit<ColorInfo, 'color'>[];
export const startRmColors = createAsyncThunk<
  boolean,
  StartRmColorsArgs,
  ThunkConfig
>(
  'colorSlice/startRmColors',
  async (colorsToRm: StartRmColorsArgs, thunkAPI) => {

    await colorDriver.rmColors(colorsToRm);
    
    thunkAPI.dispatch(startSetAllColors());

    return true;
  }
);

// ACTION TYPES

// Color
type SetColorsAction = PayloadAction<ColorMap>;
// Rerender
type ForceColorRerenderAction = PayloadAction<undefined>;

// SLICE

export const colorSlice = createSlice({
  name: 'colorSlice',
  initialState,
  reducers: {
    // COLORS
    setColors: (state: ColorState, action: SetColorsAction) => {
      state.colorMap = action.payload;
    },
    
    // RERENDER
    forceSignatureRerender: (state: ColorState, action: ForceColorRerenderAction) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.colorsSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setColors, forceSignatureRerender } = colorSlice.actions;


export default colorSlice.reducer;
