import {combineReducers, createSlice, PayloadAction} from '@reduxjs/toolkit';

import identityStatsSlice from './identityStatsSlice';
import recoStatsSlice from './recoStatsSlice';
import timeseriesStatsSlice from './timeseriesStatsSlice';
import {
  IdentityViewName,
  AnalyticsViewName,
} from 'ssScreens/StackNav/TabNav/AnayticsScreen/constants';

// INITIAL STATE

export interface SelectedViewState {
  selectedView: AnalyticsViewName;

  selectedViewSignature: {};
}

const initialState: SelectedViewState = {
  selectedView: IdentityViewName,

  selectedViewSignature: {},
};

// ACTIONS

type SetSelectedViewAction = PayloadAction<AnalyticsViewName>;
type ForceRerenderAction = PayloadAction<AnalyticsViewName>;

// SLICE

export const selectedViewSlice = createSlice({
  name: 'selectedViewSlice',
  initialState,
  reducers: {
    setSelectedView: (
      state: SelectedViewState,
      action: SetSelectedViewAction,
    ) => {
      state.selectedView = action.payload;
    },
    forceSignatureRerender: (
      state: SelectedViewState,
      action: ForceRerenderAction,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // 1. Create the set of sideways slices
      state.selectedViewSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const {setSelectedView, forceSignatureRerender} =
  selectedViewSlice.actions;

export default combineReducers({
  selectedViewSlice: selectedViewSlice.reducer,
  identityStatsSlice,
  recoStatsSlice,
  timeseriesStatsSlice,
});
