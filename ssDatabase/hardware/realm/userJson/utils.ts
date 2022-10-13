import { DecorationJsonMap, DecorationJsonValue, DECORATION_ROW_KEY, DECORATION_VALUE_KEY } from "ssDatabase/api/types";
import { DEFAULT_ICON_NAME } from "ssDatabase/api/userJson/decoration/constants";
import { genRandomColor } from "ssUtils/color";
import { Dict } from "../../../../global";

function genRandDecorationMapValue(): DecorationJsonValue {
    return {
        [DECORATION_VALUE_KEY.COLOR]: genRandomColor(),
        [DECORATION_VALUE_KEY.ICON]: DEFAULT_ICON_NAME,
    }
};
export function hasDecorationMapValue(rowKey: DECORATION_ROW_KEY, entityId: string, decorationJsonMap: DecorationJsonMap): boolean {
    const value: DecorationJsonValue | undefined = decorationJsonMap[rowKey][entityId];

    return value !== undefined;
};
export function getDecorationMapValue(rowKey: DECORATION_ROW_KEY, entityId: string, decorationJsonMap: DecorationJsonMap): DecorationJsonValue {
    const value: DecorationJsonValue | undefined = decorationJsonMap[rowKey][entityId];

    return value !== undefined ? value : genRandDecorationMapValue();
};

// colorMap={{
//     0: 'green',
//     1: '#FFA99F',
//     2: 'yellow',
//   }}
export function getDecorationMapSubset<T>(
    decorationRowId: DECORATION_ROW_KEY,
    entityIds: string[],
    decorationValueKey: DECORATION_VALUE_KEY,
    decorationJsonMap: DecorationJsonMap,
    mutateKey: (i: number) => number | string,
    mutateValue: (stringMapValue: string) => T
): Dict<T> {
    return entityIds.reduce<Dict<T>>((acc, entityId: string, i) => {
        acc[mutateKey(i)] = mutateValue(getDecorationMapValue(decorationRowId, entityId, decorationJsonMap)[decorationValueKey]);

        return acc;
    }, {});
}

// gradientColors={[
//     { offset: "0%", color:"green" },
//     { offset: "40%", color:"#FFA99F" },
//     { offset: "100%", color:"yellow" },
//   ]}
export function getDecorationMapSubsetList<T>(
    decorationRowId: DECORATION_ROW_KEY,
    entityIds: string[], 
    decorationValueKey: DECORATION_VALUE_KEY,
    decorationJsonMap: DecorationJsonMap, 
    getListValue: (i: number, stringMapValue: string) => T
): T[] {
    return entityIds.reduce<T[]>((acc, entityId: string, i) => {
        acc.push(getListValue(i, getDecorationMapValue(decorationRowId, entityId, decorationJsonMap)[decorationValueKey]));

        return acc;
    }, []);
}
