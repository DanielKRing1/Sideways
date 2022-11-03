import {
  AllCategorySets,
  CategorySet,
  SliceToCategorySetMapping,
  UJ_CategoryInfo,
  UJ_CategoryMap,
} from '../category/types';

/**
 * Keep a separate 'Global' collection of
 * - Available CategorySets
 */
export const GLOBAL_COLLECTION_KEY = 'GLOBAL_DATA';
export enum GLOBAL_COLLECTION_ROW_KEY {
  // CATEGORY SPECIFIC
  ALL_CATEGORY_SETS = 'ALL_CATEGORY_SETS',
  SLICE_TO_CATEGORY_SET_MAPPING = 'SLICE_TO_CATEGORY_SET_MAPPING',
}

export type GlobalCategoryJsonMap = {
  [GLOBAL_COLLECTION_ROW_KEY.ALL_CATEGORY_SETS]: AllCategorySets;
  [GLOBAL_COLLECTION_ROW_KEY.SLICE_TO_CATEGORY_SET_MAPPING]: SliceToCategorySetMapping;
};

export type GlobalJsonDriver = {
  isLoaded: boolean;
  load: () => Promise<void>;
  closeAll: () => Promise<void>;

  addCategorySet: (
    categorySetName: string,
    categorySet: CategorySet,
  ) => void | never;
  rmCategorySet: (categorySetName: string) => void | never;
  getAllCategorySets: () => AllCategorySets | never;

  setSliceToCategoryMapping: (
    newMapping: SliceToCategorySetMapping,
  ) => void | never;
  addSliceToCategoryMapping: (
    sliceName: string,
    categorySetName: string,
  ) => void | never;
  rmSliceToCategoryMapping: (sliceName: string) => void | never;
  getSliceToCategoryMapping: () => SliceToCategorySetMapping | never;
};
