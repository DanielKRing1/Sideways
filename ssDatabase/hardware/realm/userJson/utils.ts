import {
  DEFAULT_CATEGORY_ICON,
  DEFAULT_CATEGORY_NAME,
  DEFAULT_CATEGORY_SET_NAME,
  DEFAULT_OUTPUT_ICON,
} from 'ssDatabase/api/userJson/category/constants';
import {
  ASJ_InputNameToCategoryIdMapping,
  ASJ_CATEGORY_ROW_KEY,
  GJ_SliceNameToCategorySetIdMapping,
  GJ_CategoryDecoration,
  GJ_CategorySet,
  GJ_CategoryDecorationMapping,
  OutputDecoration,
  ASJ_OutputNameToDecorationMapping,
  GJ_CategoryWName,
  GJ_CategoryNameMapping,
  GJ_CategorySetNameMapping,
} from 'ssDatabase/api/userJson/category/types';
import {GJ_COLLECTION_ROW_KEY} from 'ssDatabase/api/userJson/globalDriver/types';
import {UserJsonMap} from 'ssDatabase/api/userJson/types';
import {hashToColor} from 'ssUtils/color';
import {Dict} from '../../../../global';

// INPUT UTILS

function getASJValue(key: ASJ_CATEGORY_ROW_KEY, userJsonMap: UserJsonMap) {
  return userJsonMap[key];
}

export function getCSIds(userJsonMap: UserJsonMap): string[] {
  // 1. Get submaps of Json
  // CategorySet Id - Category Name
  const csNameMapping: GJ_CategorySetNameMapping =
    userJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING];

  // 2. Get CategorySet ids
  const csIds: string[] = Object.keys(csNameMapping);

  return csIds;
}
export function csIdsToCSNames(
  csIds: string[],
  userJsonMap: UserJsonMap,
): string[] {
  // 1. Get submaps of Json
  // CategorySet Id - Category Name
  const csNameMapping: GJ_CategorySetNameMapping =
    userJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING];

  // 2. Get CategorySet names
  const csNames: string[] = csIds.map((csId: string) => csNameMapping[csId]);

  return csNames;
}

/**
 * Get the Category ids of the provided activeSlice's CategorySet
 *
 * @param activeSliceName
 * @param userJsonMap
 * @returns
 */
export function getCSCIds(
  activeSliceName: string,
  userJsonMap: UserJsonMap,
): string[] | undefined {
  // 1. Get submaps of Json
  // Slice Name - Category Set Id
  const snToCSIdMapping: GJ_SliceNameToCategorySetIdMapping =
    userJsonMap[GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING];
  // Category Set Id - Category Decoration
  const cdMapping: GJ_CategoryDecorationMapping =
    userJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING];

  // 2. Get CategorySet
  // Get Category Set id
  const csId: string = snToCSIdMapping[activeSliceName];
  // Get Category Set
  const cs: GJ_CategorySet = cdMapping[csId];

  // 3. Get Category Ids (CategorySet keys)
  const cIds: string[] = Object.keys(cs);

  return cIds;
  // || [];
}
export function cIdsToCNames(
  cIds: string[],
  userJsonMap: UserJsonMap,
): string[] | undefined {
  // 1. Get submaps of Json
  // Category Set Id - Category Decoration
  const cNameMapping: GJ_CategoryNameMapping =
    userJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING];

  // 2. Get Category Names
  const cNames: string[] = cIds.map((cId: string) => cNameMapping[cId]);

  return cNames;
  // || [];
}

export function snToCSName(
  activeSliceName: string,
  userJsonMap: UserJsonMap,
): string | undefined {
  // 1. Get submaps of Json
  // Slice Name - Category Set Id
  const snToCSIdMapping: GJ_SliceNameToCategorySetIdMapping =
    userJsonMap[GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING];
  // Category Set Id - Category Set Name
  const csIdToCSNameMapping: GJ_SliceNameToCategorySetIdMapping =
    userJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING];

  // 2. Get Category Set Id
  const csId: string = snToCSIdMapping[activeSliceName];

  // 3. Get Category Set Name
  const cName: string = csIdToCSNameMapping[csId];

  return cName;
  // || DEFAULT_CATEGORY_SET_NAME;
}

export function inToLastCId(
  inputName: string,
  userJsonMap: UserJsonMap,
): string {
  let cId: string = '';

  try {
    // 1. Get submaps of Json
    // Input Name - Category Id
    const inToCIdMapping: ASJ_InputNameToCategoryIdMapping =
      userJsonMap[ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING];

    // 2. Convert SliceName - CSId and InputName - CId
    // Category Id
    cId = inToCIdMapping[inputName].categoryId;
  } catch (err) {
    console.log(err);
  }

  return cId;
}

