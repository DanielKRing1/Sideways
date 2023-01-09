import {
  GJ_CategorySetNameMapping,
  GJ_CategoryNameMapping,
  GJ_CategoryDecorationMapping,
  GJ_SliceNameToCategorySetIdMapping,
  GJ_CategorySet,
  GJ_CDInfo,
  GJ_UserCategorySet,
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
  SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING = 'SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING',
}

export type GlobalCategoryJsonMap = {
  [GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING]: GJ_CategorySetNameMapping;
  [GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING]: GJ_CategoryNameMapping;
  [GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING]: GJ_CategoryDecorationMapping;
  [GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_ID_MAPPING]: GJ_SliceNameToCategorySetIdMapping;
};

export type GlobalJsonDriver = {
  isLoaded: boolean;
  load: () => Promise<void>;
  closeAll: () => Promise<void>;

  hasCS: (csName: string) => boolean | never;
  addPredefinedCS: (
    newCSName: string,
    userCS: GJ_UserCategorySet,
  ) => void | never;
  addCS: (
    csName: string,
    csId: string,
    cs: GJ_CategorySet,
    cscNameMapping: GJ_CategoryNameMapping,
  ) => void | never;
  rmCS: (csId: string) => void | never;
  editCD: (csId: string, cdInfo: GJ_CDInfo) => void | never;
  addSliceToCSMapping: (sliceName: string, csId: string) => void | never;
  rmSliceToCSMapping: (sliceName: string) => void | never;

  getCDMapping: () => GJ_CategoryDecorationMapping | never;
  getCSNameMapping: () => GJ_CategorySetNameMapping | never;
  getCategoryNameMapping: () => GJ_CategoryNameMapping | never;
  getSliceToCategoryMapping: () => GJ_SliceNameToCategorySetIdMapping | never;
};
