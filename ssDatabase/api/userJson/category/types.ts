import {Dict} from '@asianpersonn/realm-graph';
import {HexColor} from '../../../../global';
import {AvailableIcons} from '../constants';

// GLOBAL JSON PROPERTIES

/*
ALL SETS OF CATEGORIES
    [rowKey] GLOBAL_COLLECTION_ROW_KEY.ALL_CATEGORY_SETS: {
        SetName1: {
            CategoryName1: {
                icon,
                color,
            },
            CategoryName2: {
                icon,
                color,
            },
            CategoryName3: {
                icon,
                color,
            },
            ...
        },
        SetName2: {
            ...
        }
    }
 */
export type AllCategorySets = Dict<CategorySet>;
export type CategorySet = Dict<Category>;
export type Category = {
  icon: AvailableIcons;
  color: HexColor;
};
/*
    SLICE-TO-CATEGORY_SCHEMA MAPPING
        [rowKey] GLOBAL_COLLECTION_ROW_KEY.SLICE_TO_CATEGORY_SET_MAPPING: {
            sliceName1: CategorySchemas.SetName1,
            sliceName2: CategorySchemas.SetName1,
            sliceName3: CategorySchemas.SetName2,
            ...
        }
     */
export type SliceToCategorySetMapping = Dict<string>;

// USER JSON MAP

export enum UJ_CATEGORY_ROW_KEY {
  INPUT_TO_CATEGORY_MAPPING = 'INPUT_TO_CATEGORY_MAPPING',
}

export type CategoryJsonMap = {
  [UJ_CATEGORY_ROW_KEY.INPUT_TO_CATEGORY_MAPPING]: UJ_CategoryMap;
};

/*
INPUT-TO-CATEGORY MAPPING
    [rowKey] UJ_CATEGORY_ROW_KEY.CATEGORY: {
    inputName1: categoryName1,
    inputName2: categoryName1,
    inputName3: categoryName2,
    ...
  }
*/
export type UJ_CategoryMap = Dict<UJ_CategoryValue>;
export type UJ_CategoryValue = string;

// CATEGORY DRIVER

export type UJ_CategoryInfo = {
  inputId: string;
  categoryId: string;
  icon?: AvailableIcons;
  color?: HexColor;
};

export type UJ_CategoryDriver = {
  isLoaded: boolean;
  load: (activeSliceName: string) => Promise<void>;
  closeAll: () => Promise<void>;

  setActiveSliceCategories: (
    activeSliceName: string,
    newCategoryMap: UJ_CategoryMap,
  ) => void | never;
  addInputCategories: (
    activeSliceName: string,
    newInputCategories: UJ_CategoryInfo[],
  ) => void | never;
  rmInputCategories: (
    activeSliceName: string,
    inputIdsToRm: string[],
  ) => void | never;
  getAllInputCategories: (activeSliceName: string) => UJ_CategoryMap | never;
};
