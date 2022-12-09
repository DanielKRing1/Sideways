import React, {FC, useMemo} from 'react';
import {useWindowDimensions, View, ViewStyle} from 'react-native';
import {DefaultTheme, useTheme} from 'styled-components';

import {getPadding} from 'ssTheme/utils';
import {DISPLAY_SIZE} from '../../global';

type MyPaddingProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  isMargin?: boolean;
  baseSize?: DISPLAY_SIZE;
  topSize?: DISPLAY_SIZE;
  rightSize?: DISPLAY_SIZE;
  bottomSize?: DISPLAY_SIZE;
  leftSize?: DISPLAY_SIZE;
};
const MyPadding: FC<MyPaddingProps> = props => {
  const {
    children,
    style = {},
    isMargin = false,
    baseSize = DISPLAY_SIZE.md,
    topSize = baseSize,
    bottomSize = baseSize,
    rightSize = baseSize,
    leftSize = baseSize,
  } = props;

  const theme: DefaultTheme = useTheme();
  const {width} = useWindowDimensions();
  const spacingStyle = useMemo(() => {
    const paddingTop: number = getPadding(topSize, width, theme);
    const paddingBottom: number = getPadding(bottomSize, width, theme);
    const paddingRight: number = getPadding(rightSize, width, theme);
    const paddingLeft: number = getPadding(leftSize, width, theme);

    switch (isMargin) {
      case false:
        return {
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
        };

      case true:
        return {
          marginTop: paddingTop,
          marginBottom: paddingBottom,
          marginLeft: paddingLeft,
          marginRight: paddingRight,
        };
    }
  }, [topSize, bottomSize, rightSize, leftSize, width, theme]);

  return (
    <View
      {...props}
      style={{
        ...spacingStyle,

        backgroundColor: 'transparent',
        justifyContent: 'center',
        ...style,
      }}>
      {children}
    </View>
  );
};

export default MyPadding;
