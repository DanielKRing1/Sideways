import React, { FC, useMemo } from 'react';

import { FlexRow } from '../../Flex';
import { Dimensions } from '../types';

type PartialHeatMapCell = {
    color: string;
    onPress: (index: number) => void;
};
export type CompleteHeatMapCell = {
    index: number;
} & PartialHeatMapCell;

export type HeatMapCellProps = {
    data: CompleteHeatMapCell;
    gridDim: Dimensions;
};

export type HeatMapProps = {
    CellComponent: FC<HeatMapCellProps>;
    data: PartialHeatMapCell[];
    cols: number;
};
const HeatMap: FC<HeatMapProps> = (props) => {
    const { CellComponent, data, cols } = props;

    const dataRows: CompleteHeatMapCell[][] = useMemo(() => data.reduce<CompleteHeatMapCell[][]>((acc, cur, i) => {
        if (i % cols === 0) acc.push([]);
        acc[acc.length - 1].push({
            index: i,
            ...cur,
        });

        return acc;
    }, [])
        , [data, cols]);

    return (
        <>
            {
                dataRows.map((row: CompleteHeatMapCell[], i) => (
                    <FlexRow>
                        {
                            row.map((cell: CompleteHeatMapCell, i) => <CellComponent data={cell} gridDim={{ x: cols, y: data.length }} />)
                        }
                    </FlexRow>
                ))
            }
        </>
    );
}

export default HeatMap;
