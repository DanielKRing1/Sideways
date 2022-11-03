/**
 * This Realm Driver reads/writes to/from an activeSliceName RealmJson collection
 * of activeSlice.inputName to categoryName mapping
 */

import RealmJsonManager, {RealmJson} from '@asianpersonn/realm-json';

import {
  DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
  DEFAULT_REALM_JSON_META_REALM_PATH,
} from '../config';

import {
  UJ_CategoryMap,
  UJ_CategoryInfo,
  UJ_CATEGORY_ROW_KEY,
  UJ_CategoryDriver,
} from 'ssDatabase/api/userJson/category/types';

// VARIABLES
let isLoaded: boolean = false;

// LOAD/CLOSE ----

const load = async (activeSliceName: string): Promise<void> => {
  if (isLoaded) return;

  // 1. LOAD ActiveSlice COLLECTION
  // 1.1. Try to create collection for first time (will fail if already exists)
  await RealmJsonManager.createCollection({
    metaRealmPath: DEFAULT_REALM_JSON_META_REALM_PATH,
    loadableRealmPath: DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
    collectionName: activeSliceName,
  });

  // 1.2. Get global json collection
  // 'getJson' will create rows if they do not already exist
  const jsonCollection: RealmJson =
    RealmJsonManager.getCollection(activeSliceName);

  // 1.3. Create Category json rows
  // 'getJson' will create rows if they do not already exist
  jsonCollection.getJson(UJ_CATEGORY_ROW_KEY.INPUT_TO_CATEGORY_MAPPING);

  isLoaded = true;
};

const closeAll = async (): Promise<void> => {
  await RealmJsonManager.closeAllCollections();

  isLoaded = false;
};

const throwLoadError = (): void | never => {
  if (!isLoaded)
    throw new Error(
      'Must call "load()" before RealmJson (user json categories) can be used',
    );
};

/**
 * For an 'activeSliceName',
 * Overwrite the entire mapping for inputNames to categoryNames
 * (from globalJson.AllCategorySets.CategorySet.CategoryName)
 *
 * @param activeSliceName
 * @param newCategoryMap
 */
const setActiveSliceCategories = (
  activeSliceName: string,
  newCategoryMap: UJ_CategoryMap,
): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson =
    RealmJsonManager.getCollection(activeSliceName);

  // 2. Set Json Row
  jsonCollection.setJson(
    UJ_CATEGORY_ROW_KEY.INPUT_TO_CATEGORY_MAPPING,
    newCategoryMap,
  );
};
/**
 * For an 'activeSliceName',
 * Add to the mapping for inputName to categoryName
 *
 * @param activeSliceName
 * @param newInputCategories
 */
const addInputCategories = (
  activeSliceName: string,
  newInputCategories: UJ_CategoryInfo[],
): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson =
    RealmJsonManager.getCollection(activeSliceName);

  // 2. Get Json Row
  const inputToCategoryMapping: UJ_CategoryMap = jsonCollection.getJson(
    UJ_CATEGORY_ROW_KEY.INPUT_TO_CATEGORY_MAPPING,
  );

  // 3. Save each newInputCategory
  for (const categoryInfo of newInputCategories) {
    inputToCategoryMapping[categoryInfo.inputId] = categoryInfo.categoryId;
  }

  // 4. Set Json Row
  jsonCollection.setJson(
    UJ_CATEGORY_ROW_KEY.INPUT_TO_CATEGORY_MAPPING,
    inputToCategoryMapping,
  );
};
/**
 * For an 'activeSliceName',
 * Remove inputName keys from the mapping for inputName to categoryName
 *
 * @param activeSliceName
 * @param inputIdsToRm
 */
const rmInputCategories = (
  activeSliceName: string,
  inputIdsToRm: string[],
): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson =
    RealmJsonManager.getCollection(activeSliceName);

  // 2. Get Json Row
  const inputToCategoryMapping: UJ_CategoryMap = jsonCollection.getJson(
    UJ_CATEGORY_ROW_KEY.INPUT_TO_CATEGORY_MAPPING,
  );

  // 3. Delete each inputId
  for (const inputId of inputIdsToRm) {
    delete inputToCategoryMapping[inputId];
  }

  // 4. Set Json Row
  jsonCollection.setJson(
    UJ_CATEGORY_ROW_KEY.INPUT_TO_CATEGORY_MAPPING,
    inputToCategoryMapping,
  );
};
/**
 * For an 'activeSliceName',
 * Get the mapping for inputName to categoryName
 *
 * @param activeSliceName
 * @returns
 */
const getAllInputCategories = (
  activeSliceName: string,
): UJ_CategoryMap | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson =
    RealmJsonManager.getCollection(activeSliceName);

  // 2. Get Json Row
  const inputToCategoryMapping: UJ_CategoryMap = jsonCollection.getJson(
    UJ_CATEGORY_ROW_KEY.INPUT_TO_CATEGORY_MAPPING,
  );

  return inputToCategoryMapping;
};

const Driver: UJ_CategoryDriver = {
  isLoaded,
  load,
  closeAll,

  setActiveSliceCategories,
  addInputCategories,
  rmInputCategories,
  getAllInputCategories,
};

export default Driver;
