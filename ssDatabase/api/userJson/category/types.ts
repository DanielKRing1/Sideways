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

/**
 * ID MAPPINGS (GLOBAL)
 * CategorySetId - CategorySetName
 * CategorySetId: {
 *  CategoryId: CategoryName
 * }
 * CategorySetId: {
 *  CategoryId: {
 *    icon: string;
 *    color: string;
 *  }
 * }
 *
 * USER MAPPINGS (GLOBAL)
 * SliceName - CategorySetId
 *
 * USER MAPPINGS (CATEGORY)
 * InputName - CategoryId
 *
 */

type IdMapping = Dict<string>;
type AssociationMapping = Dict<string>;

// CATEGORY SETS
// CategorySetId - CategorySetName
export type GJ_CategorySetNameMapping = IdMapping;
// CategoryName - CategoryId
export type GJ_CategoryNameMapping = IdMapping;
// CategorySetId: {
//    CategoryId: {
//      icon: string;
//      color: string;
//    }
// }
export type GJ_CategoryMapping = Dict<GJ_CategorySet>;
export type GJ_CategorySet = Dict<GJ_Category>;
export type GJ_Category = {
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
// SliceName - CategorySetId
export type GJ_SliceNameToCategorySetIdMapping = AssociationMapping;

// USER JSON MAP

export enum UJ_CATEGORY_ROW_KEY {
  INPUT_NAME_TO_CATEGORY_NAME_MAPPING = 'INPUT_NAME_TO_CATEGORY_NAME_MAPPING',
}

export type CategoryJsonMap = {
  [UJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_NAME_MAPPING]: UJ_InputNameToCategoryIdMapping;
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
// InputName - CategoryId
export type UJ_InputNameToCategoryIdMapping = Dict<string>;

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

  addInputCategories: (
    activeSliceName: string,
    categoryInfo: UJ_CategoryInfo,
  ) => void | never;
  rmInputCategories: (
    activeSliceName: string,
    inputIdsToRm: string[],
  ) => void | never;
  // InputName - CategoryId
  getAllInputCategories: (
    activeSliceName: string,
  ) => UJ_InputNameToCategoryIdMapping | never;
};
