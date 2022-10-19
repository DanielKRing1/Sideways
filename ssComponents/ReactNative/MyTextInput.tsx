import React, { FC, forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';

import { Dict } from '../../global';

type MyTextInputProps = {
    style?: Dict<number | string>;
} & TextInputProps;
const MyTextInput = forwardRef<TextInput, MyTextInputProps>((props, ref) => {
    const { style, placeholder, value, onChangeText, onFocus, onBlur } = props;

    const theme = useTheme();

    return (
        <StyledTextInput
            ref={ref}
            placeholderTextColor={theme.colors.lightText}
            {...props}
        />
    )
});
export default MyTextInput;

const StyledTextInput = styled.TextInput<DefaultTheme>`
    backgroundColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.whiteBg};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.blackText};
`;
