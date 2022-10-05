import React, { FC } from 'react';
import { TextInputProps } from 'react-native';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';

import { Dict } from '../../global';

type MyTextInputProps = {
    style?: Dict<number | string>;
} & TextInputProps;
const MyTextInput: FC<MyTextInputProps> = (props) => {
    const { style, placeholder, value, onChangeText, onFocus, onBlur } = props;

    const theme = useTheme();

    return (
        <StyledTextInput
            placeholderTextColor={theme.colors.lightText}
            {...props}
        />
    )
};
export default MyTextInput;

const StyledTextInput = styled.TextInput<DefaultTheme>`
    backgroundColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.whiteBg};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.blackText};
`;
