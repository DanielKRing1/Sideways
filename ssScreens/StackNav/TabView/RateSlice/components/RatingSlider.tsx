import * as React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import styled, {DefaultTheme} from 'styled-components/native';
// import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// REDUX
import {RootState} from '../../../../../ssRedux';
import {setRating} from '../../../../../ssRedux/rateSidewaysSlice';

// COMPONENTS
import Slider from '../../../../../ssComponents/Input/ReanimatedSlider';
import MyText from '../../../../../ssComponents/ReactNative/MyText';
import MyTextInput from '../../../../../ssComponents/ReactNative/MyTextInput';

const SLIDER_WIDTH: number = 40;

// const createSliderButton = (isPressed: Animated.SharedValue<boolean>, offsetX: Animated.SharedValue<number>): React.FC<Animated.AnimateProps<any>> => (props) => {
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

type RatingSliderProps = {};
const RatingSlider: React.FC<RatingSliderProps> = props => {
  // const isPressed = useSharedValue(false);
  // const offsetX = useSharedValue(0);

  const {rating, ratedSignature} = useSelector((state: RootState) => ({
    ...state.rateSidewaysSlice,
  }));
  const dispatch = useDispatch();

  const onChangeValue = (newText: string) => {
    const newNum: number = parseInt(newText);

    console.log(`New value: ${newNum}`);
    dispatch(setRating(newNum));
  };

  return (
    <View>
      <MyTextInput
        keyboardType="numeric"
        placeholder="Temp rating input..."
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
  backgroundcolor: ${({theme, isSelected}: StyledTextProps) =>
    isSelected ? theme.colors.pastelPurple : theme.colors.grayBorder};
`;
