import React, {FC} from 'react';
import {useWindowDimensions, View, ViewStyle} from 'react-native';
import {DefaultTheme, useTheme} from 'styled-components';

import {getPadding} from 'ssTheme/utils';
import {DISPLAY_SIZE} from '../../global';

type MyPaddingProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  baseSize?: DISPLAY_SIZE;
  topSize?: DISPLAY_SIZE;
  rightSize?: DISPLAY_SIZE;
  bottomSize?: DISPLAY_SIZE;
  leftSize?: DISPLAY_SIZE;
};
const MyPadding: FC<MyPaddingProps> = props => {
  const {
    children,
    style,
    baseSize = DISPLAY_SIZE.md,
    topSize = baseSize,
    bottomSize = baseSize,
    rightSize = baseSize,
    leftSize = baseSize,
  } = props;

  const theme: DefaultTheme = useTheme();
  const {width} = useWindowDimensions();
  const paddingTop: number = getPadding(topSize, width, theme);
  const paddingBottom: number = getPadding(bottomSize, width, theme);
  const paddingRight: number = getPadding(rightSize, width, theme);
  const paddingLeft: number = getPadding(leftSize, width, theme);

  return (
    <View
      {...props}
      style={{
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,

        backgroundColor: 'transparent',
        justifyContent: 'center',
        ...style,
      }}>
      {children}
    </View>
  );
};

export default MyPadding;
