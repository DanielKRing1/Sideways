import {Dict} from '@asianpersonn/realm-graph';
import {HexColor} from '../../../../global';
import {AvailableIcons} from '../constants';

// GLOBAL JSON PROPERTIES

/*
ALL SETS OF CATEGORIES
    [rowKey] GJ_COLLECTION_ROW_KEY.ALL_CATEGORY_SETS: {
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
export type GJ_CategoryDecorationMapping = Dict<GJ_CategorySet>;
export type GJ_CategorySet = Dict<GJ_Category>;
export type GJ_Category = {
  icon: AvailableIcons;
  color: HexColor;
};

/*
    SLICE-TO-CATEGORY_SCHEMA MAPPING
        [rowKey] GJ_COLLECTION_ROW_KEY.SLICE_TO_CATEGORY_SET_MAPPING: {
            sliceName1: CategorySchemas.SetName1,
            sliceName2: CategorySchemas.SetName1,
            sliceName3: CategorySchemas.SetName2,
            ...
        }
     */
// SliceName - CategorySetId
export type GJ_SliceNameToCategorySetIdMapping = AssociationMapping;

// USER JSON MAP

export enum ASJ_CATEGORY_ROW_KEY {
  INPUT_NAME_TO_CATEGORY_ID_MAPPING = 'INPUT_NAME_TO_CATEGORY_ID_MAPPING',
  OUTPUT_NAME_TO_DECORATION_MAPPING = 'OUTPUT_NAME_TO_DECORATION_MAPPING',
}

export type CategoryJsonMap = {
  [ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING]: ASJ_InputNameToCategoryIdMapping;
  [ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING]: ASJ_OutputNameToDecorationMapping;
};

/*
INPUT-TO-CATEGORY MAPPING
    [rowKey] ASJ_CATEGORY_ROW_KEY.CATEGORY: {
    inputName1: categoryName1,
    inputName2: categoryName1,
    inputName3: categoryName2,
    ...
  }
*/
// InputName - CategoryId
export type ASJ_InputNameToCategoryIdMapping = Dict<string>;
// OutputName - Decoration
export type ASJ_OutputNameToDecorationMapping = Dict<OutputDecoration>;
export type OutputDecoration = {
  icon: AvailableIcons;
  color: HexColor;
};

// CATEGORY DRIVER

export type ASJ_CategoryInfo = {
  inputId: string;
  categoryId: string;
  icon?: AvailableIcons;
  color?: HexColor;
};

export type ASJ_OutputDecorationInfo = {
  outputId: string;
  icon: AvailableIcons;
  color: HexColor;
};

export type ASJ_CategoryDriver = {
  isLoaded: boolean;
  load: (activeSliceName: string) => Promise<void>;
  closeAll: () => Promise<void>;

  addInputCategories: (
    activeSliceName: string,
    categoryInfo: ASJ_CategoryInfo,
  ) => void | never;
  rmInputCategories: (
    activeSliceName: string,
    inputIdsToRm: string[],
  ) => void | never;
  // InputName - CategoryId
  getAllInputCategories: (
    activeSliceName: string,
  ) => ASJ_InputNameToCategoryIdMapping | never;

  addOutputDecorations: (
    activeSliceName: string,
    outputDecorationInfo: ASJ_OutputDecorationInfo,
  ) => void | never;
  rmOutputDecorations: (
    activeSliceName: string,
    outputIdsToRm: string[],
  ) => void | never;
  // InputName - CategoryId
  getAllOutputDecorations: (
    activeSliceName: string,
  ) => ASJ_OutputNameToDecorationMapping | never;
};
