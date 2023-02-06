import React, {forwardRef} from 'react';
import {TextInput, TextInputProps, useWindowDimensions} from 'react-native';
import {getFontSize} from 'ssTheme/utils';
import styled, {DefaultTheme, useTheme} from 'styled-components/native';

import {DISPLAY_SIZE} from '../../global';

type MyTextInputProps = {
  size?: DISPLAY_SIZE;
} & TextInputProps;
const MyTextInput = forwardRef<TextInput, MyTextInputProps>((props, ref) => {
  const {size = DISPLAY_SIZE.md, style} = props;

  const theme: DefaultTheme = useTheme();
  const {width} = useWindowDimensions();

  const fontSize: number = getFontSize(size, width, theme);

  return (
    <StyledTextInput
      ref={ref}
      placeholderTextColor={theme.colors.lightText}
      {...props}
      style={{
        fontSize,
        // @ts-ignore
        ...style,
      }}
    />
  );
});
export default MyTextInput;

const StyledTextInput = styled.TextInput<DefaultTheme>`
  margin: 0;
  padding: 0;
  background-color: ${({theme}: {theme: DefaultTheme}) => theme.colors.whiteBg};
  color: ${({theme}: {theme: DefaultTheme}) => theme.colors.blackText};
`;
