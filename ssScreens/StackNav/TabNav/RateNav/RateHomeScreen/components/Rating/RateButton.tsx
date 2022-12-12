import React, {FC, useMemo} from 'react';
import {useWindowDimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {DefaultTheme, useTheme} from 'styled-components/native';

import MyButton from 'ssComponents/ReactNative/MyButton';
import MyText from 'ssComponents/ReactNative/MyText';
import {AppDispatch, RootState} from 'ssRedux/index';
import {startRate} from 'ssRedux/rateSidewaysSlice';
import {useTabBarHeight} from 'ssHooks/useTabBarHeight';

type RateButtonProps = {};
const RateButton: FC<RateButtonProps> = props => {
  // REDUX
  const {inputs, outputs, rating} = useSelector(
    (state: RootState) => state.rateSidewaysSlice,
  );
  const dispatch: AppDispatch = useDispatch();

  // HANDLERS
  const handleRate = async () => {
    dispatch(startRate());
  };

  // HOOKS
  const theme: DefaultTheme = useTheme();
  const {width, height} = useWindowDimensions();
  const {topNavHeight} = useTabBarHeight();

  // LOCAL STATE
  const validRating: boolean = useMemo(
    () => inputs.length > 0 && outputs.length > 0 && rating > 0,
    [inputs, outputs, rating],
  );

  return (
    <MyButton
      disabled={!validRating}
      style={{
        borderWidth: width / theme.border.widthDivisors.md,
        borderRadius: width / theme.border.radiusDivisors.sm,
        padding: width / theme.paddingDivisors.md,
        width: '100%',
        height: topNavHeight,
      }}
      onPress={handleRate}>
      <MyText>Rate .u.</MyText>
    </MyButton>
  );
};

export default RateButton;
