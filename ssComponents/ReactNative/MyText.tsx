import React, {FC} from 'react';
import {TextProps, TextStyle, useWindowDimensions} from 'react-native';
import {getFontSize} from 'ssTheme/utils';
import styled, {DefaultTheme, useTheme} from 'styled-components/native';

import {DISPLAY_SIZE} from '../../global';

type MyTextProps = {
  size?: DISPLAY_SIZE;
  style?: TextStyle;
} & TextProps;
const MyText: FC<MyTextProps> = props => {
  const {size = DISPLAY_SIZE.md, style = {}} = props;

  const theme: DefaultTheme = useTheme();
  const {width} = useWindowDimensions();

  const fontSize: number = getFontSize(size, width, theme);

  // @ts-ignore
  return <StyledText {...props} style={{fontSize, ...style}} />;
};
export default MyText;

const StyledText = styled.Text<DefaultTheme>`
  backgroundcolor: ${({theme}: {theme: DefaultTheme}) => theme.colors.whiteBg};
  color: ${({theme}: {theme: DefaultTheme}) => theme.colors.blackText};
`;
