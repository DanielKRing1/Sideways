import React, {FC, useState, forwardRef} from 'react';
import {Keyboard, TextInput, TextInputProps} from 'react-native';
import styled from 'styled-components/native';

import {FlexCol, FlexRow} from '../Flex';
import MyTextInput from '../ReactNative/MyTextInput';

export interface SearchableDropdownProps extends TextInputProps {
  LeftComponent?: FC | undefined;
  InputComponent?: FC<InputProps>;
  DropdownComponent?: FC | undefined;
  RightComponent?: FC | undefined;
}
export const SearchableDropdown = forwardRef<
  TextInput,
  SearchableDropdownProps
>((props, ref) => {
  const {
    placeholder,
    value,
    onChangeText,
    LeftComponent,
    InputComponent = DefaultInput,
    DropdownComponent,
    RightComponent,
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const shouldDisplayDropdown = isFocused && !!DropdownComponent;

  const handleFocus = () => {
    console.log('FOCUSED!!------');
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
        <InputComponent
          ref={ref}
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {shouldDisplayDropdown && <DropdownComponent />}
      </FlexCol>

      {!!RightComponent && <RightComponent />}
    </StyledRow>
  );
});

export type InputProps = {
  ref: React.Ref<TextInput>;
} & TextInputProps;
const DefaultInput = MyTextInput;

const StyledRow = styled(FlexRow)`
  bordercolor: black;
  border-width: 2px;
`;
