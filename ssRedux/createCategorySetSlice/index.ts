import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import globalDriver from 'ssDatabase/api/userJson/globalDriver';
import {ThunkConfig} from '../types';
import {startRefreshAllUserJson} from 'ssRedux/userJson';
import {
  GJ_UserCategoryDecoration,
  GJ_UserCategorySet,
} from 'ssDatabase/api/userJson/category/types';

// INITIAL STATE

export interface CreateCSState {
  categorySetName: string;
  categories: GJ_UserCategorySet;

  createdSignature: {};
}

const initialState: CreateCSState = {
  categorySetName: '',
  categories: {},

  createdSignature: {},
};

// ASYNC THUNKS

export const startCreateCS = createAsyncThunk<boolean, undefined, ThunkConfig>(
  'createCS/startCreateCS',
  async (undef, thunkAPI) => {
    const {categorySetName, categories} =
      thunkAPI.getState().createCategorySetSlice;

    // 1. Create predefined Category Sets
    globalDriver.addCS(categorySetName, categories);

    // 2. Refresh UserJsonMap after creating default Category Sets, so
    //    Category Set name -> id is available for ui
    thunkAPI.dispatch(startRefreshAllUserJson());

    return true;
  },
);

// ACTION TYPES

type ForceSSRerenderAction = PayloadAction<undefined>;
type SetNewCSNameAction = PayloadAction<string>;
type SetCSAction = PayloadAction<GJ_UserCategorySet>;
type AddCAction = PayloadAction<{
  cName: string;
  userCD: GJ_UserCategoryDecoration;
}>;
type EditCAction = PayloadAction<{
  cName: string;
  partialUserCD: Partial<GJ_UserCategoryDecoration>;
}>;
type RmCAction = PayloadAction<string>;
type ResetAction = PayloadAction<undefined>;
type StartCreateCSFulfilled = PayloadAction<boolean>;

// SLICE

export const createSS = createSlice({
  name: 'createSS',
  initialState,
  reducers: {
    setNewCategorySetName: (
      state: CreateCSState,
      action: SetNewCSNameAction,
    ) => {
      state.categorySetName = action.payload;
    },
    setCS: (state: CreateCSState, action: SetCSAction) => {
      state.categories = action.payload;
    },
    addC: (state: CreateCSState, action: AddCAction) => {
      const {cName, userCD} = action.payload;

      state.categories[cName] = userCD;
    },
    editC: (state: CreateCSState, action: EditCAction) => {
      const {cName, partialUserCD} = action.payload;

      if (partialUserCD.icon !== undefined)
        state.categories[cName].icon = partialUserCD.icon;
      if (partialUserCD.color !== undefined)
        state.categories[cName].color = partialUserCD.color;
      if (partialUserCD.name !== undefined) {
        state.categories[cName].name = partialUserCD.name;

        // Make new name the key
        state.categories[partialUserCD.name] = state.categories[cName];
        delete state.categories[cName];
      }
    },
    removeC: (state: CreateCSState, action: RmCAction) => {
      // Do not need to set state bcus Redux Toolkit uses Immer, which
      // applies mutations to the state
      const cName: string = action.payload;
      delete state.categories[cName];
    },
    reset: (state: CreateCSState, action: ResetAction) => {
      state.categorySetName = '';
      state.categories = {};
    },
    forceSignatureRerender: (
      state: CreateCSState,
      action: ForceSSRerenderAction,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      // 1. Create the set of sideways slices
      state.createdSignature = {};
    },
  },
  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      startCreateCS.fulfilled,
      (state, action: StartCreateCSFulfilled) => {
        // Add user to the state array

        state.createdSignature = {};
      },
    );
    builder.addCase(startCreateCS.rejected, (state, action) => {
      console.log(action.error.message);
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  setNewCategorySetName,
  setCS,
  addC,
  editC,
  removeC,
  forceSignatureRerender,
} = createSS.actions;

const {reset} = createSS.actions;

export default createSS.reducer;
