/**
 * API to add/rm/edit Categorys, CateogrySets, and CategoryDecorations
 * (by updating json in the RealmJson [GLOBAL_COLLECTION_KEY] Table)
 *
 * This Realm Driver reads/writes to/from a Global RealmJson collection
 * of AllCategorySet and sliceName to csName mapping
 */

import RealmJsonManager, {RealmJson} from '@asianpersonn/realm-json';

import {
  DEFAULT_REALM_JSON_META_REALM_PATH,
  DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
} from '../config';
import {Dict} from '../../../../../global';
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
  GJ_UserCategorySet,
} from 'ssDatabase/api/userJson/category/types';
import {getUniqueId} from 'ssUtils/id';

// VARIABLES
let isLoaded: boolean = false;

// LOAD/CLOSE ----

const load = async (): Promise<void> => {
  if (isLoaded) {
    return;
  }

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

const getRealmJsonManager = (): typeof RealmJsonManager => {
  if (!isLoaded) {
    throw new Error(
      'Must call "load()" before RealmJson (global json) can be used',
    );
  }

  return RealmJsonManager;
};

/**
 * Get a JSON collection (which is a Table composed of a single json object/single row within the GLOBAL_COLLECTION_KEY schema)
 * Then return a JSON subvalue within that collection
 *
 * @param nestedKey
 */
const getGlobalJson = (nestedKey: string) => {
  return getRealmJsonManager()
    .getCollection(GLOBAL_COLLECTION_KEY)
    .getJson(nestedKey);
};

const setGlobalJson = (nestedKey: string, newJson: Dict<any>) => {
  return getRealmJsonManager()
    .getCollection(GLOBAL_COLLECTION_KEY)
    .setJson(nestedKey, newJson);
};

/**
 * Get the CategoryMapping indexed by CategorySetId.CategoryId
 *
 * @returns
 */
const getCDMapping = (): GJ_CategoryDecorationMapping | never => {
  // 1. Get Json Row
  const cdMapping: GJ_CategoryDecorationMapping = getGlobalJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING,
  );

  return cdMapping;
};

/**
 * Get all CategorySet id -> name
 *
 * @returns
 */
const getCSNameMapping = (): GJ_CategorySetNameMapping | never => {
  // 1. Get Json Row
  const csNameMapping: GJ_CategorySetNameMapping = getGlobalJson(
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
  // 1. Get Json Row
  const cNameMapping: GJ_CategoryNameMapping = getGlobalJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING,
  );

  return cNameMapping;
};

/**
 * Get entire mapping for sliceName to csName
 *
 * @returns
 */
const getSliceToCSIdMapping = (): GJ_CategoryNameMapping | never => {
  // 1. Get Json Row
  const sliceToCSIdMapping: GJ_SliceNameToCategorySetIdMapping = getGlobalJson(
    GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING,
  );
  return sliceToCSIdMapping;
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
  // 1. Get Json Rows
  const csNameMapping: GJ_CategorySetNameMapping = getGlobalJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING,
  );

  // 2. Get CategorySet id -> name mapping
  const allCSIds: Set<string> = new Set(Object.values(csNameMapping));

  // 3. Check if csName already exists
  return allCSIds.has(csName);
};

/**
 * Add (will not overwrite) an entire CategorySet to a csId key in the AllCategorySets mapping
 *
 *
 * @param newCSName
 * @param newCS The category ids are actually just category names, so ids will be created for each of them
 * @returns
 */
const addPredefinedCS = (
  predefinedCSName: string,
  userCS: GJ_UserCategorySet,
): void | never => {
  // 0. Do not add duplicate CategorySet
  if (hasCS(predefinedCSName)) {
    return;
  }

  console.log('addPredefinedCS HASSS???');
  console.log(hasCS(predefinedCSName));

  // 1. Get Json Rows
  const cNameMapping: GJ_CategoryNameMapping = getCategoryNameMapping();
  //      Replace cNames with ids
  const existingCIds: Set<string> = new Set(Object.keys(cNameMapping));
  const newCS: GJ_CategorySet = {};
  const cscNameMapping: GJ_CategoryNameMapping = {};
  for (const cName of Object.keys(userCS)) {
    // 3.2.1. Create new cId
    const cId: string = getUniqueId(5, existingCIds);
    existingCIds.add(cId);

    // 3.2.2. Add to cNameMapping
    cscNameMapping[cId] = cName;

    // 3.2.3. Replace c name with id
    newCS[cId] = {
      cId,
      icon: userCS[cName].icon,
      color: userCS[cName].color,
    };
  }

  addCS(predefinedCSName, predefinedCSName, newCS, cscNameMapping);
};

/**
 * Add a CategorySet to UserJson + Update CategoryNameMapping
 *
 * Creates a random, unique 'csId' if not provided
 *
 * @param csName
 * @param csId
 * @param cs
 * @param cscNameMapping - This is the mapping of the category ids included in this CS to their names
 * @returns
 */
