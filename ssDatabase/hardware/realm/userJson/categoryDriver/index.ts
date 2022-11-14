/**
 * This Realm Driver reads/writes to/from an activeSliceName RealmJson collection
 * of activeSlice.inputName to categoryName mapping
 *
 * 'inputCategories' are a pool of strings, assigned to buckets of inputs
 * 'outputCategories' are a pool of strings, associated with a snapshot/rating of inputs
 */

import RealmJsonManager, {RealmJson} from '@asianpersonn/realm-json';

import {
  DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
  DEFAULT_REALM_JSON_META_REALM_PATH,
} from '../config';

import {
  ASJ_InputNameToCategoryIdMapping,
  ASJ_InputInfo,
  ASJ_CATEGORY_ROW_KEY,
  ASJ_CategoryDriver,
  ASJ_OutputDecorationInfo,
  ASJ_OutputNameToDecorationMapping,
  GJ_CategoryDecorationMapping,
  GJ_CategoryDecoration,
  GJ_CDInfo,
  GJ_SliceNameToCategorySetIdMapping,
} from 'ssDatabase/api/userJson/category/types';
import {GJ_COLLECTION_ROW_KEY} from 'ssDatabase/api/userJson/globalDriver/types';
import {NO_ACTIVE_SLICE_NAME} from 'ssDatabase/api/userJson/category/constants';

// VARIABLES
let isLoaded: boolean = false;
let loadedActiveSliceName: string = NO_ACTIVE_SLICE_NAME;

// LOAD/CLOSE ----

/**
 * 1. Try to create a json 'collection' with name 'collectionName' (a Table named 'collectionName', existing at metaRealmPath.loadableRealmPath)
 *    The Realm at metaRealmPath.loadableRealmPath will reload with this new json table
 *    (the Realm will reload in order to include this new json table schema)
 * 2. Then we will 'get' this collection as a RealmJson wrapper.
 *    The 'collectionName' is the Table's name and the key for getting the wrapper
 *    This wrapper has access to the MetaRealm at metaRealmPath.loadableRealmPath, so it can get its LoadableRealm
 *    and it can use 'collectionName' to query the json Table in this LoadableRealm
 * 3. The collection wrapper uses keys to save raw json in rows within the collection's Table
 *    Querying a key/row that does not exist will create a new row at that key
 *
 * @param activeSliceName
 * @returns
 */
const load = async (activeSliceName: string): Promise<void> => {
  if (loadedActiveSliceName === activeSliceName) return;

  // 1. LOAD ActiveSlice COLLECTION
  // 1.1. Try to create collection for first time (will fail if already exists)
  await RealmJsonManager.createCollection({
    metaRealmPath: DEFAULT_REALM_JSON_META_REALM_PATH,
    loadableRealmPath: DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
    collectionName: activeSliceName,
  });

  // 1.2. Get activeSlice json collection
  const jsonCollection: RealmJson =
    RealmJsonManager.getCollection(activeSliceName);

  // 1.3. Create InputCategory json rows
  // 'getJson' will create rows if they do not already exist
  jsonCollection.getJson(
    ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING,
  );

  isLoaded = true;
  loadedActiveSliceName = activeSliceName;
};

const closeAll = async (): Promise<void> => {
  await RealmJsonManager.closeAllCollections();

  isLoaded = false;
  loadedActiveSliceName = NO_ACTIVE_SLICE_NAME;
};

const throwLoadError = (): void | never => {
  if (!isLoaded)
    throw new Error(
      'Must call "load()" before RealmJson (user json categories) can be used',
    );
};

// INPUT CATEGORIES

/**
 * For an 'loadedActiveSliceName',
 * Upserts to the mapping for inputName to categoryName
 * If already exists, then increments occurence counter
 *
 * @param newInputCategory
 */
const addInputCategory = (inputInfo: ASJ_InputInfo): void | never => {
  throwLoadError();

  // Do not add empty InputName
  if (inputInfo.inputId === '')
    return console.log('Empty inputId in categoryDriver.addInputCategory');

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    loadedActiveSliceName,
  );

  // 2. Get Json Row
  const inputToCategoryMapping: ASJ_InputNameToCategoryIdMapping =
    jsonCollection.getJson(
      ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING,
    );

  // 3. Upsert
  // 3.1. Save newInputCategory
  if (inputToCategoryMapping[inputInfo.inputId] === undefined)
    inputToCategoryMapping[inputInfo.inputId] = {
      categoryId: inputInfo.categoryId,
      counter: 1,
    };
  // 3.2. Increment counter
  else inputToCategoryMapping[inputInfo.inputId].counter++;

  // 4. Set Json Row
  jsonCollection.setJson(
    ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING,
    inputToCategoryMapping,
  );
};
/**
 * For an 'loadedActiveSliceName',
 * Decrement occurent counters
 * At '0', delete inputName keys from the mapping for inputName to categoryName
 *
 * @param inputNamesToRm
 *
 */
