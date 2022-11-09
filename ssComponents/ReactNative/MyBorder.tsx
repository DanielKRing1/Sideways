import React, {FC} from 'react';
import {View, useWindowDimensions} from 'react-native';
import {DefaultTheme, useTheme} from 'styled-components/native';

type MyBorderProps = {
  children?: React.ReactNode;
};
const MyBorder: FC<MyBorderProps> = props => {
  const {children} = props;

  const theme: DefaultTheme = useTheme();
  const {width} = useWindowDimensions();

  return (
    <View
      style={{
        borderWidth: width / theme.border.widthDivisors.sm,
        borderColor: theme.border.color.main,
        borderRadius: width / theme.border.radiusDivisors.sm,

        paddingTop: width / theme.paddingDivisors.md,
        paddingBottom: width / theme.paddingDivisors.md,
        paddingLeft: width / theme.paddingDivisors.sm,
        paddingRight: width / theme.paddingDivisors.sm,

        marginTop: width / theme.paddingDivisors.sm,
      }}>
      {children}
    </View>
  );
};

export default MyBorder;
