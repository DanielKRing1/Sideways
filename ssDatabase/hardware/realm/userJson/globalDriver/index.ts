/**
 * This Realm Driver reads/writes to/from a Global RealmJson collection
 * of AllCategorySet and sliceName to categorySetName mapping
 */

import RealmJsonManager, {RealmJson} from '@asianpersonn/realm-json';

import {
  DEFAULT_REALM_JSON_META_REALM_PATH,
  DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
} from '../config';
import {
  GlobalJsonDriver,
  GLOBAL_COLLECTION_KEY,
  GLOBAL_COLLECTION_ROW_KEY,
} from 'ssDatabase/api/userJson/globalDriver/types';
import {
  AllCategorySets,
  CategorySet,
  SliceToCategorySetMapping,
} from 'ssDatabase/api/userJson/category/types';

// VARIABLES
let isLoaded: boolean = false;

// LOAD/CLOSE ----

const load = async (): Promise<void> => {
  if (isLoaded) return;

  // 1. LOAD GLOBAL COLLECTION
  // 1.1. Try to create global collection for first time
  //      Will fail to create if already exists but still load entire collection
  await RealmJsonManager.createCollection({
    metaRealmPath: DEFAULT_REALM_JSON_META_REALM_PATH,
    loadableRealmPath: DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
    collectionName: GLOBAL_COLLECTION_KEY,
  });
  console.log('Should reach here (globalDriver), even upon fail');
  // 1.2. Get global json collection
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 1.3. Create global json rows
  // 'getJson' will create rows if they do not already exist
  jsonCollection.getJson(GLOBAL_COLLECTION_ROW_KEY.ALL_CATEGORY_SETS);
  jsonCollection.getJson(
    GLOBAL_COLLECTION_ROW_KEY.SLICE_TO_CATEGORY_SET_MAPPING,
  );

  isLoaded = true;
};

const closeAll = async (): Promise<void> => {
  await RealmJsonManager.closeAllCollections();

  isLoaded = false;
};

const throwLoadError = (): void | never => {
  if (!isLoaded)
    throw new Error(
      'Must call "load()" before RealmJson (global json) can be used',
    );
};

/**
 * Add/Overwrite an entire CategorySet to a categorySetName key in the AllCategorySets mapping
 *
 * @param categorySetName
 * @param categorySet
 */
const addCategorySet = (
  categorySetName: string,
  categorySet: CategorySet,
): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Get Json Row
  const allCategorySets: AllCategorySets = jsonCollection.getJson(
    GLOBAL_COLLECTION_ROW_KEY.ALL_CATEGORY_SETS,
  );

  // 3. Add/Overwrite Key of Json Row
  jsonCollection.setJson(GLOBAL_COLLECTION_ROW_KEY.ALL_CATEGORY_SETS, {
    ...allCategorySets,
    [categorySetName]: categorySet,
  });
};

/**
 * Remove a CategorySet from a categorySetName key from the AllCategorySets mapping
 *
 * @param categorySetName
 */
const rmCategorySet = (categorySetName: string): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Get Json Row
  const allCategorySets: AllCategorySets = jsonCollection.getJson(
    GLOBAL_COLLECTION_ROW_KEY.ALL_CATEGORY_SETS,
  );

  // 3. Remove Json key
  delete allCategorySets[categorySetName];

  // 4. Set Json Row
  jsonCollection.setJson(
    GLOBAL_COLLECTION_ROW_KEY.ALL_CATEGORY_SETS,
    allCategorySets,
  );
};

/**
 * Get the mapping of AllCategorySets
 *
 * @returns
 */
const getAllCategorySets = (): AllCategorySets | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Get Json Row
  const allCategorySets: AllCategorySets = jsonCollection.getJson(
    GLOBAL_COLLECTION_ROW_KEY.ALL_CATEGORY_SETS,
  );

  return allCategorySets;
};

/**
 * Overwrite the entire mapping for sliceName to categorySetName of SliceToCategorySetMapping
 *
 * @param newMapping
 */
const setSliceToCategoryMapping = (
  newMapping: SliceToCategorySetMapping,
): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Set Json Row
  jsonCollection.setJson(
    GLOBAL_COLLECTION_ROW_KEY.SLICE_TO_CATEGORY_SET_MAPPING,
    newMapping,
  );
};

/**
 * Add/Overwrite a sliceName key from the SliceToCategorySet mapping
 *
 * @param sliceName
 */
const addSliceToCategoryMapping = (
  sliceName: string,
  categorySetName: string,
): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Json Row
  const sliceToCategorySetMapping: SliceToCategorySetMapping =
    jsonCollection.getJson(
      GLOBAL_COLLECTION_ROW_KEY.SLICE_TO_CATEGORY_SET_MAPPING,
    );
  // 3. Add/Overwrite Json key, sliceName to categorySetName
  sliceToCategorySetMapping[sliceName] = categorySetName;

  // 4. Set Json Row
  jsonCollection.setJson(
    GLOBAL_COLLECTION_ROW_KEY.SLICE_TO_CATEGORY_SET_MAPPING,
    sliceToCategorySetMapping,
  );
};

/**
 * Remove a sliceName key from the SliceToCategorySet mapping
 *
 * @param sliceName
 */
const rmSliceToCategoryMapping = (sliceName: string): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2.Json Row
  const sliceToCategorySetMapping: SliceToCategorySetMapping =
    jsonCollection.getJson(
      GLOBAL_COLLECTION_ROW_KEY.SLICE_TO_CATEGORY_SET_MAPPING,
    );
  // 3. Delete Json key
  delete sliceToCategorySetMapping[sliceName];

  // 4. Set Json Row
  jsonCollection.setJson(
    GLOBAL_COLLECTION_ROW_KEY.SLICE_TO_CATEGORY_SET_MAPPING,
    sliceToCategorySetMapping,
  );
};

/**
 * Get entire mapping for sliceName to categorySetName
 *
 * @returns
 */
const getSliceToCategoryMapping = (): SliceToCategorySetMapping | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Get Json Row
  const sliceToCategorySetMapping: SliceToCategorySetMapping =
    jsonCollection.getJson(
      GLOBAL_COLLECTION_ROW_KEY.SLICE_TO_CATEGORY_SET_MAPPING,
    );

  return sliceToCategorySetMapping;
};

const Driver: GlobalJsonDriver = {
  isLoaded,
  load,
  closeAll,

  addCategorySet,
  rmCategorySet,
  getAllCategorySets,

  setSliceToCategoryMapping,
  rmSliceToCategoryMapping,
  addSliceToCategoryMapping,
  getSliceToCategoryMapping,
};

export default Driver;
