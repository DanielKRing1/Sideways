import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import userJsonDriver from 'ssDatabase/api/userJson/';
import {getUserJsonMapValue} from 'ssDatabase/hardware/realm/userJson/utils';

import {ThunkConfig} from '../types';
import {UserJsonMap} from 'ssDatabase/api/userJson/types';
import {
  GJ_CategoryMapping,
  GJ_CategoryNameMapping,
  GJ_CategorySetNameMapping,
  GJ_SliceNameToCategorySetIdMapping,
  UJ_CATEGORY_ROW_KEY,
  UJ_InputNameToCategoryIdMapping,
} from 'ssDatabase/api/userJson/category/types';
import {GLOBAL_COLLECTION_ROW_KEY} from 'ssDatabase/api/userJson/globalDriver/types';
import globalDriver from 'ssDatabase/api/userJson/globalDriver';

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
    [GLOBAL_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING]: {},
    [GLOBAL_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING]: {},
    [GLOBAL_COLLECTION_ROW_KEY.CATEGORY_MAPPING]: {},
    [GLOBAL_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_NAME_MAPPING]: {},
    [UJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_NAME_MAPPING]: {},
  },

  // RERENDER
  userJsonSignature: {},
};

// THUNKS

// SET ALL
type StartRefreshAllUserJsonArgs = undefined;
export const startRefreshAllUserJson = createAsyncThunk<
  boolean,
  StartRefreshAllUserJsonArgs,
  ThunkConfig
>('userJsonSlice/startSetAllUserJson', async (undef, thunkAPI) => {
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
});

type StartRefreshCategoryMappingArgs = undefined;
export const startRefreshCategoryMapping = createAsyncThunk<
  boolean,
  StartRefreshCategoryMappingArgs,
  ThunkConfig
>('userJsonSlice/startRefreshCategoryMapping', async (undef, thunkAPI) => {
  // 1. Get fullUserJsonMap
  const {fullUserJsonMap} = thunkAPI.getState().userJsonSlice;

  // 2. Get fresh fullUserJsonMap
  const freshCategoryMapping: GJ_CategoryMapping =
    await globalDriver.getCategoryMapping();

  // 3. Update fullUserJsonMap
  thunkAPI.dispatch(
    setFullUserJsonMap({
      ...fullUserJsonMap,
      [GLOBAL_COLLECTION_ROW_KEY.CATEGORY_MAPPING]: freshCategoryMapping,
    }),
  );
  thunkAPI.dispatch(forceSignatureRerender());

  return true;
});

type StartRefreshCategorySetNameMappingArgs = undefined;
export const startRefreshCategorySetNameMapping = createAsyncThunk<
  boolean,
  StartRefreshCategorySetNameMappingArgs,
  ThunkConfig
>(
  'userJsonSlice/startRefreshCategorySetNameMapping',
  async (undef, thunkAPI) => {
    // 1. Get fullUserJsonMap
    const {fullUserJsonMap} = thunkAPI.getState().userJsonSlice;

    // 2. Get fresh categorySetNameMapping
    const freshCategorySetNameMapping: GJ_CategorySetNameMapping =
      await globalDriver.getCategorySetNameMapping();

    // 3. Update fullUserJsonMap
    thunkAPI.dispatch(
      setFullUserJsonMap({
        ...fullUserJsonMap,
        [GLOBAL_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING]:
          freshCategorySetNameMapping,
      }),
    );
    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  },
);

type StartRefreshCategoryNameMappingArgs = undefined;
export const startRefreshCategoryNameMapping = createAsyncThunk<
  boolean,
  StartRefreshCategoryNameMappingArgs,
  ThunkConfig
>('userJsonSlice/startRefreshCategoryNameMapping', async (undef, thunkAPI) => {
  // 1. Get fullUserJsonMap
  const {fullUserJsonMap} = thunkAPI.getState().userJsonSlice;

  // 2. Get fresh categoryNameMapping
  const freshCategoryNameMapping: GJ_CategoryNameMapping =
    await globalDriver.getCategoryNameMapping();

  // 3. Update fullUserJsonMap
  thunkAPI.dispatch(
    setFullUserJsonMap({
      ...fullUserJsonMap,
      [GLOBAL_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING]:
        freshCategoryNameMapping,
    }),
  );
  thunkAPI.dispatch(forceSignatureRerender());

  return true;
});

type StartRefreshSliceToCategoryMappingArgs = undefined;
export const startRefreshSliceToCategoryMapping = createAsyncThunk<
  boolean,
  StartRefreshSliceToCategoryMappingArgs,
  ThunkConfig
>(
  'userJsonSlice/startRefreshSliceToCategoryMapping',
  async (undef, thunkAPI) => {
    // 1. Get fullUserJsonMap
    const {fullUserJsonMap} = thunkAPI.getState().userJsonSlice;

    // 2. Get fresh sliceToCategoryMapping
    const freshSliceToCategoryMapping: GJ_SliceNameToCategorySetIdMapping =
      await globalDriver.getSliceToCategoryMapping();

    // 3. Update fullUserJsonMap
    thunkAPI.dispatch(
      setFullUserJsonMap({
        ...fullUserJsonMap,
        [GLOBAL_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_NAME_MAPPING]:
          freshSliceToCategoryMapping,
      }),
    );
    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  },
);

type StartRefreshInputNameToCategoryNameMappingArgs = undefined;
export const startRefreshInputeNameToCategoryNameMapping = createAsyncThunk<
  boolean,
  StartRefreshInputNameToCategoryNameMappingArgs,
  ThunkConfig
>(
  'userJsonSlice/startRefreshInputNameToCategoryNameMapping',
  async (undef, thunkAPI) => {
    // 1. Get fullUserJsonMap
    const {fullUserJsonMap} = thunkAPI.getState().userJsonSlice;

    // 2. Get fresh inputNameToCategoryNameMapping
    const freshInputNameToCategoryNameMapping: UJ_InputNameToCategoryIdMapping =
      await globalDriver.getSliceToCategoryMapping();

    // 3. Update fullUserJsonMap
    thunkAPI.dispatch(
      setFullUserJsonMap({
        ...fullUserJsonMap,
        [UJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_NAME_MAPPING]:
          freshInputNameToCategoryNameMapping,
      }),
    );
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
