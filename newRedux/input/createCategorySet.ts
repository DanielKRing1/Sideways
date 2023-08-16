import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import globalDriver from 'ssDatabase/api/userJson/globalDriver';
import {ThunkConfig} from '../../ssRedux/types';
import {startRefreshAllUserJson} from 'ssRedux/userJson';
import {
  GJ_CategoryDecoration,
  GJ_CategoryNameMapping,
  GJ_CategorySet,
  GJ_UserCategoryDecoration,
} from 'ssDatabase/api/userJson/category/types';

// INITIAL STATE

export interface CreateCSState {
  categorySetName: string;
  csId: string;

  categories: GJ_CategorySet;
  categoryNameMapping: GJ_CategoryNameMapping;
  createdSignature: {};
}

const initialState: CreateCSState = {
  categorySetName: '',
  csId: '',

  categories: {},
  categoryNameMapping: {},

  createdSignature: {},
};

// ASYNC THUNKS

export const startCreateCS = createAsyncThunk<boolean, undefined, ThunkConfig>(
  'createCS/startCreateCS',
  async (undef, thunkAPI) => {
    const {categorySetName, csId, categories, categoryNameMapping} =
      thunkAPI.getState().createCategorySetSlice;

    // 1. Create predefined Category Sets
    try {
      globalDriver.addCS(
        categorySetName,
        csId,
        categories,
        categoryNameMapping,
      );
    } catch (err) {
      console.log(err);
    }

    // 2. Refresh UserJsonMap after creating default Category Sets, so
    //    Category Set name -> id is available for ui
    thunkAPI.dispatch(startRefreshAllUserJson());

    return true;
  },
);

// ACTION TYPES

type ForceSSRerenderAction = PayloadAction<undefined>;
type InitExistingCSAction = PayloadAction<{
  csName: string;
  csId: string;
  categories: GJ_CategorySet;
  categoryNameMapping: GJ_CategoryNameMapping;
}>;
type SetNewCSNameAction = PayloadAction<string>;
type AddCAction = PayloadAction<{
  cName: string;
  cd: GJ_CategoryDecoration;
}>;
type EditCAction = PayloadAction<{
  cId: string;
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
    initExistingCS: (state: CreateCSState, action: InitExistingCSAction) => {
      state.categorySetName = action.payload.csName;
      state.csId = action.payload.csId;

      state.categories = action.payload.categories;
      state.categoryNameMapping = action.payload.categoryNameMapping;
    },
    setNewCategorySetName: (
      state: CreateCSState,
      action: SetNewCSNameAction,
    ) => {
      state.categorySetName = action.payload;
    },
    addC: (state: CreateCSState, action: AddCAction) => {
      console.log('ADDC-----------------------------');
      const {cName, cd} = action.payload;

      state.categoryNameMapping[cd.cId] = cName;

      // 2. Add CD
      state.categories[cd.cId] = cd;
    },
    editC: (state: CreateCSState, action: EditCAction) => {
      const {cId, partialUserCD} = action.payload;
      console.log('EDITC-----------------------------');
      console.log(action.payload);

      if (partialUserCD.icon !== undefined)
        state.categories[cId].icon = partialUserCD.icon;
      if (partialUserCD.color !== undefined)
        state.categories[cId].color = partialUserCD.color;
      if (partialUserCD.name !== undefined)
        state.categoryNameMapping[cId] = partialUserCD.name;
    },
    removeC: (state: CreateCSState, action: RmCAction) => {
      // Do not need to set state bcus Redux Toolkit uses Immer, which
      // applies mutations to the state
      const cId: string = action.payload;
      console.log('REMOVEC--------------------------------------');
      console.log(cId);
      delete state.categories[cId];
      delete state.categoryNameMapping[cId];
    },
    reset: (state: CreateCSState, action: ResetAction) => {
      state.categorySetName = '';
      state.csId = '';

      state.categories = {};
      state.categoryNameMapping = {};
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
  initExistingCS,
  setNewCategorySetName,
  addC,
  editC,
  removeC,
  forceSignatureRerender,
} = createSS.actions;

const {reset} = createSS.actions;

export default createSS.reducer;
