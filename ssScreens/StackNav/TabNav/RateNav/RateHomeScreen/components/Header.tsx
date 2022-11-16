import React, {FC} from 'react';
import {} from 'react-native';
import MyBorder from 'ssComponents/ReactNative/MyBorder';
import MyPadding from 'ssComponents/ReactNative/MyPadding';
import MyText from 'ssComponents/ReactNative/MyText';
import {DefaultTheme, useTheme} from 'styled-components/native';

import {DISPLAY_SIZE} from '../../../../../../global';

type HeaderProps = {
  title: string;
};
const Header: FC<HeaderProps> = props => {
  const {title} = props;

  const theme: DefaultTheme = useTheme();

  return (
    <MyBorder
      style={{
        backgroundColor: theme.backgroundColors.accent,
      }}>
      <MyText size={DISPLAY_SIZE.lg} style={{fontWeight: 'bold'}}>
        {title}
      </MyText>
    </MyBorder>
  );
};

export default Header;
