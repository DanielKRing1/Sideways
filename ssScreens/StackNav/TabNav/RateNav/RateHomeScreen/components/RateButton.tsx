import React, {FC} from 'react';
import {useWindowDimensions} from 'react-native';
import {useDispatch} from 'react-redux';
import {DefaultTheme, useTheme} from 'styled-components/native';

import MyButton from 'ssComponents/ReactNative/MyButton';
import MyText from 'ssComponents/ReactNative/MyText';
import {AppDispatch} from 'ssRedux/index';
import {startRate} from 'ssRedux/rateSidewaysSlice';
import {useTabBarHeight} from 'ssHooks/useTabBarHeight';

type RateButtonProps = {};
const RateButton: FC<RateButtonProps> = props => {
  // REDUX
  const dispatch: AppDispatch = useDispatch();

  // HANDLERS
  const handleRate = async () => {
    dispatch(startRate());
  };

  // HOOKS
  const theme: DefaultTheme = useTheme();
  const {width, height} = useWindowDimensions();
  const {remainingHeight} = useTabBarHeight();

  return (
    <MyButton
      style={{
        borderWidth: width / theme.border.widthDivisors.md,
        borderRadius: width / theme.border.radiusDivisors.sm,
        padding: width / theme.paddingDivisors.md,
        width: '100%',
        height: (remainingHeight * 10) / 100,
      }}
      onPress={handleRate}>
      <MyText>Rate .u.</MyText>
    </MyButton>
  );
};

export default RateButton;
