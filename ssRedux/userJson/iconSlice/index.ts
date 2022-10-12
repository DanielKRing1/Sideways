import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import iconDriver from 'ssDatabase/api/user/icon/iconDriver';

import { IconInfo, StringMap } from '../../../ssDatabase/api/types';
import { ThunkConfig } from '../../types';

// INITIAL STATE

export interface IconState {
  // ICONS
  iconMap: StringMap;

  // RERENDER
  iconsSignature: {};
};

const initialState: IconState = {
  // ICONS
  iconMap: {},

  // RERENDER
  iconsSignature: {},
};

// THUNKS

type StartSetAllIconsArgs = undefined;
export const startSetAllIcons = createAsyncThunk<
  boolean,
  StartSetAllIconsArgs,
  ThunkConfig
>(
  'iconSlice/startSetAllIcons',
  async (undefined: StartSetAllIconsArgs, thunkAPI) => {

    const iconMap: StringMap = await iconDriver.getAllIcons();
    
    thunkAPI.dispatch(setIcons(iconMap));
    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  }
);

type StartAddIconsArgs = IconInfo[];
export const startAddIcons = createAsyncThunk<
  boolean,
  StartAddIconsArgs,
  ThunkConfig
>(
  'iconSlice/startAddIcons',
  async (newIcons: StartAddIconsArgs, thunkAPI) => {

    await iconDriver.saveIcons(newIcons);
    
    thunkAPI.dispatch(startSetAllIcons());

    return true;
  }
);

type StartRmIconsArgs = Omit<IconInfo, 'icon'>[];
export const startRmIcons = createAsyncThunk<
  boolean,
  StartRmIconsArgs,
  ThunkConfig
>(
  'iconSlice/startRmIcons',
  async (iconsToRm: StartRmIconsArgs, thunkAPI) => {

    await iconDriver.rmIcons(iconsToRm);
    
    thunkAPI.dispatch(startSetAllIcons());

    return true;
  }
);

// ACTION TYPES

// Icon
type SetIconsAction = PayloadAction<StringMap>;
// Rerender
type ForceIconRerenderAction = PayloadAction<undefined>;

// SLICE

export const iconSlice = createSlice({
  name: 'iconSlice',
  initialState,
  reducers: {
    // ICONS
    setIcons: (state: IconState, action: SetIconsAction) => {
      state.iconMap = action.payload;
    },
    
    // RERENDER
    forceSignatureRerender: (state: IconState, action: ForceIconRerenderAction) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.iconsSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setIcons, forceSignatureRerender } = iconSlice.actions;


export default iconSlice.reducer;
