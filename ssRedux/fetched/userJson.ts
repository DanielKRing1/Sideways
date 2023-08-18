import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CGNode} from '@asianpersonn/realm-graph';

import dbDriver from 'ssDatabase/api/core/dbDriver';
import userJsonDriver from 'ssDatabase/api/userJson/';

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
import {ThunkConfig} from '../../ssRedux/types';

import globalDriver from 'ssDatabase/api/userJson/globalDriver';
import categoryDriver from 'ssDatabase/api/userJson/category';
import {stripNodePostfix} from 'ssDatabase/api/types';
import {rmDuplicates} from 'ssUtils/list';

// INITIAL STATE

export interface UserJsonState {
  // All User Json
  fullUserJsonMap: UserJsonMap;
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
  const {activeSliceName} = thunkAPI.getState().appState.activeJournal;

  // 2. Get all Graph inputs
  const allDbInputs: string[] = rmDuplicates(
    dbDriver
      .getAllNodes(activeSliceName)
      .map((node: CGNode) => stripNodePostfix(node.id).id),
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
  const {activeSliceName} = thunkAPI.getState().appState.activeJournal;
  // 2. Get current fullUserJsonMap
  console.log('abt to get all user json');
  const fullUserJsonMap: UserJsonMap = await userJsonDriver.getAllUserJson(
    activeSliceName,
  );

  console.log('FULL USER JSON:');
  console.log(fullUserJsonMap);

  thunkAPI.dispatch(setFullUserJsonMap(fullUserJsonMap));

  return true;
});

type StartRefreshCategoryMappingArgs = undefined;
export const startRefreshCategoryMapping = createAsyncThunk<
  boolean,
  StartRefreshCategoryMappingArgs,
  ThunkConfig
>('userJsonSlice/startRefreshCategoryMapping', async (undef, thunkAPI) => {
  // 1. Get fullUserJsonMap
  const {fullUserJsonMap} = thunkAPI.getState().fetched.userJson;

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
    const {fullUserJsonMap} = thunkAPI.getState().fetched.userJson;

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
  const {fullUserJsonMap} = thunkAPI.getState().fetched.userJson;

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
    const {fullUserJsonMap} = thunkAPI.getState().fetched.userJson;

    // 2. Get fresh sliceToCategoryMapping
    const freshSliceToCategoryMapping: GJ_SliceNameToCategorySetIdMapping =
      await globalDriver.getSliceToCSIdMapping();

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
    const {activeSliceName} = thunkAPI.getState().appState.activeJournal;
    const {fullUserJsonMap} = thunkAPI.getState().fetched.userJson;

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

    return true;
  },
);

// ACTION TYPES

// UserJson
type SetUserJsonAction = PayloadAction<UserJsonMap>;

// SLICE

export const userJsonSlice = createSlice({
  name: 'userJsonSlice',
  initialState,
  reducers: {
    // COLORS
    setFullUserJsonMap: (state: UserJsonState, action: SetUserJsonAction) => {
      state.fullUserJsonMap = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
const {setFullUserJsonMap} = userJsonSlice.actions;
export const {} = userJsonSlice.actions;

export default userJsonSlice.reducer;
