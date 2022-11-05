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

  const cdMapping: GJ_CategoryDecorationMapping =
    GlobalJsonDriver.getCategoryDecorationMapping();
  const categorySetNameMapping: GJ_CategorySetNameMapping =
    GlobalJsonDriver.getCategorySetNameMapping();
  const categoryNameMapping: GJ_CategoryNameMapping =
    GlobalJsonDriver.getCategoryNameMapping();
  const sliceToCategorySetMapping: GJ_SliceNameToCategorySetIdMapping =
    GlobalJsonDriver.getSliceToCategoryMapping();

  const inputNameToCategoryNameMapping: ASJ_InputNameToCategoryIdMapping =
    CategoryJsonDriver.getAllInputCategories(activeSlice);
  const outputNameToDecorationMapping: ASJ_OutputNameToDecorationMapping =
    CategoryJsonDriver.getAllOutputDecorations(activeSlice);

  return {
    [GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING]: cdMapping,
    [GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING]: categorySetNameMapping,
    [GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING]: categoryNameMapping,
    [GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_NAME_MAPPING]:
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
