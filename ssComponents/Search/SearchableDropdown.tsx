import React, {FC, useState, forwardRef, useEffect} from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
} from 'react-native';
import {useIsKeyboardVisible} from 'ssHooks/useIsKeyboardVisible';
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
    onFocus,
    onBlur,
    LeftComponent,
    InputComponent = DefaultInput,
    DropdownComponent,
    RightComponent,
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const {isKeyboardVisible} = useIsKeyboardVisible();

  const shouldDisplayDropdown = isFocused && !!DropdownComponent;

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    console.log('FOCUSED!!------');
    setIsFocused(true);

    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);

    if (onBlur) {
      onBlur(e);
    }
  };

  // KEYBOARD EFFECT
  useEffect(() => {
    if (ref !== null && isFocused && !isKeyboardVisible) {
      (ref as React.RefObject<TextInput>).current!.blur();
    }
  }, [isKeyboardVisible]);

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
