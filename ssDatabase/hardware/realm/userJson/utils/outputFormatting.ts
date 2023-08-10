import {Dict} from '@asianpersonn/realm-graph';
import {DEFAULT_OUTPUT_ICON} from 'ssDatabase/api/userJson/category/constants';
import {
  OutputDecoration,
  ASJ_OutputNameToDecorationMapping,
} from 'ssDatabase/api/userJson/category/types';
import {UserJsonMap} from 'ssDatabase/api/userJson/types';
import {hashToColor} from 'ssUtils/color';
import {getONToCDMapping} from './getTables';

// OUTPUT UTILS

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
    getONToCDMapping(userJsonMap);

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
