import React, {FC} from 'react';
import {View, ViewStyle, useWindowDimensions} from 'react-native';
import {DefaultTheme, useTheme} from 'styled-components/native';
import MyPadding from './MyPadding';

type MyBorderProps = {
  children?: React.ReactNode;
  style?: ViewStyle;
};
const MyBorder: FC<MyBorderProps> = props => {
  const {children, style = {}} = props;

  const theme: DefaultTheme = useTheme();
  const {width} = useWindowDimensions();

  return (
    <View
      style={{
        borderWidth: width / theme.border.widthDivisors.sm,
        borderColor: theme.border.color.main,
        borderRadius: width / theme.border.radiusDivisors.sm,

        ...style,
      }}>
      <MyPadding>{children}</MyPadding>
    </View>
  );
};

export default MyBorder;