const addCS = (
  csName: string,
  csId: string,
  cs: GJ_CategorySet,
  cscNameMapping: GJ_CategoryNameMapping,
): void | never => {
  console.log('ADDCS1-----------------------');
  console.log('ADDCS2-----------------------');

  // 0. Do not add duplicate CategorySet name
  if (hasCS(csName)) {
    return;
  }

  console.log('addCS HASSS???');
  console.log(hasCS(csName));

  console.log(1);

  // 1. Get Json Rows
  const csNameMapping: GJ_CategorySetNameMapping = getCSNameMapping();
  console.log(2);
  const cNameMapping: GJ_CategoryNameMapping = getCategoryNameMapping();
  console.log(3);
  const cdMapping: GJ_CategoryDecorationMapping = getCDMapping();
  console.log(4);

  // 2.1. Save new csId
  // Create new csId only if one is not provided (pre-defined Category Sets will have their own csIds)
  if (csId === '') {
    csId = getUniqueId(5, new Set(Object.keys(csNameMapping)));
  }
  if (csNameMapping[csId] === undefined) {
    setGlobalJson(GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING, {
      ...csNameMapping,
      [csId]: csName,
    });
  }
  console.log(5);

  // TODO: 8/11/2023:
  // WHAT IS THIS?
  // 2.2. Delete cId's that have been removed (do not exist in the new CS)
  // If the CS already exists, there will be keys, else empty list
  const existingCIds: string[] = cdMapping[csId]
    ? Object.keys(cdMapping[csId])
    : [];
  for (let cId of existingCIds) {
    if (cs[cId] === undefined) {
      delete cNameMapping[csId];
    }
  }

  console.log(6);

  // 2.3. Save new cNameMapping
  setGlobalJson(GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING, {
    ...cNameMapping,
    ...cscNameMapping,
  });
  console.log(7);

  console.log('NEW CNAMEMAPPING----------------------------');
  console.log({
    ...cNameMapping,
    ...cscNameMapping,
  });

  // 2.4. Save new cs
  setGlobalJson(GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING, {
    ...cdMapping,
    [csId]: cs,
  });

  console.log('NEW CDMAPPING----------------------------');
  console.log({
    ...cdMapping,
    [csId]: cs,
  });
};

/**
 * Remove a CategorySet from a csName key from the AllCategorySets mapping
 *
 * @param csId
 */
const rmCS = (csId: string): void | never => {
  // 1. Get Json Row
  const cdMapping: GJ_CategoryDecorationMapping = getCDMapping();

  // 2. Remove CategorySet id from cdMapping
  delete cdMapping[csId];

  // 3. Set Json Row, new cdMapping
  setGlobalJson(GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING, cdMapping);
};

const editCD = (csId: string, cdInfo: GJ_CDInfo): void | never => {
  // 1. Get Json Rows
  const cdMapping: GJ_CategoryDecorationMapping = getCDMapping();

  // 2. Get CategorySet
  const cs: GJ_CategorySet = cdMapping[csId];

  try {
    // 3. Get CategoryDecoation
    const cd: GJ_CategoryDecoration = cs[cdInfo.cId];

    // 4. Edit CategoryDecoation
    if (cdInfo.color !== undefined) {
      cd.color = cdInfo.color;
    }
    if (cdInfo.icon !== undefined) {
      cd.icon = cdInfo.icon;
    }
    if (cdInfo.cId !== undefined) {
      cd.cId = cdInfo.cId;
    }

    // 5. Save new id-mapped category
    setGlobalJson(GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING, {
      ...cdMapping,
      [csId]: {
        ...cdMapping[csId],
        [cdInfo.cId]: cd,
      },
    });
  } catch (err) {
    // 6. CSId.CId does not exist
    console.log(err);
  }
  console.log('LOOK AT THIIIIIIS');
  console.log(csId);
  console.log(cdInfo);
  console.log(cs[cdInfo.cId]);

  // const cd: GJ_CategoryDecoration = cs[cdInfo.categoryId];
  // console.log({
  //   ...cdMapping,
  //   [csId]: {
  //     [cdInfo.categoryId]: cd,
  //   },
  // });
};

/**
 * Add/Overwrite a sliceName key from the GJ_SliceNameToCategorySetIdMapping mapping
 *
 * @param sliceName
 */
const addSliceToCSMapping = (sliceName: string, csId: string): void | never => {
  // 1. Json Row
  const sliceToCSIdMapping: GJ_SliceNameToCategorySetIdMapping =
    getSliceToCSIdMapping();

  // 2. Add/Overwrite Json key, sliceName to csName
  sliceToCSIdMapping[sliceName] = csId;

  // 3. Set Json Row
  setGlobalJson(
    GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING,
    sliceToCSIdMapping,
  );
};

/**
 * Remove a sliceName key from the SliceToCategorySet mapping
 *
 * @param sliceName
 */
const rmSliceToCSMapping = (sliceName: string): void | never => {
  // 1. Json Row
  const sliceToCSIdMapping: GJ_SliceNameToCategorySetIdMapping =
    getSliceToCSIdMapping();

  // 2. Delete Json key
  delete sliceToCSIdMapping[sliceName];

  // 3. Set Json Row
  setGlobalJson(
    GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING,
    sliceToCSIdMapping,
  );
};

const Driver: GlobalJsonDriver = {
  isLoaded,
  load,
  closeAll,

  hasCS,
  addPredefinedCS,
  addCS,
  rmCS,
  editCD,
  addSliceToCSMapping,
  rmSliceToCSMapping,

  getCDMapping,
  getCSNameMapping,
  getCategoryNameMapping,
  getSliceToCSIdMapping,
};

export default Driver;
