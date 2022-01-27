import React, { FC, useEffect } from 'react';
import { Keyboard, Text } from 'react-native';
import styled from 'styled-components/native';
import { useOnClickOutsideComponent } from '../../hooks';

import { Column, Row } from '../Flex';

type SearchBarProps = {
    placeholder: string;
    inputValue: string;
    setInputValue: (newValue: string) => void;
    LeftComponent: FC | undefined;
    DropdownComponent: FC | undefined;
    RightComponent: FC | undefined;
};
export const SearchBar: FC<SearchBarProps> = (props) => {
    const { placeholder, inputValue, setInputValue, LeftComponent, DropdownComponent, RightComponent } = props;

    const { ref, clickedInside, registerClickInside, reset } = useOnClickOutsideComponent('search-bar-test-id');

    const shouldDisplayDropdown = !!clickedInside && !!DropdownComponent;

    const handleFocus = () => {
        registerClickInside();
    };

    const handleBlur = () => {
        reset();
        Keyboard.dismiss();
    };

    useEffect(() => {
        if (!clickedInside) handleBlur();
    }, [clickedInside]);

    return (
        <StyledRow ref={ref}>
            <Text>Start</Text>
            {!!LeftComponent && <LeftComponent />}

            <Column>
                <StyledTextInput
                    bottomRounded={!shouldDisplayDropdown}
                    placeholder={placeholder}
                    value={inputValue}
                    onChangeText={setInputValue}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    keyboardShouldPersistTaps='always'
                />

                {shouldDisplayDropdown && <DropdownComponent />}
            </Column>

            {!!RightComponent && <RightComponent />}
            <Text>End</Text>
        </StyledRow>
    );
};

const StyledRow = styled(Row)`
    border-color: black;
    border-width: 2;
`;

type StyledTextInputProps = {
    bottomRounded: boolean;
};
const StyledTextInput = styled.TextInput<StyledTextInputProps>`
    padding: 0px 10px;
    border-width: 1px;
    border-radius: 10px;
    ${({ bottomRounded }: StyledTextInputProps) => (bottomRounded ? `` : `border-bottom-left-radius: 0px;`)}
    ${({ bottomRounded }: StyledTextInputProps) => (bottomRounded ? `` : `border-bottom-right-radius: 0px;`)}
    border-color: #d0d0d0;
`;
