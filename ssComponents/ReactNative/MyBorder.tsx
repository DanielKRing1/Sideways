import React, {FC} from 'react';
import {View, ViewStyle, useWindowDimensions} from 'react-native';
import {BoxShadow} from 'ssComponents/Shadow/BoxShadow';
import {getBoxShadowStyles} from 'ssComponents/Shadow/BoxShadowStyles';
import {DefaultTheme, useTheme} from 'styled-components/native';

import {DISPLAY_SIZE} from '../../global';
import MyPadding from './MyPadding';

type MyBorderProps = {
  children?: React.ReactNode;
  style?: ViewStyle;
  shadow?: boolean;

  marginBase?: DISPLAY_SIZE;
  marginTop?: DISPLAY_SIZE;
  marginRight?: DISPLAY_SIZE;
  marginBottom?: DISPLAY_SIZE;
  marginLeft?: DISPLAY_SIZE;

  paddingBase?: DISPLAY_SIZE;
  paddingTop?: DISPLAY_SIZE;
  paddingRight?: DISPLAY_SIZE;
  paddingBottom?: DISPLAY_SIZE;
  paddingLeft?: DISPLAY_SIZE;
};
const MyBorder: FC<MyBorderProps> = props => {
  const {
    children,
    style = {},
    shadow = false,

    marginBase,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,

    paddingBase,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  } = props;

  const theme: DefaultTheme = useTheme();
  const {width} = useWindowDimensions();

  const shadowStyles = shadow ? getBoxShadowStyles() : {};

  return (
    <MyPadding
      isMargin={true}
      baseSize={marginBase}
      topSize={marginTop}
      bottomSize={marginBottom}
      leftSize={marginLeft}
      rightSize={marginRight}
      style={{
        borderWidth: width / theme.border.widthDivisors.sm,
        borderColor: theme.border.color.main,
        borderRadius: width / theme.border.radiusDivisors.sm,
        ...shadowStyles,
        ...style,
      }}>
      <MyPadding
        baseSize={paddingBase}
        topSize={paddingTop}
        bottomSize={paddingBottom}
        leftSize={paddingLeft}
        rightSize={paddingRight}>
        {children}
      </MyPadding>
    </MyPadding>
  );
};

export default MyBorder;
