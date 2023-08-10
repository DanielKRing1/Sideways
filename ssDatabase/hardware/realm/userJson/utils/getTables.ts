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

import {
  GJ_CategorySetNameMapping,
  GJ_CategoryNameMapping,
  GJ_CategoryDecorationMapping,
  GJ_SliceNameToCategorySetIdMapping,
  ASJ_InputNameToCategoryIdMapping,
  ASJ_CATEGORY_ROW_KEY,
  ASJ_OutputNameToDecorationMapping,
} from 'ssDatabase/api/userJson/category/types';
import {GJ_COLLECTION_ROW_KEY} from 'ssDatabase/api/userJson/globalDriver/types';
import {UserJsonMap} from 'ssDatabase/api/userJson/types';

export function getCSNameMapping(
  userJsonMap: UserJsonMap,
): GJ_CategorySetNameMapping {
  // 1. Get submaps of Json
  // CategorySet Id - Category Name
  return userJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING];
}
export function getCNameMapping(
  userJsonMap: UserJsonMap,
): GJ_CategoryNameMapping {
  // 1. Get submaps of Json
  // Category Id - Category Name
  return userJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING];
}
export function getCDMapping(
  userJsonMap: UserJsonMap,
): GJ_CategoryDecorationMapping {
  return userJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING];
}
export function getSNToCSIdMapping(
  userJsonMap: UserJsonMap,
): GJ_SliceNameToCategorySetIdMapping {
  return userJsonMap[
    GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING
  ];
}
export function getINToCIdMapping(
  userJsonMap: UserJsonMap,
): ASJ_InputNameToCategoryIdMapping {
  return userJsonMap[ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING];
}

export function getONToCDMapping(
  userJsonMap: UserJsonMap,
): ASJ_OutputNameToDecorationMapping {
  return userJsonMap[ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING];
}
