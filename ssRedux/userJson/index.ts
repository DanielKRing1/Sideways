import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import dbDriver from 'ssDatabase/api/core/dbDriver';
import userJsonDriver from 'ssDatabase/api/userJson/';

import {ThunkConfig} from '../types';
import {UserJsonMap} from 'ssDatabase/api/userJson/types';
import {
  GJ_CategoryDecorationMapping,
  GJ_CategoryNameMapping,
  GJ_CategorySetNameMapping,
  GJ_SliceNameToCategorySetIdMapping,
  ASJ_CATEGORY_ROW_KEY,
  ASJ_InputNameToCategoryIdMapping,
} from 'ssDatabase/api/userJson/category/types';
import {GJ_COLLECTION_ROW_KEY} from 'ssDatabase/api/userJson/globalDriver/types';
import globalDriver from 'ssDatabase/api/userJson/globalDriver';
import categoryDriver from 'ssDatabase/api/userJson/category';
import {CGNode} from '@asianpersonn/realm-graph';
import {stripNodePostfix} from 'ssDatabase/api/types';
import {rmDuplicates} from 'ssUtils/list';

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
    [GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING]: {},
    [GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING]: {},
    [GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING]: {},
    [GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING]: {},
    [ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING]: {},
    [ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING]: {},
  },

  // RERENDER
  userJsonSignature: {},
};

// THUNKS

// REMOVE INPUTS THAT DO NOT EXIST IN GRAPH
type StartCleanInputCategories = undefined;
export const startCleanInputCategories = createAsyncThunk<
  boolean,
  StartCleanInputCategories,
  ThunkConfig
>('userJsonSlice/startCleanInputCategories', async (undef, thunkAPI) => {
  // 1. Get activeSliceName
  const {activeSliceName} =
    thunkAPI.getState().readSidewaysSlice.toplevelReadReducer;

  // 2. Get all Graph inputs
  const allDbInputs: string[] = rmDuplicates(
    dbDriver
      .getAllNodes(activeSliceName)
      .map((node: CGNode) => stripNodePostfix(node.id)[0]),
  );

  // 3. Get inputCategories
  const inToCIdMapping: ASJ_InputNameToCategoryIdMapping =
    categoryDriver.getAllInputCategories();

  // 4. Keep Graph inputs
  const newMapping: ASJ_InputNameToCategoryIdMapping =
    allDbInputs.reduce<ASJ_InputNameToCategoryIdMapping>((acc, dbInput) => {
      acc[dbInput] = inToCIdMapping[dbInput];

      return acc;
    }, {});

  // 5. Set inputCategories
  categoryDriver.setAllInputCategories(newMapping);

  return true;
});

// SET ALL
type StartRefreshAllUserJsonArgs = undefined;
export const startRefreshAllUserJson = createAsyncThunk<
  boolean,
  StartRefreshAllUserJsonArgs,
  ThunkConfig
>('userJsonSlice/startSetAllUserJson', async (undef, thunkAPI) => {
  console.log('REFRESHING ALL USERJSON');

  // 1. Get activeSliceName
  const {activeSliceName} =
    thunkAPI.getState().readSidewaysSlice.toplevelReadReducer;
  // 2. Get current fullUserJsonMap
  console.log('abt to get all user json');
  const fullUserJsonMap: UserJsonMap = await userJsonDriver.getAllUserJson(
    activeSliceName,
  );

  console.log('FULL USER JSON:');
  console.log(fullUserJsonMap);

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
  const freshCategoryMapping: GJ_CategoryDecorationMapping =
    await globalDriver.getCDMapping();

  // 3. Update fullUserJsonMap
  thunkAPI.dispatch(
    setFullUserJsonMap({
      ...fullUserJsonMap,
      [GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING]: freshCategoryMapping,
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
      await globalDriver.getCSNameMapping();

    // 3. Update fullUserJsonMap
    thunkAPI.dispatch(
      setFullUserJsonMap({
        ...fullUserJsonMap,
        [GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING]:
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
      [GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING]: freshCategoryNameMapping,
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

    // TODO: Since ReduxToolkit uses Immer, do i need to mutate the object here or
    // can i just destructure the top level in the reducer?
    // 3. Update fullUserJsonMap
    thunkAPI.dispatch(
      setFullUserJsonMap({
        ...fullUserJsonMap,
        [GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING]:
          freshSliceToCategoryMapping,
      }),
    );
    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  },
);

type StartRefreshInputNameToCategoryNameMappingArgs = undefined;
export const startRefreshInputNameToCategoryNameMapping = createAsyncThunk<
  boolean,
  StartRefreshInputNameToCategoryNameMappingArgs,
  ThunkConfig
>(
  'userJsonSlice/startRefreshInputNameToCategoryNameMapping',
  async (undef, thunkAPI) => {
    // 1. Get activeSliceName + fullUserJsonMap
    const {activeSliceName} =
      thunkAPI.getState().readSidewaysSlice.toplevelReadReducer;
    const {fullUserJsonMap} = thunkAPI.getState().userJsonSlice;

    // 2. Get fresh inputNameToCategoryNameMapping
    const freshInputNameToCategoryNameMapping: ASJ_InputNameToCategoryIdMapping =
      await categoryDriver.getAllInputCategories();

    // 3. Update fullUserJsonMap
    thunkAPI.dispatch(
      setFullUserJsonMap({
        ...fullUserJsonMap,
        [ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING]:
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
