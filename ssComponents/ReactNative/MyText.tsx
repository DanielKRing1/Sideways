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

  return (
    <StyledText
      {...props}
      style={{
        fontSize,
        // @ts-ignore
        ...style,
      }}
    />
  );
};
export default MyText;

const StyledText = styled.Text<DefaultTheme>`
  align-items: center;
  justify-content: center;

  color: ${({theme}: {theme: DefaultTheme}) => theme.colors.blackText};
`;
