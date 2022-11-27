/**
 * This Realm Driver reads/writes to/from a Global RealmJson collection
 * of AllCategorySet and sliceName to csName mapping
 */

import RealmJsonManager, {RealmJson} from '@asianpersonn/realm-json';

import {
  DEFAULT_REALM_JSON_META_REALM_PATH,
  DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
} from '../config';
import {
  GlobalJsonDriver,
  GLOBAL_COLLECTION_KEY,
  GJ_COLLECTION_ROW_KEY,
} from 'ssDatabase/api/userJson/globalDriver/types';
import {
  GJ_CategorySet,
  GJ_CategorySetNameMapping,
  GJ_CategoryNameMapping,
  GJ_CategoryDecorationMapping,
  GJ_SliceNameToCategorySetIdMapping,
  GJ_CategoryDecoration,
  GJ_CDInfo,
} from 'ssDatabase/api/userJson/category/types';
import {getUniqueId} from 'ssUtils/id';

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
  // CategorySetId - CategorySetName
  jsonCollection.getJson(GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING);
  // CategoryId: CategoryName
  jsonCollection.getJson(GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING);
  // CategorySetId: {
  //  CategoryId: {
  //    icon: string;
  //    color: string;
  //  }
  // }
  jsonCollection.getJson(GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING);
  // SliceName - CategorySetId
  jsonCollection.getJson(
    GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING,
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
 * If GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING
 *    contains 'csName' as a value,
 *    return true
 * else
 *    return false
 *
 * @param csName
 */
const hasCS = (csName: string): boolean => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Get Json Rows
  const csNameMapping: GJ_CategorySetNameMapping = jsonCollection.getJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING,
  );

  // 3. Get CategorySet id -> name mapping
  const allCSIds: Set<string> = new Set(Object.keys(csNameMapping));

  // 4. Check if csName already exists
  return allCSIds.has(csName);
};

/**
 * Add (will not overwrite) an entire CategorySet to a csId key in the AllCategorySets mapping
 *
 * Takes 'names' as input, must convert to unique 'ids'
 *
 * @param newCSName
 * @param newCS
 */
const addCS = (newCSName: string, newCS: GJ_CategorySet): void | never => {
  throwLoadError();

  // 0. Do not add duplicate CategorySet
  if (hasCS(newCSName)) return;

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Get Json Rows
  const csNameMapping: GJ_CategorySetNameMapping = jsonCollection.getJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING,
  );
  const cNameMapping: GJ_CategoryNameMapping = jsonCollection.getJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING,
  );
  const cdMapping: GJ_CategoryDecorationMapping = jsonCollection.getJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING,
  );

  // 3.1. Add CategorySet id mapping key
  const allCSIds: Set<string> = new Set(Object.keys(csNameMapping));
  const newCSId: string = getUniqueId(5, allCSIds);
  jsonCollection.setJson(GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING, {
    ...csNameMapping,
    [newCSId]: newCSName,
  });

  // 3.2. Create ids for newCS.cNames and
  //      Replace cNames with ids
  const existingCIds: Set<string> = new Set(Object.keys(cNameMapping));
  const idMappedCS: GJ_CategorySet = {};
  for (const cName of Object.keys(newCS)) {
    // 3.2.1. Create new cId
    const cId: string = getUniqueId(5, existingCIds);
    existingCIds.add(cId);

    // 3.2.2. Add to cNameMapping
    cNameMapping[cId] = cName;

    // 3.2.3. Replace c name with id
    idMappedCS[cId] = newCS[cName];
  }

  // 3.3. Save new cNameMapping
  jsonCollection.setJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING,
    cNameMapping,
  );

  // 3.4. Save new id-mapped category
  jsonCollection.setJson(GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING, {
    ...cdMapping,
    [newCSId]: idMappedCS,
  });
};

/**
 * Remove a CategorySet from a csName key from the AllCategorySets mapping
 *
 * @param csId
 */
const rmCS = (csId: string): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Get Json Row
  const cdMapping: GJ_CategoryDecorationMapping = jsonCollection.getJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING,
  );

  // 3. Remove CategorySet id from cdMapping
  delete cdMapping[csId];

  // 4. Set Json Row, new cdMapping
  jsonCollection.setJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING,
    cdMapping,
  );
};

