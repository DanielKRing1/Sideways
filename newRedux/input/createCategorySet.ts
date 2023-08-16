import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import globalDriver from 'ssDatabase/api/userJson/globalDriver';
import {startRefreshAllUserJson} from 'ssRedux/userJson';
import {ThunkConfig} from '../../ssRedux/types';
import {
  GJ_CategoryDecoration,
  GJ_CategoryNameMapping,
  GJ_CategorySet,
  GJ_UserCategoryDecoration,
} from 'ssDatabase/api/userJson/category/types';

// INITIAL STATE

export interface CreateCSState {
  typingCSName: string;
  csId: string;

  cs: GJ_CategorySet;
  cscNameMapping: GJ_CategoryNameMapping;
}

const initialState: CreateCSState = {
  typingCSName: '',
  csId: '',

  cs: {},
  cscNameMapping: {},
};

// ASYNC THUNKS

export const startCreateCS = createAsyncThunk<boolean, undefined, ThunkConfig>(
  'createCS/startCreateCS',
  async (undef, thunkAPI) => {
    const {typingCSName, csId, cs, cscNameMapping} =
      thunkAPI.getState().createCategorySetSlice;

    // 1. Create user-defined Category Sets
    try {
      globalDriver.addCS(typingCSName, csId, cs, cscNameMapping);
    } catch (err) {
      console.log(err);
    }

    // 2. Reset local inputs
    thunkAPI.dispatch(reset());

    // 3.. Refresh UserJsonMap after creating each new user Category Set, so
    //    Category Set Name Mapping, Category Name Mapping, and Category Decorations are available for ui
    thunkAPI.dispatch(startRefreshAllUserJson());

    return true;
  },
);

// ACTION TYPES

type LoadExistingCSAsTemplate = PayloadAction<{
  csName: string;
  csId: string;
  cs: GJ_CategorySet;
  cscNameMapping: GJ_CategoryNameMapping;
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
  name: 'createCategorySet',
  initialState,
  reducers: {
    loadExistingCSAsTemplate: (
      state: CreateCSState,
      action: LoadExistingCSAsTemplate,
    ) => {
      state.typingCSName = action.payload.csName;
      state.csId = action.payload.csId;

      state.cs = action.payload.cs;
      state.cscNameMapping = action.payload.cscNameMapping;
    },

    setNewCategorySetName: (
      state: CreateCSState,
      action: SetNewCSNameAction,
    ) => {
      state.typingCSName = action.payload;
    },
    addC: (state: CreateCSState, action: AddCAction) => {
      const {cName, cd} = action.payload;

      // 1. Add cName to CategoryNameMapping
      state.cscNameMapping[cd.cId] = cName;

      // 2. Add CD to CategorySet
      state.cs[cd.cId] = cd;
    },
    editC: (state: CreateCSState, action: EditCAction) => {
      const {cId, partialUserCD} = action.payload;

      if (partialUserCD.icon !== undefined)
        state.cs[cId].icon = partialUserCD.icon;
      if (partialUserCD.color !== undefined)
        state.cs[cId].color = partialUserCD.color;
      if (partialUserCD.name !== undefined)
        state.cscNameMapping[cId] = partialUserCD.name;
    },
    removeC: (state: CreateCSState, action: RmCAction) => {
      const cId: string = action.payload;

      delete state.cs[cId];
      delete state.cscNameMapping[cId];
    },
    reset: (state: CreateCSState, action: ResetAction) => {
      state.typingCSName = '';
      state.csId = '';

      state.cs = {};
      state.cscNameMapping = {};
    },
  },
  extraReducers: builder => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      startCreateCS.fulfilled,
      (state, action: StartCreateCSFulfilled) => {},
    );
    builder.addCase(startCreateCS.rejected, (state, action) => {
      console.log(action.error.message);
    });
  },
});

// Action creators are generated for each case reducer function
export const {setNewCategorySetName, addC, editC, removeC} = createSS.actions;
// Local (maybe use after creating new Category Set)
const {reset} = createSS.actions;

export default createSS.reducer;
