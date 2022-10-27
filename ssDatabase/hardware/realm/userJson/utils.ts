import {DEFAULT_ICON} from 'ssDatabase/api/userJson/decoration/constants';
import {
  DecorationJsonValue,
  DECORATION_VALUE_KEY,
  DECORATION_ROW_TYPE,
  DecorationJsonMap,
  DecorationJson,
} from 'ssDatabase/api/userJson/decoration/types';
import {genRandomColor} from 'ssUtils/color';
import {Dict} from '../../../../global';

function genRandDecorationValue(): DecorationJsonValue {
  return {
    [DECORATION_VALUE_KEY.COLOR]: genRandomColor(),
    [DECORATION_VALUE_KEY.ICON]: DEFAULT_ICON,
  };
}
export function hasDecorationMapValue(
  rowKey: DECORATION_ROW_TYPE,
  entityId: string,
  decorationJsonMap: DecorationJsonMap,
): boolean {
  const value: DecorationJsonValue | undefined =
    decorationJsonMap[rowKey][entityId];

  return value !== undefined;
}
export function getDecorationMapValue(
  rowKey: DECORATION_ROW_TYPE,
  entityId: string,
  decorationJsonMap: DecorationJsonMap,
): DecorationJsonValue {
  return getDecorationJsonValue(entityId, decorationJsonMap[rowKey]);
}
export function getDecorationJsonValue(
  entityId: string,
  decorationJson: DecorationJson,
): DecorationJsonValue {
  const value: DecorationJsonValue | undefined = decorationJson[entityId];

  return value !== undefined ? value : genRandDecorationValue();
}

// colorMap={{
//     0: 'green',
//     1: '#FFA99F',
//     2: 'yellow',
//   }}
export function getDecorationMapSubset<T>(
  decorationRowId: DECORATION_ROW_TYPE,
  entityIds: string[],
  decorationValueKey: DECORATION_VALUE_KEY,
  decorationJsonMap: DecorationJsonMap,
  mutateKey: (i: number) => number | string,
  mutateValue: (stringMapValue: string) => T,
): Dict<T> {
  return entityIds.reduce<Dict<T>>((acc, entityId: string, i) => {
    acc[mutateKey(i)] = mutateValue(
      getDecorationMapValue(decorationRowId, entityId, decorationJsonMap)[
        decorationValueKey
      ],
    );

    return acc;
  }, {});
}

// gradientColors={[
//     { offset: "0%", color:"green" },
//     { offset: "40%", color:"#FFA99F" },
//     { offset: "100%", color:"yellow" },
//   ]}
export function getDecorationMapSubsetList<T>(
  decorationRowId: DECORATION_ROW_TYPE,
  entityIds: string[],
  decorationValueKey: DECORATION_VALUE_KEY,
  decorationJsonMap: DecorationJsonMap,
  getListValue: (i: number, stringMapValue: string) => T,
): T[] {
  return entityIds.reduce<T[]>((acc, entityId: string, i) => {
    acc.push(
      getListValue(
        i,
        getDecorationMapValue(decorationRowId, entityId, decorationJsonMap)[
          decorationValueKey
        ],
      ),
    );

    return acc;
  }, []);
}
