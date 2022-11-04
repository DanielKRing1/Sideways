import RealmJsonManager from '@asianpersonn/realm-json';

import {UserJsonDriver, UserJsonMap} from 'ssDatabase/api/userJson/types';
import GlobalJsonDriver from 'ssDatabase/hardware/realm/userJson/globalDriver';
import CategoryJsonDriver from 'ssDatabase/hardware/realm/userJson/categoryDriver';
import {
  GJ_CategoryMapping,
  GJ_CategoryNameMapping,
  GJ_CategorySetNameMapping,
  GJ_SliceNameToCategorySetIdMapping,
  UJ_CATEGORY_ROW_KEY,
  UJ_InputNameToCategoryIdMapping,
} from 'ssDatabase/api/userJson/category/types';
import {GLOBAL_COLLECTION_ROW_KEY} from 'ssDatabase/api/userJson/globalDriver/types';
import {
  DEFAULT_REALM_JSON_META_REALM_PATH,
  DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
} from './config';

// VARIABLES
let isLoaded: boolean = false;

// LOAD/CLOSE ----

const load = async (activeSliceName: string): Promise<void> => {
  if (isLoaded) return;

  // 1. Load GlobalJsonDriver/Create schemas for first
  const loadGlobalPromise: Promise<any> = GlobalJsonDriver.load();
  // 2. Load CategoryJsonDriver/Create schemas for first
  const loadCategoryPromise: Promise<any> =
    CategoryJsonDriver.load(activeSliceName);

  // 3. Load all saved collections
  const loadAllCollectionsPromise = RealmJsonManager.loadCollections(
    DEFAULT_REALM_JSON_META_REALM_PATH,
    DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
  );

  await Promise.all([
    loadGlobalPromise,
    loadCategoryPromise,
    loadAllCollectionsPromise,
  ]);

  isLoaded = true;
};

const closeAll = async (): Promise<void> => {
  const userClosePromise = RealmJsonManager.closeAllCollections();
  const globalClosePromise = RealmJsonManager.closeAllCollections();
  const categoryClosePromise = RealmJsonManager.closeAllCollections();

  Promise.all([userClosePromise, globalClosePromise, categoryClosePromise]);

  isLoaded = false;
};

const throwLoadError = (): void | never => {
  if (!isLoaded)
    throw new Error(
      'Must call "load()" before RealmJson (user json) can be used',
    );
};

/**
 * Get all Global and User-Defined Json data
 * eg (CategorySets, ActiveSlice-CategorySet-Mapping, InputName-CategoryName-Mapping)
 *
 * @param activeSlice
 * @returns
 */
const getAllUserJson = (activeSlice: string): UserJsonMap | never => {
  throwLoadError();

  const categoryMapping: GJ_CategoryMapping =
    GlobalJsonDriver.getCategoryMapping();
  const categorySetNameMapping: GJ_CategorySetNameMapping =
    GlobalJsonDriver.getCategorySetNameMapping();
  const categoryNameMapping: GJ_CategoryNameMapping =
    GlobalJsonDriver.getCategoryNameMapping();
  const sliceToCategorySetMapping: GJ_SliceNameToCategorySetIdMapping =
    GlobalJsonDriver.getSliceToCategoryMapping();

  const allInputCategories: UJ_InputNameToCategoryIdMapping =
    CategoryJsonDriver.getAllInputCategories(activeSlice);

  return {
    [GLOBAL_COLLECTION_ROW_KEY.CATEGORY_MAPPING]: categoryMapping,
    [GLOBAL_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING]:
      categorySetNameMapping,
    [GLOBAL_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING]: categoryNameMapping,
    [GLOBAL_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_NAME_MAPPING]:
      sliceToCategorySetMapping,
    [UJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_NAME_MAPPING]:
      allInputCategories,
  };
};

const Driver: UserJsonDriver = {
  isLoaded,
  load,
  closeAll,

  getAllUserJson,
};

export default Driver;
