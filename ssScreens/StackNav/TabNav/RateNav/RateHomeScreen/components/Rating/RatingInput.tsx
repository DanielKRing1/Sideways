import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import styled, {DefaultTheme} from 'styled-components/native';
// import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// REDUX
import {RootState} from 'ssRedux/index';
import {setRating as setRatingR} from 'ssRedux/rateSidewaysSlice';
import {setReplacementRating as setRatingUR} from 'ssRedux/undorateSidewaysSlice';

// COMPONENTS
// import Slider from 'ssComponents/Input/ReanimatedSlider';
import MyText from 'ssComponents/ReactNative/MyText';
import MyTextInput from 'ssComponents/ReactNative/MyTextInput';
import {RATING_TYPE} from '../RatingMenu/types';
import {select} from 'ssUtils/selector';

const SLIDER_WIDTH: number = 40;

// const createSliderButton = (isPressed: Animated.SharedValue<boolean>,
// offsetX: Animated.SharedValue<number>): React.FC<Animated.AnimateProps<any>> => (props) => {
//     const { style: animatedSliderStyles } = props;

//     const animatedStyles = useAnimatedStyle(() => ({
//         transform: [
//             { translateX: offsetX.value },
//             { scale: withSpring(isPressed.value ? 1.2 : 1) },
//         ],
//         backgroundColor: isPressed.value ? 'yellow' : 'blue',
//     }));

//     return (
//         <Animated.View style={[styles.slider, animatedStyles, animatedSliderStyles]} />
//     );
// }

type RatingSliderProps = {
  ratingType: RATING_TYPE;
};
const RatingSlider: React.FC<RatingSliderProps> = props => {
  // PROPS
  const {ratingType} = props;

  // const isPressed = useSharedValue(false);
  // const offsetX = useSharedValue(0);

  // REDUX
  const {rating: ratingR} = useSelector(
    (state: RootState) => state.rateSidewaysSlice,
  );
  const {rating: ratingUR} = useSelector(
    (state: RootState) => state.undorateSidewaysSlice,
  );
  // Select reducer values
  const [, rating] = select(
    ratingType,
    [RATING_TYPE.Rate, ratingR],
    [RATING_TYPE.UndoRate, ratingUR],
  );
  // Select reducer actions
  const [, setRating] = select(
    ratingType,
    [RATING_TYPE.Rate, setRatingR],
    [RATING_TYPE.UndoRate, setRatingUR],
  );
  const dispatch = useDispatch();

  const onChangeValue = (newText: string) => {
    // @ts-ignore
    if (isNaN(newText)) return;

    const newNum: number = newText === '' ? 0 : parseInt(newText, 10);

    console.log(`New value: ${newNum}`);
    dispatch(setRating(newNum));
  };

  return (
    <View>
      <MyTextInput
        keyboardType="numeric"
        value={`${rating}`}
        onChangeText={onChangeValue}
      />
      {/* <MyText>Rating: {rating}</MyText> */}

      {/* <Slider
                sliderWidth={SLIDER_WIDTH}
                createSliderButton={createSliderButton}

                isPressed={isPressed}
                offsetX={offsetX}

                onChangeValue={onChangeValue}
                minValue={1}
                maxValue={10}
                step={1}
            /> */}
      {/* <Animated.Text>{offsetX.value}</Animated.Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  slider: {
    width: SLIDER_WIDTH,
    transform: [{translateX: -20}],
    height: 40,
    borderRadius: 20,
    position: 'relative',
    marginBottom: 50,
  },
});

export default RatingSlider;

type StyledTextProps = {
  theme: DefaultTheme;

  isSelected: boolean;
};
const StyledText = styled(MyText)<StyledTextProps>`
  background-color: ${({theme, isSelected}: StyledTextProps) =>
    isSelected ? theme.colors.pastelPurple : theme.colors.grayBorder};
`;
