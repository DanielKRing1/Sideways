import React, {FC} from 'react';
import {useWindowDimensions, View, ViewStyle} from 'react-native';
import {DefaultTheme, useTheme} from 'styled-components';

type MyPaddingProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};
const MyPadding: FC<MyPaddingProps> = props => {
  const {children, style} = props;

  const theme: DefaultTheme = useTheme();
  const {width} = useWindowDimensions();

  return (
    <View
      {...props}
      style={{
        paddingTop: width / theme.paddingDivisors.md,
        paddingBottom: width / theme.paddingDivisors.md,
        paddingLeft: width / theme.paddingDivisors.md / 2,
        paddingRight: width / theme.paddingDivisors.md / 2,

        backgroundColor: 'transparent',
        justifyContent: 'center',
        ...style,
      }}>
      {children}
    </View>
  );
};

export default MyPadding;
