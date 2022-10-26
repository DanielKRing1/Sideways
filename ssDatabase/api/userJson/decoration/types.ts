import {Dict} from '@asianpersonn/realm-graph';
import {AvailableIcons} from './constants';

/*
[Row keys] Dict {
    [Decoration Rows, Entity ids] Dict {
        [Data/any]
        color: string;
        icon: string;
    }
}
*/

// Can & other json maps to this type
export type UserJsonMap = DecorationJsonMap & {};

// DECORATION DRIVER

// Enums
// (Row Key)
export enum DECORATION_ROW_KEY {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}
// (Value Key)
export enum DECORATION_VALUE_KEY {
  COLOR = 'COLOR',
  ICON = 'ICON',
}

export type DecorationJsonMap = {
  [DECORATION_ROW_KEY.INPUT]: DecorationJson;
  [DECORATION_ROW_KEY.OUTPUT]: DecorationJson;
};
export type DecorationJson = Dict<DecorationJsonValue>;
export type DecorationJsonValue = {
  [DECORATION_VALUE_KEY.COLOR]: string;
  [DECORATION_VALUE_KEY.ICON]: AvailableIcons;
};
export type DecorationInfo = {
  decorationRowId: DECORATION_ROW_KEY;
  entityId: string;
  [DECORATION_VALUE_KEY.COLOR]?: string;
  [DECORATION_VALUE_KEY.ICON]?: AvailableIcons;
};
export type DecorationDriver = {
  isLoaded: boolean;
  load: () => Promise<void>;
  closeAll: () => Promise<void>;

  setDecorationRow: (
    rowKey: DECORATION_ROW_KEY,
    newJson: DecorationJson,
  ) => void | never;
  saveDecorations: (newDecorations: DecorationInfo[]) => void | never;
  rmDecorations: (decorationsToRm: DecorationInfo[]) => void | never;
  getAllDecorations: () => DecorationJsonMap | never;
};

export type StringMap = Dict<string>;
