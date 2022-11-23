import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {serializeDate} from 'ssUtils/date';

// INITIAL STATE

export interface ReadStackState {
  stackStartDate: string;

  readStackSignature: {};
}

const initialState: ReadStackState = {
  stackStartDate: serializeDate(new Date()),

  readStackSignature: {},
};

// ACTION TYPES

type SetStartDateAction = PayloadAction<string>;
type ForceRatingsRerenderAction = PayloadAction<undefined>;

// SLICE

export const readStack = createSlice({
  name: '_readStack',
  initialState,
  reducers: {
    setStartDate: (state: ReadStackState, action: SetStartDateAction) => {
      state.stackStartDate = action.payload;
    },
    forceSignatureRerender: (
      state: ReadStackState,
      action: ForceRatingsRerenderAction,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // 1. Update the ratings
      state.readStackSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const {setStartDate, forceSignatureRerender} = readStack.actions;

export default readStack.reducer;
