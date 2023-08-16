import {PayloadAction, createSlice} from '@reduxjs/toolkit';

// INITIAL STATE

export interface ReadGraphState {
  inputSelections: string[];
  outputSelections: string[];
}

const initialState: ReadGraphState = {
  inputSelections: [],
  outputSelections: [],
};

// ACTION TYPES

type SetInputSelectionAction = PayloadAction<string[]>;
type SetOutputSelectionAction = PayloadAction<string[]>;

// SLICE

export const readGraph = createSlice({
  name: 'readGraphSlice',
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
  },
});

// Action creators are generated for each case reducer function
export const {setInputSelections, setOutputSelections} = readGraph.actions;

export default readGraph.reducer;
