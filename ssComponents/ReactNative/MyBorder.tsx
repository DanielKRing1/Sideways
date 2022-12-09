import React, {FC} from 'react';
import {View, ViewStyle, useWindowDimensions} from 'react-native';
import {DefaultTheme, useTheme} from 'styled-components/native';

import {DISPLAY_SIZE} from '../../global';
import MyPadding from './MyPadding';

type MyBorderProps = {
  children?: React.ReactNode;
  style?: ViewStyle;

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

  return (
    <MyPadding
      isMargin={true}
      baseSize={marginBase}
      topSize={marginTop}
      bottomSize={marginBottom}
      leftSize={marginLeft}
      rightSize={marginRight}>
      <View
        style={{
          borderWidth: width / theme.border.widthDivisors.sm,
          borderColor: theme.border.color.main,
          borderRadius: width / theme.border.radiusDivisors.sm,

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
      </View>
    </MyPadding>
  );
};

export default MyBorder;
