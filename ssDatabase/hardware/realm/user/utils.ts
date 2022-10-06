import { ColorMap, IconMap } from "ssDatabase/api/types";
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

export const getColorsMap = (rawTexts: string[], colors: ColorMap, idType: IdType) => rawTexts.reduce<Dict<string>>((acc, rawText: string, i): Dict<string> => {
    acc[i] = colors[getId(rawText, idType)];

    return acc;
}, {});
export const getIconsMap = (rawTexts: string[], icons: IconMap, idType: IdType) => rawTexts.reduce<Dict<string>>((acc, rawText: string, i): Dict<string> => {
    acc[i] = icons[getId(rawText, idType)];

    return acc;
}, {});
