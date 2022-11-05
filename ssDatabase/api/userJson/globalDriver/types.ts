import {
  GJ_CategorySetNameMapping,
  GJ_CategoryNameMapping,
  GJ_CategoryDecorationMapping,
  GJ_SliceNameToCategorySetIdMapping,
  GJ_CategorySet,
} from '../category/types';

/**
 * Keep a separate 'Global' collection of
 * - Available CategorySets
 */
export const GLOBAL_COLLECTION_KEY = 'GLOBAL_DATA';
export enum GJ_COLLECTION_ROW_KEY {
  // CATEGORY SPECIFIC
  CATEGORY_SET_NAME_MAPPING = 'CATEGORY_SET_NAME_MAPPING',
  CATEGORY_NAME_MAPPING = 'CATEGORY_NAME_MAPPING',
  CATEGORY_DECORATION_MAPPING = 'CATEGORY_DECORATION_MAPPING',
  SLICE_NAME_TO_CATEGORY_SET_NAME_MAPPING = 'SLICE_NAME_TO_CATEGORY_SET_NAME_MAPPING',
}

export type GlobalCategoryJsonMap = {
  [GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING]: GJ_CategorySetNameMapping;
  [GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING]: GJ_CategoryNameMapping;
  [GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING]: GJ_CategoryDecorationMapping;
  [GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_NAME_MAPPING]: GJ_SliceNameToCategorySetIdMapping;
};

export type GlobalJsonDriver = {
  isLoaded: boolean;
  load: () => Promise<void>;
  closeAll: () => Promise<void>;

  addCategorySet: (newCSName: string, newCS: GJ_CategorySet) => void | never;
  rmCategorySet: (csId: string) => void | never;
  addSliceToCategoryMapping: (sliceName: string, csId: string) => void | never;
  rmSliceToCategoryMapping: (sliceName: string) => void | never;

  getCategoryDecorationMapping: () => GJ_CategoryDecorationMapping | never;
  getCategorySetNameMapping: () => GJ_CategorySetNameMapping | never;
  getCategoryNameMapping: () => GJ_CategoryNameMapping | never;
  getSliceToCategoryMapping: () => GJ_SliceNameToCategorySetIdMapping | never;
};
