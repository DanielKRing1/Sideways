/**
 * Utils for accessing the userJson database
 * Essentially utility methods to join tables
 */

import {
  UNASSIGNED_CATEGORY_ID,
  genDefaultCategoryDecoration,
} from 'ssDatabase/api/userJson/category/constants';
import {
  ASJ_InputNameToCategoryIdMapping,
  GJ_SliceNameToCategorySetIdMapping,
  GJ_CategoryDecoration,
  GJ_CategorySet,
  GJ_CategoryDecorationMapping,
  GJ_CategoryNameMapping,
  GJ_CategorySetNameMapping,
} from 'ssDatabase/api/userJson/category/types';
import {UserJsonMap} from 'ssDatabase/api/userJson/types';
import {
  getCSNameMapping,
  getCDMapping,
  getCNameMapping,
  getSNToCSIdMapping,
  getINToCIdMapping,
} from './getTables';

/*
  CATEGORY_SET_NAME_MAPPING
  {
    categorySetId: categorySetName,
    ...
  }

  CATEGORY_NAME_MAPPING
  {
    categoryId: categoryName
  }
  
  CATEGORY_DECORATION_MAPPING
  {
    categorySetId: {
      categoryId: {
        cId,
        color,
        icon,
      },
      ...
    },
    ...
  }


  SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING
  {
    sliceName: categorySetId,
    ...
  }


*/

// CATEGORY SET UTILS----------------------------------------------------------------

// CATEGORY SET IDS
export function getCSIds(userJsonMap: UserJsonMap): string[] {
  // 1. Get submaps of Json
  // CategorySet Id - Category Name
  const csNameMapping: GJ_CategorySetNameMapping =
    getCSNameMapping(userJsonMap);

  // 2. Get CategorySet ids
  const csIds: string[] = Object.keys(csNameMapping);

  return csIds;
}
// CATEGORY SET ID -> CATEGORY IDS
export function getCSCIds(csId: string, userJsonMap: UserJsonMap) {
  // 1. Get submaps of Json
  // Category Set Id - Category Decoration
  const cdMapping: GJ_CategoryDecorationMapping = getCDMapping(userJsonMap);

  // 2. Get category set
  // Get Category Set
  const cdCS: GJ_CategorySet = cdMapping[csId];
  console.log('getCSCIds():');
  console.log(userJsonMap);
  console.log(cdMapping);
  console.log(csId);
  console.log(cdCS);

  // 3. Get Category Ids (CategorySet keys)
  const cIds: string[] = Object.keys(cdCS);

  return cIds;
}
// CATEGORY SET IDS -> NAMES
export function csIdToCSName(csId: string, userJsonMap: UserJsonMap): string {
  // 1. Get submaps of Json
  // CategorySet Id - Category Name
  const csNameMapping: GJ_CategorySetNameMapping =
    getCSNameMapping(userJsonMap);

  // 2. Get CategorySet names
  const csName: string = csNameMapping[csId];

  return csName;
}
export function csIdsToCSNames(
  csIds: string[],
  userJsonMap: UserJsonMap,
): string[] {
  // 1. Get CategorySet names
  const csNames: string[] = csIds.map((csId: string) =>
    csIdToCSName(csId, userJsonMap),
  );

  return csNames;
}

// CATEGORY UTILS ----------------------------------------------------------------

// CATEGORY IDS -> NAMES
export function cIdToCName(cId: string, userJsonMap: UserJsonMap): string {
  // 1. Get submaps of Json
  const cNameMapping: GJ_CategoryNameMapping = getCNameMapping(userJsonMap);

  // 2. Convert SliceName - CSId and InputName - CId
  // Category Id
  const cName: string = cNameMapping[cId];

  return cName;
}
export function cIdsToCNames(
  cIds: string[],
  userJsonMap: UserJsonMap,
): string[] | undefined {
  // 1. Get Category Names
  const cNames: string[] = cIds.map((cId: string) =>
    cIdToCName(cId, userJsonMap),
  );

  return cNames;
  // || [];
}

// SLICE NAME UTILS ----------------------------------------------------------------