const rmInputCategories = (inputNamesToRm: string[]): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    loadedActiveSliceName,
  );

  // 2. Get Json Row
  const inputToCategoryMapping: ASJ_InputNameToCategoryIdMapping =
    jsonCollection.getJson(
      ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING,
    );

  // 3.1. Decrement each inputName's occurenceCounter
  for (const inputName of inputNamesToRm) {
    if (inputToCategoryMapping[inputName] !== undefined) {
      inputToCategoryMapping[inputName].counter--;

      // 3.2. Delete inputName key if counter <= 0
      if (inputToCategoryMapping[inputName].counter <= 0)
        delete inputToCategoryMapping[inputName];
    }
  }

  // 4. Set Json Row
  jsonCollection.setJson(
    ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING,
    inputToCategoryMapping,
  );
};
/**
 * For an 'loadedActiveSliceName',
 * Edit a categoryId's decoration
 *
 * @param categoryInfo
 */
const editCategoryDecoration = (categoryInfo: GJ_CDInfo): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    loadedActiveSliceName,
  );

  // 2. Get Json Row
  const cdMapping: GJ_CategoryDecorationMapping = jsonCollection.getJson(
    GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING,
  );
  const snToCSIdMapping: GJ_SliceNameToCategorySetIdMapping =
    jsonCollection.getJson(
      GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING,
    );

  // 3. Get associated CategorySet
  const csId: string = snToCSIdMapping[loadedActiveSliceName];

  try {
    // 4. Update CategoryDecoration values
    if (categoryInfo.color !== undefined)
      cdMapping[csId][categoryInfo.categoryId].color = categoryInfo.color;
    if (categoryInfo.icon !== undefined)
      cdMapping[csId][categoryInfo.categoryId].icon = categoryInfo.icon;

    // 5. Set Json Row
    jsonCollection.setJson(
      GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING,
      cdMapping,
    );
  } catch (err) {}
};
/**
 * For an 'loadedActiveSliceName',
 * Get the mapping for inputName to categoryName
 *
 * @returns
 */
const getAllInputCategories = (): ASJ_InputNameToCategoryIdMapping | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    loadedActiveSliceName,
  );

  // 2. Get Json Row
  const inputToCategoryMapping: ASJ_InputNameToCategoryIdMapping =
    jsonCollection.getJson(
      ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING,
    );

  return inputToCategoryMapping;
};

// OUTPUT DECORATIONS

/**
 * Get 'loadedActiveSliceName' collection, then
 * Add to the mapping for outputName to OutputDecoration
 *
 * @param outputDecorationInfo
 */
const addOutputDecorations = (
  outputDecorationInfo: ASJ_OutputDecorationInfo,
): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    loadedActiveSliceName,
  );

  // 2. Get Json Row
  const outputToDecorationMapping: ASJ_OutputNameToDecorationMapping =
    jsonCollection.getJson(
      ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING,
    );

  // 3. Save new outputDecorationInfo
  outputToDecorationMapping[outputDecorationInfo.outputId] = {
    icon: outputDecorationInfo.icon,
    color: outputDecorationInfo.color,
  };

  // 4. Set Json Row
  jsonCollection.setJson(
    ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING,
    outputToDecorationMapping,
  );
};

/**
 * Get 'loadedActiveSliceName' collection, then
 * Remove outputName keys from the mapping for outputName to OutputDecoration
 *
 * @param outputDecorationInfo
 */
const rmOutputDecorations = (outputIdsToRm: string[]): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    loadedActiveSliceName,
  );

  // 2. Get Json Row
  const outputToDecorationMapping: ASJ_OutputNameToDecorationMapping =
    jsonCollection.getJson(
      ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING,
    );

  // 3. Delete each inputId
  for (const outputId of outputIdsToRm) {
    delete outputToDecorationMapping[outputId];
  }

  // 4. Set Json Row
  jsonCollection.setJson(
    ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING,
    outputToDecorationMapping,
  );
};

/**
 * Get 'loadedActiveSliceName' collection, then
 * Edit an outputs's OutputDecoration
 *
 * @param outputDecorationInfo
 */
const editOutputDecoration = (
  outputDecorationInfo: ASJ_OutputDecorationInfo,
): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    loadedActiveSliceName,
  );

  // 2. Get Json Row
  const outputToDecorationMapping: ASJ_OutputNameToDecorationMapping =
    jsonCollection.getJson(
      ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING,
    );

  // 3. Save new outputDecorationInfo
  outputToDecorationMapping[outputDecorationInfo.outputId] = {
    icon: outputDecorationInfo.icon,
    color: outputDecorationInfo.color,
  };

  // 4. Set Json Row
  jsonCollection.setJson(
    ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING,
    outputToDecorationMapping,
  );
};

/**
 * Get 'loadedActiveSliceName' collection, then
 * Get the mapping for outputName to OutputDecoration
 *
 */
// OutName - OutputDecoration
const getAllOutputDecorations = ():
  | ASJ_OutputNameToDecorationMapping
  | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson = RealmJsonManager.getCollection(
    loadedActiveSliceName,
  );

  // 2. Get Json Row
  const outputToCategoryMapping: ASJ_OutputNameToDecorationMapping =
    jsonCollection.getJson(
      ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING,
    );

  return outputToCategoryMapping;
};

const Driver: ASJ_CategoryDriver = {
  isLoaded,
  load,
  closeAll,

  addInputCategory,
  rmInputCategories,
  getAllInputCategories,

  addOutputDecorations,
  rmOutputDecorations,
  getAllOutputDecorations,
  editOutputDecoration,
};

export default Driver;
