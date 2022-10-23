import React, { FC } from 'react';
import { TextProps, TextStyle } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';

type MyTextProps = {
    style?: TextStyle;
} & TextProps;
const MyText: FC<MyTextProps> = (props) => {

    return (
        <StyledText
            {...props}
        />
    )
};
export default MyText;

const StyledText = styled.Text<DefaultTheme>`
    backgroundColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.whiteBg};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.blackText};
`;
