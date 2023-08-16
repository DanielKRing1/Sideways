import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {serializeDateNum} from 'ssUtils/date';

// INITIAL STATE

export interface ReadStackState {
  stackStartDate: number;
}

const initialState: ReadStackState = {
  stackStartDate: serializeDateNum(new Date()),
};

// ACTION TYPES

type SetStartDateAction = PayloadAction<number>;
type ForceRatingsRerenderAction = PayloadAction<undefined>;

// SLICE

export const readStack = createSlice({
  name: 'readStackSlice',
  initialState,
  reducers: {
    setStartDate: (state: ReadStackState, action: SetStartDateAction) => {
      state.stackStartDate = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setStartDate} = readStack.actions;

export default readStack.reducer;
