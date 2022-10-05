import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { FlexCol, FlexRow } from '../Flex';
import IconInput, { IconInputProps } from './IconInput';

type IconInputRowProps = {
    iconProps: IconInputProps[];
};
const IconInputRow: FC<IconInputRowProps> = (props) => {
    const { iconProps } = props;

    return (
        <FlexRow
            justifyContent='space-around'
            alignItems='center'
        >
        {
            iconProps.map((iconInput: IconInputProps) => <IconInput {...iconInput} />)
        }
        </FlexRow>
    );
}

export default IconInputRow;
