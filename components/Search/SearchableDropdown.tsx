import React, { FC, useEffect } from 'react';
import { Keyboard, Text } from 'react-native';
import styled from 'styled-components/native';
import { useOnClickOutsideComponent } from 'rn-click-listener';

import { FlexCol, FlexRow } from '../Flex';
import MyTextInput from '../Input/MyTextInput';
import MyText from '../Text/MyText';

type SearchableDropdownProps = {
    placeholder: string;
    inputValue: string;
    setInputValue: (newValue: string) => void;
    LeftComponent: FC | undefined;
    DropdownComponent: FC | undefined;
    RightComponent: FC | undefined;
};
export const SearchableDropdown: FC<SearchableDropdownProps> = (props) => {
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
        // @ts-ignore
        <StyledRow ref={ref}>
            <MyText>Start</MyText>
            {!!LeftComponent && <LeftComponent />}

            <FlexCol>
                <StyledTextInput
                    bottomRounded={!shouldDisplayDropdown}
                    placeholder={placeholder}
                    value={inputValue}
                    onChangeText={setInputValue}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    // @ts-ignore
                    keyboardShouldPersistTaps='always'
                />

                {shouldDisplayDropdown && <DropdownComponent />}
            </FlexCol>

            {!!RightComponent && <RightComponent />}
            <MyText>End</MyText>
        </StyledRow>
    );
};

const StyledRow = styled(FlexRow)`
    borderColor: black;
    borderWidth: 2;
`;

type StyledTextInputProps = {
    bottomRounded: boolean;
};
const StyledTextInput = styled(MyTextInput)<StyledTextInputProps>`
    padding: 0px 10px;

    borderWidth: 1px;
    borderRadius: 10px;
    ${({ bottomRounded }: StyledTextInputProps) => (bottomRounded ? `` : `borderBottomLeftRadius: 0px;`)}
    ${({ bottomRounded }: StyledTextInputProps) => (bottomRounded ? `` : `borderBottomRightRadius: 0px;`)}
    borderColor: #d0d0d0;
`;