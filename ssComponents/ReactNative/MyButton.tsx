import React, { FC } from 'react';
import { ButtonProps } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';

import { Dict } from '../../global';

export type MyButtonProps = {
    children?: React.ReactNode;
    style?: Dict<number | string>;
} & Omit<ButtonProps, 'title'>;
const MyButton: FC<MyButtonProps> = (props) => {

    return (
        <StyledTouchableOpacity
            {...props}
            style={props.style}
        />
    )
};
export default MyButton;

const StyledTouchableOpacity = styled.TouchableOpacity<DefaultTheme>`
    borderColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.grayBorder};

    backgroundColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.whiteBg};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.blackText};

    justifyContent: center;
    alignItems: center;
`;
