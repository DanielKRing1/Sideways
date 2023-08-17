import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {ThunkConfig} from 'ssRedux/types';
import {NO_ACTIVE_SLICE_NAME} from 'ssDatabase/api/userJson/category/constants';

// INITIAL STATE

export interface ReadSSState {
  activeSliceName: string;
  typingSliceName: string;
}

const initialState: ReadSSState = {
  activeSliceName: NO_ACTIVE_SLICE_NAME,
  typingSliceName: '',
};

// THUNKS

export const startSetActiveSliceName = createAsyncThunk<
  boolean,
  string,
  ThunkConfig
>(
  'rateSS/startSetActiveSliceName',
  async (selectedActiveSliceName, thunkAPI) => {
    thunkAPI.dispatch(setActiveSliceName(selectedActiveSliceName));

    return true;
  },
);

// ACTION TYPES

type SetActiveSliceAction = PayloadAction<string>;
type SetSearchedSliceAction = PayloadAction<string>;

// SLICE

export const readSS = createSlice({
  name: 'readSS',
  initialState,
  reducers: {
    // ACTIVE SLICE NAME
    setActiveSliceName: (state: ReadSSState, action: SetActiveSliceAction) => {
      state.activeSliceName = action.payload;
      state.typingSliceName = '';
    },
    setTypingSliceName: (
      state: ReadSSState,
      action: SetSearchedSliceAction,
    ) => {
      state.typingSliceName = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setTypingSliceName} = readSS.actions;
const {setActiveSliceName} = readSS.actions;

export default readSS.reducer;
