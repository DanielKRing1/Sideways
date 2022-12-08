import React, {FC} from 'react';
import {ButtonProps, ViewStyle} from 'react-native';
import styled, {DefaultTheme} from 'styled-components/native';

export type MyButtonProps = {
  children?: React.ReactNode;
  style?: ViewStyle;
} & Omit<ButtonProps, 'title'>;
const MyButton: FC<MyButtonProps> = props => {
  return <StyledTouchableOpacity {...props} style={props.style} />;
};
export default MyButton;

const StyledTouchableOpacity = styled.TouchableOpacity<
  MyButtonProps & DefaultTheme
>`
  bordercolor: ${({theme}: {theme: DefaultTheme}) => theme.colors.grayBorder};

  background-color: ${({disabled, theme}) =>
    disabled ? theme.colors.disabled : theme.colors.whiteBg};
  color: ${({theme}: {theme: DefaultTheme}) => theme.colors.blackText};

  justify-content: center;
  align-items: center;
`;
