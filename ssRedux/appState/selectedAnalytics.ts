import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {
  IdentityViewName,
  AnalyticsViewName,
} from 'ssScreens/StackNav/TabNav/AnayticsScreen/constants';

// INITIAL STATE

export interface SelectedViewState {
  selectedView: AnalyticsViewName;
}

const initialState: SelectedViewState = {
  selectedView: IdentityViewName,
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
  },
});

// Action creators are generated for each case reducer function
export const {setSelectedView} = selectedViewSlice.actions;

export default selectedViewSlice.reducer;
