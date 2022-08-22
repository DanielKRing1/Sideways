import React, { FC } from 'react';
import { TextProps } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';

import { Dict } from '../../global';
import { theme } from '../../theme/theme';

type MyButtonProps = {
    style?: Dict<number | string>;
} & TextProps;
const MyButton: FC<MyButtonProps> = (props) => {

    return (
        <StyledText
            {...props}
        />
    )
};
export default MyButton;

const StyledText = styled.Text<DefaultTheme>`
    backgroundColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.whiteBg};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.blackText};
`;
