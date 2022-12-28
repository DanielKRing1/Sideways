import React, {FC, useMemo} from 'react';
import {useWindowDimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {DefaultTheme, useTheme} from 'styled-components/native';

import MyButton from 'ssComponents/ReactNative/MyButton';
import MyText from 'ssComponents/ReactNative/MyText';
import {AppDispatch, RootState} from 'ssRedux/index';
import {startRate as startRateR} from 'ssRedux/rateSidewaysSlice';
import {startUpdateRate as startRateUR} from 'ssRedux/undorateSidewaysSlice';
import {useTabBarHeight} from 'ssHooks/useTabBarHeight';
import {RATING_TYPE} from '../RatingMenu/types';
import {select} from 'ssUtils/selector';

type RateButtonProps = {
  ratingType: RATING_TYPE;
};
const RateButton: FC<RateButtonProps> = props => {
  // PROPS
  const {ratingType} = props;

  // REDUX
  const {
    inputs: inputsR,
    outputs: outputsR,
    rating: ratingR,
  } = useSelector((state: RootState) => state.rateSidewaysSlice);
  const {
    inputs: inputsUR,
    outputs: outputsUR,
    rating: ratingUR,
  } = useSelector((state: RootState) => state.undorateSidewaysSlice);
  // Select reducer values
  const [, {inputs, outputs, rating}] = select(
    ratingType,
    [RATING_TYPE.Rate, {inputs: inputsR, outputs: outputsR, rating: ratingR}],
    [
      RATING_TYPE.UndoRate,
      {inputs: inputsUR, outputs: outputsUR, rating: ratingUR},
    ],
  );
  // Select reducer actions
  const [, startRate] = select(
    ratingType,
    [RATING_TYPE.Rate, startRateR],
    [RATING_TYPE.UndoRate, startRateUR],
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
