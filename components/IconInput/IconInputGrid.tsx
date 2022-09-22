import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { FlexCol, FlexRow } from '../Flex';
import IconInput, { IconInputProps } from './IconInput';

type TempProps = {
    iconProps: IconInputProps[];
    colCount: number;
};
const Temp: FC<TempProps> = (props) => {
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
            iconPropRows.map((row: IconInputProps[]) => (
                <FlexRow
                    justifyContent='space-around'
                    alignItems='center'
                >
                {
                    row.map((iconInput: IconInputProps) => <IconInput {...iconInput} />)
                }
                </FlexRow>
            ))
        }
        </FlexCol>
    );
}

export default Temp;
