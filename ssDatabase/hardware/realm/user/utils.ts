import { StringMap } from "ssDatabase/api/types";
import { Dict } from "../../../../global";

const DELIM: string = '_';
const INPUT_SUFFIX: string = 'i';
const OUTPUT_SUFFIX: string = 'O';

const INPUT = 'INPUT';
const OUTPUT = 'OUTPUT';
type IdType = typeof INPUT | typeof OUTPUT;
export const ID_TYPES = {
    [INPUT]: INPUT,
    [OUTPUT]: OUTPUT,
} as const;
const getId = (raw: string, idType: IdType): string => {
    switch(idType) {
        case ID_TYPES.INPUT:
            return getInputId(raw);
        case ID_TYPES.OUTPUT:
        default:
            return getOutputId(raw);
    }
}
const getInputId = (rawInput: string): string => `${rawInput}${DELIM}${INPUT_SUFFIX}`;
const getOutputId = (rawOutput: string): string => `${rawOutput}${DELIM}${OUTPUT_SUFFIX}`;

// colorMap={{
//     0: 'green',
//     1: '#FFA99F',
//     2: 'yellow',
//   }}
export function getStringMapSubset<T>(rawTexts: string[], stringMap: StringMap, idType: IdType, getKey: (i: number) => number | string, getValue: (stringMapValue: string) => T): Dict<T> {
    return rawTexts.reduce<Dict<T>>((acc, rawText: string, i) => {
        acc[getKey(i)] = getValue(stringMap[getId(rawText, idType)]);

        return acc;
    }, {});
}

// gradientColors={[
//     { offset: "0%", color:"green" },
//     { offset: "40%", color:"#FFA99F" },
//     { offset: "100%", color:"yellow" },
//   ]}
export function getStringMapSubsetList<T>(rawTexts: string[], stringMap: StringMap, idType: IdType, getListValue: (i: number, stringMapValue: string) => T): T[] {
    return rawTexts.reduce<T[]>((acc, rawText: string, i) => {
        acc.push({ ...getListValue(i, stringMap[getId(rawText, idType)]) });

        return acc;
    }, []);
}
