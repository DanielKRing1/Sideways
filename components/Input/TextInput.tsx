import React, { FC } from 'react';
import { TextInputProps } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';

import { Dict } from '../../global';

type MyTextInputProps = {
    style: Dict<number | string>;
} & TextInputProps;
const MyTextInput: FC<MyTextInputProps> = (props) => {
    const { style, placeholder, value, onChangeText, onFocus, onBlur } = props;

    return (
        <StyledTextInput
            {...props}
        />
    )
};
export default MyTextInput;

const StyledTextInput = styled.TextInput<DefaultTheme>`
    color: ${(props: DefaultTheme) => props.theme.blackText};
`;
