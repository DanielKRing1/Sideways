import {PayloadAction, createSlice} from '@reduxjs/toolkit';

// INITIAL STATE

export interface ReadGraphState {
  inputSelections: string[];
  outputSelections: string[];

  readGraphSignature: {};
}

const initialState: ReadGraphState = {
  inputSelections: [],
  outputSelections: [],

  readGraphSignature: {},
};

// ACTION TYPES

type SetInputSelectionAction = PayloadAction<string[]>;
type SetOutputSelectionAction = PayloadAction<string[]>;
type ForceRatingsRerenderAction = PayloadAction<undefined>;

// SLICE

export const readGraph = createSlice({
  name: '_readGraph',
  initialState,
  reducers: {
    setInputSelections: (
      state: ReadGraphState,
      action: SetInputSelectionAction,
    ) => {
      state.inputSelections = action.payload;
    },
    setOutputSelections: (
      state: ReadGraphState,
      action: SetOutputSelectionAction,
    ) => {
      state.outputSelections = action.payload;
    },
    forceSignatureRerender: (
      state: ReadGraphState,
      action: ForceRatingsRerenderAction,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // 1. Update the ratings
      state.readGraphSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const {setInputSelections, setOutputSelections, forceSignatureRerender} =
  readGraph.actions;

export default readGraph.reducer;