const editCD = (csId: string, cdInfo: GJ_CDInfo): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Get Json Rows
  const cdMapping: GJ_CategoryDecorationMapping = jsonCollection.getJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING,
  );

  // 2. Get CategorySet
  const cs: GJ_CategorySet = cdMapping[csId];

  try {
    // 3. Get CategoryDecoation
    const cd: GJ_CategoryDecoration = cs[cdInfo.categoryId];

    // 4. Edit CategoryDecoation
    if (cdInfo.color !== undefined) cd.color = cdInfo.color;
    if (cdInfo.icon !== undefined) cd.icon = cdInfo.icon;

    // 5. Save new id-mapped category
    jsonCollection.setJson(GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING, {
      ...cdMapping,
      [csId]: {
        [cdInfo.categoryId]: cd,
      },
    });
  } catch (err) {
    // 6. CSId.CId does not exist
    console.log(err);
  }
  console.log('LOOK AT THIIIIIIS');
  console.log(JSON.stringify(cdMapping));
  console.log(csId);
  console.log(cs);
  console.log(cdInfo);

  // const cd: GJ_CategoryDecoration = cs[cdInfo.categoryId];
  // console.log({
  //   ...cdMapping,
  //   [csId]: {
  //     [cdInfo.categoryId]: cd,
  //   },
  // });
};

/**
 * Get the CategoryMapping indexed by CategorySetId.CategoryId
 *
 * @returns
 */
const getCDMapping = (): GJ_CategoryDecorationMapping | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Get Json Row
  const cdMapping: GJ_CategoryDecorationMapping = jsonCollection.getJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING,
  );

  return cdMapping;
};

/**
 * Get all CategorySet ids (not names)
 *
 * @returns
 */
const getCSNameMapping = (): GJ_CategorySetNameMapping | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Get Json Row
  const csNameMapping: GJ_CategorySetNameMapping = jsonCollection.getJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING,
  );

  return csNameMapping;
};

/**
 * Get all Category ids (not names)
 *
 * @returns
 */
const getCategoryNameMapping = (): GJ_CategoryNameMapping | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Get Json Row
  const cNameMapping: GJ_CategoryNameMapping = jsonCollection.getJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING,
  );

  return cNameMapping;
};

/**
 * Add/Overwrite a sliceName key from the GJ_SliceNameToCategorySetIdMapping mapping
 *
 * @param sliceName
 */
const addSliceToCSMapping = (sliceName: string, csId: string): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Json Row
  const sliceToCSMapping: GJ_SliceNameToCategorySetIdMapping =
    jsonCollection.getJson(
      GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING,
    );

  // 3. Add/Overwrite Json key, sliceName to csName
  sliceToCSMapping[sliceName] = csId;

  // 4. Set Json Row
  jsonCollection.setJson(
    GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING,
    sliceToCSMapping,
  );
};

/**
 * Remove a sliceName key from the SliceToCategorySet mapping
 *
 * @param sliceName
 */
const rmSliceToCSMapping = (sliceName: string): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2.Json Row
  const sliceToCSMapping: GJ_SliceNameToCategorySetIdMapping =
    jsonCollection.getJson(
      GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING,
    );

  // 3. Delete Json key
  delete sliceToCSMapping[sliceName];

  // 4. Set Json Row
  jsonCollection.setJson(
    GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING,
    sliceToCSMapping,
  );
};

/**
 * Get entire mapping for sliceName to csName
 *
 * @returns
 */
const getSliceToCategoryMapping = ():
  | GJ_SliceNameToCategorySetIdMapping
  | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    GLOBAL_COLLECTION_KEY,
  );

  // 2. Get Json Row
  const sliceToCSMapping: GJ_SliceNameToCategorySetIdMapping =
    jsonCollection.getJson(
      GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING,
    );

  return sliceToCSMapping;
};

const Driver: GlobalJsonDriver = {
  isLoaded,
  load,
  closeAll,

  hasCS,
  addCS,
  rmCS,
  editCD,
  addSliceToCSMapping,
  rmSliceToCSMapping,

  getCDMapping,
  getCSNameMapping,
  getCategoryNameMapping,
  getSliceToCategoryMapping,
};

export default Driver;