export function cIdToCName(
  categoryId: string,
  userJsonMap: UserJsonMap,
): string {
  // 1. Get submaps of Json
  const cIdToCNameMapping: GJ_CategoryNameMapping =
    userJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING];

  // 2. Convert SliceName - CSId and InputName - CId
  // Category Id
  const cName: string = cIdToCNameMapping[categoryId];

  return cName;
}

export function cIdToCD(
  activeSliceName: string,
  categoryId: string,
  userJsonMap: UserJsonMap,
): GJ_CategoryDecoration {
  // 1. Get submaps of Json
  const snToCSIdMapping: GJ_SliceNameToCategorySetIdMapping =
    userJsonMap[GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING];
  const cdMapping: GJ_CategoryDecorationMapping =
    userJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING];

  // 2. Convert SliceName to CategorySet Id + CategoryId to CategoryDecoration
  // CategorySet Id
  const csId: string = snToCSIdMapping[activeSliceName];
  try {
    // Get CategoryDecoration from CategorySliceId.CategoryId
    const cd: GJ_CategoryDecoration = cdMapping[csId][categoryId];
    return cd;
  } catch (err) {
    // CategorySetId.CategoryId does not exist
    return genDefaultCategoryDecoration(categoryId);
  }
}

export function getInputCategoryWName(
  activeSliceName: string,
  inputName: string,
  userJsonMap: UserJsonMap,
): GJ_CategoryWName {
  // 1. Get submaps of Json
  // Slice Name - Category Set Id
  const snToCSIdMapping: GJ_SliceNameToCategorySetIdMapping =
    userJsonMap[GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING];
  // Input Name - Category Id
  const inToCIdMapping: ASJ_InputNameToCategoryIdMapping =
    userJsonMap[ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING];
  // Category Id - Category Name
  const cIdToCNameMapping: GJ_CategoryNameMapping =
    userJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING];

  // 2. Convert SliceName - CSId and InputName - CId
  // Category Set Id
  const csId: string = snToCSIdMapping[activeSliceName];
  // Category Id
  const cId: string = inToCIdMapping[inputName].categoryId;
  // Category Name
  const cName: string = cIdToCNameMapping[cId];

  try {
    // 3. Get Category
    const cdMapping: GJ_CategoryDecorationMapping =
      userJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING];
    const categorySet: GJ_CategorySet = cdMapping[csId];
    const category: GJ_CategoryDecoration = categorySet[cId];

    // 4. CategoryId did not exist
    if (category !== undefined)
      return {
        categoryName: cName,
        ...category,
      };
  } catch (err) {
    // 5. CategorySetId did not exist
  }

  // 6. Return default
  return genDefaultCategoryDecoration(cId);
}

function genDefaultCategoryDecoration(cId: string): GJ_CategoryWName {
  return {
    categoryName: DEFAULT_CATEGORY_NAME,
    icon: DEFAULT_CATEGORY_ICON,
    color: hashToColor(cId),
  };
}

// OUTPUT UTILS

// colorMap={{
//     0: 'green',
//     1: '#FFA99F',
//     2: 'yellow',
//   }}
export function getOutputDecorationSubset<T>(
  outputNames: string[],
  userJsonMap: UserJsonMap,
  mutateKey: (i: number) => number | string,
  mutateValue: (outputDecorationValue: OutputDecoration) => T,
): Dict<T> {
  return outputNames.reduce<Dict<T>>((acc, outputName: string, i) => {
    acc[mutateKey(i)] = mutateValue(
      getOutputDecorationValue(outputName, userJsonMap),
    );

    return acc;
  }, {});
}

// gradientColors={[
//     { offset: "0%", color:"green" },
//     { offset: "40%", color:"#FFA99F" },
//     { offset: "100%", color:"yellow" },
//   ]}
export function getOutputDecorationList<T>(
  outputNames: string[],
  userJsonMap: UserJsonMap,
  mutateValue: (i: number, outputDecorationValue: OutputDecoration) => T,
): T[] {
  return outputNames.reduce<T[]>((acc, outputName: string, i) => {
    acc.push(mutateValue(i, getOutputDecorationValue(outputName, userJsonMap)));

    return acc;
  }, []);
}

/**
 * Dig outputName's OutputDecoration obj out of 'userJsonMap',
 * Returning a default obj if none
 *
 * @param outputName
 * @param userJsonMap
 * @returns
 */
export function getOutputDecorationValue(
  outputName: string,
  userJsonMap: UserJsonMap,
): OutputDecoration {
  // 1. Get all output decorations
  const outputDecorations: ASJ_OutputNameToDecorationMapping =
    userJsonMap[ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING];

  // 2. Get outputDecoration
  const outputDecoration: OutputDecoration | undefined =
    outputDecorations[outputName];

  return outputDecoration || genDefaultOutputDecoration(outputName);
}

function genDefaultOutputDecoration(outputName: string) {
  return {
    icon: DEFAULT_OUTPUT_ICON,
    color: hashToColor(outputName),
  };
}
