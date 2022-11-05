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
  ASJ_CategoryInfo,
  ASJ_CATEGORY_ROW_KEY,
  ASJ_CategoryDriver,
  ASJ_OutputDecorationInfo,
  ASJ_OutputNameToDecorationMapping,
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

  // 1.2. Get activeSlice json collection
  // 'getJson' will create rows if they do not already exist
  const jsonCollection: RealmJson =
    RealmJsonManager.getCollection(activeSliceName);

  // 1.3. Create InputCategory json rows
  // 'getJson' will create rows if they do not already exist
  jsonCollection.getJson(
    ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING,
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
      'Must call "load()" before RealmJson (user json categories) can be used',
    );
};

// INPUT CATEGORIES

/**
 * For an 'activeSliceName',
 * Add to the mapping for inputName to categoryName
 *
 * @param activeSliceName
 * @param newInputCategory
 */
const addInputCategories = (
  activeSliceName: string,
  categoryInfo: ASJ_CategoryInfo,
): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson =
    RealmJsonManager.getCollection(activeSliceName);

  // 2. Get Json Row
  const inputToCategoryMapping: ASJ_InputNameToCategoryIdMapping =
    jsonCollection.getJson(
      ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING,
    );

  // 3. Save newInputCategory
  inputToCategoryMapping[categoryInfo.inputId] = categoryInfo.categoryId;

  // 4. Set Json Row
  jsonCollection.setJson(
    ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING,
    inputToCategoryMapping,
  );
};
/**
 * For an 'activeSliceName',
 * Remove inputName keys from the mapping for inputName to categoryName
 *
 * @param activeSliceName
 * @param inputNamesToRm
 */
const rmInputCategories = (
  activeSliceName: string,
  inputNamesToRm: string[],
): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson =
    RealmJsonManager.getCollection(activeSliceName);

  // 2. Get Json Row
  const inputToCategoryMapping: ASJ_InputNameToCategoryIdMapping =
    jsonCollection.getJson(
      ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING,
    );

  // 3. Delete each inputId
  for (const inputId of inputNamesToRm) {
    delete inputToCategoryMapping[inputId];
  }

  // 4. Set Json Row
  jsonCollection.setJson(
    ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING,
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
): ASJ_InputNameToCategoryIdMapping | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson =
    RealmJsonManager.getCollection(activeSliceName);

  // 2. Get Json Row
  const inputToCategoryMapping: ASJ_InputNameToCategoryIdMapping =
    jsonCollection.getJson(
      ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING,
    );

  return inputToCategoryMapping;
};

// OUTPUT DECORATIONS

/**
 * Get 'activeSliceName' collection, then
 * Add to the mapping for outputName to OutputDecoration
 *
 * @param activeSliceName
 * @param outputDecorationInfo
 */
const addOutputDecorations = (
  activeSliceName: string,
  outputDecorationInfo: ASJ_OutputDecorationInfo,
): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson =
    RealmJsonManager.getCollection(activeSliceName);

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
 * Get 'activeSliceName' collection, then
 * Remove outputName keys from the mapping for outputName to OutputDecoration
 *
 * @param activeSliceName
 * @param outputDecorationInfo
 */
const rmOutputDecorations = (
  activeSliceName: string,
  outputIdsToRm: string[],
): void | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson =
    RealmJsonManager.getCollection(activeSliceName);

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
 * Get 'activeSliceName' collection, then
 * Get the mapping for outputName to OutputDecoration
 *
 * @param activeSliceName
 */
// OutName - OutputDecoration
const getAllOutputDecorations = (
  activeSliceName: string,
): ASJ_OutputNameToDecorationMapping | never => {
  throwLoadError();

  // 1. Get Json Table
  const jsonCollection: RealmJson =
    RealmJsonManager.getCollection(activeSliceName);

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

  addInputCategories,
  rmInputCategories,
  getAllInputCategories,

  addOutputDecorations,
  rmOutputDecorations,
  getAllOutputDecorations,
};

export default Driver;
