import React, { FC } from 'react';
import { TextInputProps } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';

import { Dict } from '../../global';
import { theme } from '../../theme/theme';

type MyTextInputProps = {
    style?: Dict<number | string>;
} & TextInputProps;
const MyTextInput: FC<MyTextInputProps> = (props) => {
    const { style, placeholder, value, onChangeText, onFocus, onBlur } = props;

    return (
        <StyledTextInput
            placeholderTextColor={theme.colors.lightgrayText}
            {...props}
        />
    )
};
export default MyTextInput;

const StyledTextInput = styled.TextInput<DefaultTheme>`
    backgroundColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.whiteBg};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.blackText};
`;