// ACTIVE SLICE NAME -> CATEGORY SET ID
export function snToCSId(
  activeSliceName: string,
  userJsonMap: UserJsonMap,
): string | never {
  // 1. Get submaps of Json
  // Slice Name - Category Set Id
  const snToCSIdMapping: GJ_SliceNameToCategorySetIdMapping =
    getSNToCSIdMapping(userJsonMap);

  // 2. Get Category Set Id
  const csId: string | undefined = snToCSIdMapping[activeSliceName];

  console.log(activeSliceName);
  console.log(userJsonMap);

  if (csId === undefined) {
    throw new Error(
      `Slice name ${activeSliceName} does not map to any Category Set id (thrown from 'snToCSId method)`,
    );
  }

  return csId;
  // || DEFAULT_CATEGORY_SET_ID;
}

// ACTIVE SLICE -> CATEGORY IDS
/**
 * Get the Category ids of the provided activeSlice's CategorySet
 *
 * @param activeSliceName
 * @param userJsonMap
 * @returns
 */
export function snToCIds(
  activeSliceName: string,
  userJsonMap: UserJsonMap,
): string[] | undefined {
  // 1. Get CategorySet
  // Get Category Set id
  const csId: string = snToCSId(activeSliceName, userJsonMap);

  // 2. Get Category Ids (CategorySet keys)
  return getCSCIds(csId, userJsonMap);
}

// CATEGORY DECORATIONS UTILS ----------------------------------------------------------------

// CATEGORY SET ID -> CATEGORY DECORATION OBJ
export function csIdToCD(
  csId: string,
  categoryId: string,
  userJsonMap: UserJsonMap,
): GJ_CategoryDecoration {
  if (categoryId === UNASSIGNED_CATEGORY_ID) {
    return genDefaultCategoryDecoration(categoryId);
  }

  // 1. Get submaps of Json
  const snToCSIdMapping: GJ_SliceNameToCategorySetIdMapping =
    getSNToCSIdMapping(userJsonMap);
  const cdMapping: GJ_CategoryDecorationMapping = getCDMapping(userJsonMap);

  // 2. Convert CategorySetId + CategoryId to CategoryDecoration
  try {
    // Get CategoryDecoration from CategorySliceId.CategoryId
    const cd: GJ_CategoryDecoration = cdMapping[csId][categoryId];
    // console.log('DID NOT THROW AN ERROR');
    // console.log(csId);
    // console.log(categoryId);
    // console.log(cd);
    if (cd === undefined) {
      throw new Error(
        `csIdToCD(): 'cd' === undefined; Generate a default CategoryDecoration`,
      );
    }
    return cd;
  } catch (err) {
    console.log('csIdToCD() Error Below:');
    console.log(err);
    // CategorySetId.CategoryId does not exist
    return genDefaultCategoryDecoration(categoryId);
  }
}

// SLICE NAME -> CATEGORY DECORATION OBJ
export function snToCD(
  activeSliceName: string,
  categoryId: string,
  userJsonMap: UserJsonMap,
): GJ_CategoryDecoration {
  // 1. Get submaps of Json
  const snToCSIdMapping: GJ_SliceNameToCategorySetIdMapping =
    getSNToCSIdMapping(userJsonMap);

  // 2. Convert SliceName to CategorySet Id
  // CategorySet Id
  const csId: string = snToCSIdMapping[activeSliceName];

  return csIdToCD(csId, categoryId, userJsonMap);
}

// INPUT NAME UTILS ----------------------------------------------------------------

// INPUT NAME -> CATEGORY ID
export function inToLastCId(
  inputName: string,
  userJsonMap: UserJsonMap,
): string {
  let cId: string = UNASSIGNED_CATEGORY_ID;

  try {
    // 1. Get submaps of Json
    // Input Name - Category Id
    const inToCIdMapping: ASJ_InputNameToCategoryIdMapping =
      getINToCIdMapping(userJsonMap);
    // console.log('inToLastCId():');
    // console.log(caller);
    // console.log(inToCIdMapping);

    // 2. Convert SliceName - CSId and InputName - CId
    // Category Id
    cId = inToCIdMapping[inputName];
    // console.log(cId);
  } catch (err) {
    console.log('Error was caught, and this is acceptable behavior');
    console.log(err);
  }

  return cId;
}
