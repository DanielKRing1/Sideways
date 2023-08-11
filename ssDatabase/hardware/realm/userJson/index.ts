/**
 * API for getting all RealmJSON data
 * Calls GlobalDriver and CategoryDriver
 */

import RealmJsonManager from '@asianpersonn/realm-json';

import {UserJsonDriver, UserJsonMap} from 'ssDatabase/api/userJson/types';
import GlobalJsonDriver from 'ssDatabase/hardware/realm/userJson/globalDriver';
import CategoryJsonDriver from 'ssDatabase/hardware/realm/userJson/categoryDriver';
import {
  GJ_CategoryDecorationMapping,
  GJ_CategoryNameMapping,
  GJ_CategorySetNameMapping,
  GJ_SliceNameToCategorySetIdMapping,
  ASJ_CATEGORY_ROW_KEY,
  ASJ_InputNameToCategoryIdMapping,
  ASJ_OutputNameToDecorationMapping,
} from 'ssDatabase/api/userJson/category/types';
import {GJ_COLLECTION_ROW_KEY} from 'ssDatabase/api/userJson/globalDriver/types';
import {
  DEFAULT_REALM_JSON_META_REALM_PATH,
  DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
} from './config';

// VARIABLES
let isLoaded = (): boolean =>
  GlobalJsonDriver.isLoaded && CategoryJsonDriver.isLoaded;

// LOAD/CLOSE ----

const load = async (activeSliceName: string): Promise<void> => {
  console.log('userJson about to load');

  const promises: Promise<any>[] = [];

  // 1. Load CategoryJsonDriver/Create schemas for the first time
  promises.push(CategoryJsonDriver.load(activeSliceName));

  // 2. Load GlobalJsonDriver/Create schemas for the first time
  // No need to reload, will return early if already loaded
  promises.push(GlobalJsonDriver.load());

  // No need to reload
  if (!isLoaded) {
    // 3. Load all saved collections
    // This may not be necessary, since the needed collections are loaded from GlobalDriver and CategoryDriver
    // And CategoryDriver reloads 'activeSlice' collections as they are requested
    promises.push(
      RealmJsonManager.loadCollections(
        DEFAULT_REALM_JSON_META_REALM_PATH,
        DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
      ),
    );
  }

  await Promise.all(promises);

  console.log('userJson loaded');
};

const closeAll = async (): Promise<void> => {
  const userClosePromise = RealmJsonManager.closeAllCollections();
  const globalClosePromise = RealmJsonManager.closeAllCollections();
  const categoryClosePromise = RealmJsonManager.closeAllCollections();

  Promise.all([userClosePromise, globalClosePromise, categoryClosePromise]);
};

const getGlobalJsonDriver = () => {
  if (!isLoaded)
    throw new Error(
      'Must call "load()" before RealmJson (user json) can be used',
    );

  return GlobalJsonDriver;
};

const getCategoryJsonDriver = () => {
  if (!isLoaded)
    throw new Error(
      'Must call "load()" before RealmJson (user json) can be used',
    );

  return CategoryJsonDriver;
};

/**
 * Get all Global and User-Defined Json data
 * eg (CategorySets, ActiveSlice-CategorySet-Mapping, InputName-CategoryName-Mapping)
 *
 * @param activeSlice
 * @returns
 */
const getAllUserJson = (activeSlice: string): UserJsonMap | never => {
  const cdMapping: GJ_CategoryDecorationMapping =
    getGlobalJsonDriver().getCDMapping();
  const categorySetNameMapping: GJ_CategorySetNameMapping =
    getGlobalJsonDriver().getCSNameMapping();
  const categoryNameMapping: GJ_CategoryNameMapping =
    GlobalJsonDriver.getCategoryNameMapping();
  const sliceToCategorySetMapping: GJ_SliceNameToCategorySetIdMapping =
    getGlobalJsonDriver().getSliceToCSIdMapping();

  let inputNameToCategoryNameMapping: ASJ_InputNameToCategoryIdMapping = {};
  let outputNameToDecorationMapping: ASJ_OutputNameToDecorationMapping = {};
  try {
    inputNameToCategoryNameMapping =
      getCategoryJsonDriver().getAllInputCategories();
    outputNameToDecorationMapping =
      getCategoryJsonDriver().getAllOutputDecorations();
  } catch (err) {
    console.log(err);
    console.log(
      'CategoryJsonDriver threw this error. This is acceptable behavior in the case that:\
      \n1. The user is selecting an active slice for this session (maybe it is the first time they are opening the app), so\
      \n2. There is no active slice selected for this session yet, so\
      \n3. CategoryJsonDriver has not yet loaded properly, but\
      \n4. The GlobalJsonDriver data should still be available',
    );
  }

  return {
    [GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING]: cdMapping,
    [GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING]: categorySetNameMapping,
    [GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING]: categoryNameMapping,
    [GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING]:
      sliceToCategorySetMapping,

    [ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING]:
      inputNameToCategoryNameMapping,
    [ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING]:
      outputNameToDecorationMapping,
  };
};

const Driver: UserJsonDriver = {
  isLoaded,
  load,
  closeAll,

  getAllUserJson,
};

export default Driver;
