import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { FlexCol, FlexRow } from '../Flex';
import IconInput, { IconInputProps } from './IconInput';
import IconInputRow from './IconInputRow';

type IconInputGridProps = {
    iconProps: IconInputProps[];
    colCount: number;
};
const IconInputGrid: FC<IconInputGridProps> = (props) => {
    const { iconProps, colCount } = props;

    const iconPropRows: IconInputProps[][] = useMemo(() => {
        let rows: IconInputProps[][] = [];

        let curColCount: number;
        let counter: number = 0;
        while(counter < iconProps.length) {
            // 1. Alternate column count
            curColCount = rows.length%2===0 ? colCount : colCount-1;

            // 2. Push row
            rows.push(iconProps.slice(counter, counter+curColCount));

            // 3. Increment counter
            counter += curColCount;
        }

        return rows;
    }, [iconProps, colCount]);

    return (
        <FlexCol
            justifyContent='center'
            alignItems='center'
        >
        {
            iconPropRows.map((row: IconInputProps[]) => <IconInputRow iconProps={row} />)
        }
        </FlexCol>
    );
}

export default IconInputGrid;
