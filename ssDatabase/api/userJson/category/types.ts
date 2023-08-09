import {Dict} from '@asianpersonn/realm-graph';
import {HexColor} from '../../../../global';
import {AvailableIcons} from '../constants';

// GLOBAL JSON PROPERTIES

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
 * OutputName - { icon: string; color: string; }
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
export type GJ_UserCategorySet = Dict<GJ_UserCategoryDecoration>;
export type GJ_CategorySet = Dict<GJ_CategoryDecoration>;
export type GJ_UserCategoryDecoration = Omit<GJ_CategoryDecoration, 'cId'> & {
  name: string;
};
export type GJ_CategoryDecoration = {
  cId: string;
  icon: AvailableIcons;
  color: HexColor;
};
export type GJ_CategoryWName = {
  categoryName: string;
} & GJ_CategoryDecoration;
export type GJ_CDInfo = {
  cId: string;
  icon?: AvailableIcons;
  color?: HexColor;
};

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
// InputName - { CategoryId, counter }
export type ASJ_InputValue = string;
export type ASJ_InputNameToCategoryIdMapping = Dict<ASJ_InputValue>;
// OutputName - Decoration
export type ASJ_OutputNameToDecorationMapping = Dict<OutputDecoration>;
export type OutputDecoration = {
  icon: AvailableIcons;
  color: HexColor;
};

// CATEGORY DRIVER

export type ASJ_InputInfo = {
  inputId: string;
  categoryId: string;
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

  addInputCategory: (categoryInfo: ASJ_InputInfo) => void | never;
  rmInputCategories: (inputIdsToRm: string[]) => void | never;
  editInputCategory: (categoryInfo: ASJ_InputInfo) => void | never;
  // InputName - CategoryId
  getAllInputCategories: () => ASJ_InputNameToCategoryIdMapping | never;
  setAllInputCategories: (
    inToCIdMapping: ASJ_InputNameToCategoryIdMapping,
  ) => void | never;

  addOutputDecorations: (
    outputDecorationInfo: ASJ_OutputDecorationInfo,
  ) => void | never;
  rmOutputDecorations: (outputIdsToRm: string[]) => void | never;
  // InputName - CategoryId
  getAllOutputDecorations: () => ASJ_OutputNameToDecorationMapping | never;
  editOutputDecoration: (
    outputDecorationInfo: ASJ_OutputDecorationInfo,
  ) => void | never;
};
