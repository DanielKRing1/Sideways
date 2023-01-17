import React, {FC, useState, forwardRef, useMemo, useCallback} from 'react';
import {Keyboard, TextInput} from 'react-native';
import styled from 'styled-components/native';

import {FlexCol, FlexRow} from '../Flex';
import MyTextInput from '../ReactNative/MyTextInput';

export type SearchableDropdownProps = {
  placeholder: string;
  inputValue: string;
  setInputValue: (newValue: string) => void;
  LeftComponent?: FC | undefined;
  DropdownComponent?: FC | undefined;
  RightComponent?: FC | undefined;
};
export const SearchableDropdown = forwardRef<
  TextInput,
  SearchableDropdownProps
>((props, ref) => {
  const {
    placeholder,
    inputValue,
    setInputValue,
    LeftComponent,
    DropdownComponent,
    RightComponent,
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const shouldDisplayDropdown = isFocused && !!DropdownComponent;

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    Keyboard.dismiss();
  };

  // console.log('SEARCHABLEDROPDOWN RERENDERED');

  return (
    <StyledRow>
      {!!LeftComponent && <LeftComponent />}

      <FlexCol style={{width: '100%'}}>
        <MyTextInput
          ref={ref}
          placeholder={placeholder}
          value={inputValue}
          onChangeText={setInputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {shouldDisplayDropdown && <DropdownComponent />}
      </FlexCol>

      {!!RightComponent && <RightComponent />}
    </StyledRow>
  );
});

const StyledRow = styled(FlexRow)`
  bordercolor: black;
  border-width: 2px;
`;
