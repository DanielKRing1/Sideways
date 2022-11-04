import {
  GJ_CategorySetNameMapping,
  GJ_CategoryNameMapping,
  GJ_CategoryMapping,
  GJ_SliceNameToCategorySetIdMapping,
  GJ_CategorySet,
} from '../category/types';

/**
 * Keep a separate 'Global' collection of
 * - Available CategorySets
 */
export const GLOBAL_COLLECTION_KEY = 'GLOBAL_DATA';
export enum GLOBAL_COLLECTION_ROW_KEY {
  // CATEGORY SPECIFIC
  CATEGORY_SET_NAME_MAPPING = 'CATEGORY_SET_NAME_MAPPING',
  CATEGORY_NAME_MAPPING = 'CATEGORY_NAME_MAPPING',
  CATEGORY_MAPPING = 'CATEGORY_MAPPING',
  SLICE_NAME_TO_CATEGORY_SET_NAME_MAPPING = 'SLICE_NAME_TO_CATEGORY_SET_NAME_MAPPING',
}

export type GlobalCategoryJsonMap = {
  [GLOBAL_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING]: GJ_CategorySetNameMapping;
  [GLOBAL_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING]: GJ_CategoryNameMapping;
  [GLOBAL_COLLECTION_ROW_KEY.CATEGORY_MAPPING]: GJ_CategoryMapping;
  [GLOBAL_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_NAME_MAPPING]: GJ_SliceNameToCategorySetIdMapping;
};

export type GlobalJsonDriver = {
  isLoaded: boolean;
  load: () => Promise<void>;
  closeAll: () => Promise<void>;

  addCategorySet: (newCSName: string, newCS: GJ_CategorySet) => void | never;
  rmCategorySet: (csId: string) => void | never;
  addSliceToCategoryMapping: (sliceName: string, csId: string) => void | never;
  rmSliceToCategoryMapping: (sliceName: string) => void | never;

  getCategoryMapping: () => GJ_CategoryMapping | never;
  getCategorySetNameMapping: () => GJ_CategorySetNameMapping | never;
  getCategoryNameMapping: () => GJ_CategoryNameMapping | never;
  getSliceToCategoryMapping: () => GJ_SliceNameToCategorySetIdMapping | never;
};
