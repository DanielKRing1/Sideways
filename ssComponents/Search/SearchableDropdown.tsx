import React, {FC, useEffect} from 'react';
import {Keyboard} from 'react-native';
import styled from 'styled-components/native';
import {useOnClickOutsideComponent} from 'rn-click-listener';

import {FlexCol, FlexRow} from '../Flex';
import MyTextInput from '../ReactNative/MyTextInput';
import MyText from '../ReactNative/MyText';

export type SearchableDropdownProps = {
  clickOutsideId: string;
  placeholder: string;
  inputValue: string;
  setInputValue: (newValue: string) => void;
  LeftComponent?: FC | undefined;
  DropdownComponent?: FC | undefined;
  RightComponent?: FC | undefined;
};
export const SearchableDropdown: FC<SearchableDropdownProps> = props => {
  const {
    clickOutsideId,
    placeholder,
    inputValue,
    setInputValue,
    LeftComponent,
    DropdownComponent,
    RightComponent,
  } = props;

  const {ref, clickedInside, registerClickInside, reset} =
    useOnClickOutsideComponent(`${clickOutsideId}/searchable-dropdown`);

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
      <MyText>Start</MyText>
      {!!LeftComponent && <LeftComponent />}

      <FlexCol>
        <MyTextInput
          placeholder={placeholder}
          value={inputValue}
          onChangeText={setInputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          // @ts-ignore
          keyboardShouldPersistTaps="always"
        />

        {shouldDisplayDropdown && <DropdownComponent />}
      </FlexCol>

      {!!RightComponent && <RightComponent />}
      <MyText>End</MyText>
    </StyledRow>
  );
};

const StyledRow = styled(FlexRow)`
  bordercolor: black;
  borderwidth: 2;
`;
