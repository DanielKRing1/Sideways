import {
  DEFAULT_CATEGORY_ICON,
  DEFAULT_OUTPUT_ICON,
} from 'ssDatabase/api/userJson/category/constants';
import {
  ASJ_InputNameToCategoryIdMapping,
  ASJ_CATEGORY_ROW_KEY,
  GJ_SliceNameToCategorySetIdMapping,
  GJ_Category,
  GJ_CategorySet,
  GJ_CategoryDecorationMapping,
  OutputDecoration,
  ASJ_OutputNameToDecorationMapping,
} from 'ssDatabase/api/userJson/category/types';
import {GJ_COLLECTION_ROW_KEY} from 'ssDatabase/api/userJson/globalDriver/types';
import {UserJsonMap} from 'ssDatabase/api/userJson/types';
import {hashToColor} from 'ssUtils/color';
import {Dict} from '../../../../global';

function getASJValue(key: keyof UserJsonMap, userJsonMap: UserJsonMap) {
  return userJsonMap[key];
}

function getInputValue(
  activeSliceName: string,
  inputName: string,
  userJsonMap: UserJsonMap,
): GJ_Category {
  // 1. Get submaps of Json
  const sliceNameToCategorySetIdMapping: GJ_SliceNameToCategorySetIdMapping =
    userJsonMap[GJ_COLLECTION_ROW_KEY.SLICE_NAME_TO_CATEGORY_SET_NAME_MAPPING];
  const inputNameToCategoryIdMapping: ASJ_InputNameToCategoryIdMapping =
    userJsonMap[ASJ_CATEGORY_ROW_KEY.INPUT_NAME_TO_CATEGORY_ID_MAPPING];

  // 2. Convert SliceName - CSId and InputName - CId
  const csId: string = sliceNameToCategorySetIdMapping[activeSliceName];
  const cId: string = inputNameToCategoryIdMapping[inputName];

  try {
    // 3. Get Category
    const cdMapping: GJ_CategoryDecorationMapping =
      userJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_DECORATION_MAPPING];
    const categorySet: GJ_CategorySet = cdMapping[csId];
    const category: GJ_Category = categorySet[cId];

    // 4. CategoryId did not exist
    if (category !== undefined) return category;
  } catch (err) {
    // 5. CategorySetId did not exist
  }

  // 6. Return default
  return genDefaultCategoryDecoration(cId);
}

function genDefaultCategoryDecoration(cId: string) {
  return {
    icon: DEFAULT_CATEGORY_ICON,
    color: hashToColor(cId),
  };
}

// colorMap={{
//     0: 'green',
//     1: '#FFA99F',
//     2: 'yellow',
//   }}
export function getOutputDecorationSubset<T>(
  outputNames: string[],
  userJsonMap: UserJsonMap,
  mutateKey: (i: number) => number | string,
  mutateValue: (outputDecorationValue: OutputDecoration) => T,
): Dict<T> {
  return outputNames.reduce<Dict<T>>((acc, outputName: string, i) => {
    acc[mutateKey(i)] = mutateValue(
      getOutputDecorationValue(outputName, userJsonMap),
    );

    return acc;
  }, {});
}

// gradientColors={[
//     { offset: "0%", color:"green" },
//     { offset: "40%", color:"#FFA99F" },
//     { offset: "100%", color:"yellow" },
//   ]}
export function getOutputDecorationList<T>(
  outputNames: string[],
  userJsonMap: UserJsonMap,
  mutateValue: (i: number, outputDecorationValue: OutputDecoration) => T,
): T[] {
  return outputNames.reduce<T[]>((acc, outputName: string, i) => {
    acc.push(mutateValue(i, getOutputDecorationValue(outputName, userJsonMap)));

    return acc;
  }, []);
}

/**
 * Dig outputName's OutputDecoration obj out of 'userJsonMap',
 * Returning a default obj if none
 *
 * @param outputName
 * @param userJsonMap
 * @returns
 */
export function getOutputDecorationValue(
  outputName: string,
  userJsonMap: UserJsonMap,
): OutputDecoration {
  // 1. Get all output decorations
  const outputDecorations: ASJ_OutputNameToDecorationMapping =
    userJsonMap[ASJ_CATEGORY_ROW_KEY.OUTPUT_NAME_TO_DECORATION_MAPPING];

  // 2. Get outputDecoration
  const outputDecoration: OutputDecoration | undefined =
    outputDecorations[outputName];

  return outputDecoration || genDefaultOutputDecoration(outputName);
}

function genDefaultOutputDecoration(outputName: string) {
  return {
    icon: DEFAULT_OUTPUT_ICON,
    color: hashToColor(outputName),
  };
}
