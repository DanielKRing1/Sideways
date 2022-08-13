import React, { FC } from 'react';
import { TextProps } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';

import { Dict } from '../../global';
import { theme } from '../../theme/theme';

type MyTextProps = {
    style?: Dict<number | string>;
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
