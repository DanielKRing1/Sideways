import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import userJsonDriver from 'ssDatabase/api/userJson/';
import {getUserJsonMapValue} from 'ssDatabase/hardware/realm/userJson/utils';

import {ThunkConfig} from '../types';
import {UserJsonMap} from 'ssDatabase/api/userJson/types';
import {UJ_CATEGORY_ROW_KEY} from 'ssDatabase/api/userJson/category/types';
import {GLOBAL_COLLECTION_ROW_KEY} from 'ssDatabase/api/userJson/globalDriver/types';

// INITIAL STATE

export interface UserJsonState {
  // All User Json
  fullUserJsonMap: UserJsonMap;

  // RERENDER
  userJsonSignature: {};
}

const initialState: UserJsonState = {
  // All User Json
  fullUserJsonMap: {
    [GLOBAL_COLLECTION_ROW_KEY.ALL_CATEGORY_SETS]: {},
    [GLOBAL_COLLECTION_ROW_KEY.SLICE_TO_CATEGORY_SET_MAPPING]: {},
    [UJ_CATEGORY_ROW_KEY.INPUT_TO_CATEGORY_MAPPING]: {},
  },

  // RERENDER
  userJsonSignature: {},
};

// THUNKS

// SET ALL
type StartSetAllUserJsonArgs = undefined;
export const startSetAllUserJson = createAsyncThunk<
  boolean,
  StartSetAllUserJsonArgs,
  ThunkConfig
>(
  'userJsonSlice/startSetAllUserJson',
  async (undef: StartSetAllUserJsonArgs, thunkAPI) => {
    // 1. Get activeSliceName
    const {activeSliceName} =
      thunkAPI.getState().readSidewaysSlice.toplevelReadReducer;
    // 2. Get current fullUserJsonMap
    const fullUserJsonMap: UserJsonMap = await userJsonDriver.getAllUserJson(
      activeSliceName,
    );

    thunkAPI.dispatch(setFullUserJsonMap(fullUserJsonMap));
    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  },
);

// ACTION TYPES

// UserJson
type SetUserJsonAction = PayloadAction<UserJsonMap>;
// Rerender
type ForceUserJsonRerenderAction = PayloadAction<undefined>;

// SLICE

export const userJsonSlice = createSlice({
  name: 'userJsonSlice',
  initialState,
  reducers: {
    // COLORS
    setFullUserJsonMap: (state: UserJsonState, action: SetUserJsonAction) => {
      state.fullUserJsonMap = action.payload;
    },

    // RERENDER
    forceSignatureRerender: (
      state: UserJsonState,
      action: ForceUserJsonRerenderAction,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.userJsonSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
const {setFullUserJsonMap} = userJsonSlice.actions;
export const {forceSignatureRerender} = userJsonSlice.actions;

export default userJsonSlice.reducer;
