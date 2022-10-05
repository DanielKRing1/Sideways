import React, { FC, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

type SliderProps = {
    sliderWidth: number;
    createSliderButton: (isPressed: Animated.SharedValue<boolean>, offsetX: Animated.SharedValue<number>) => FC<Animated.AnimateProps<any>>;

    isPressed: Animated.SharedValue<boolean>;
    offsetX: Animated.SharedValue<number>;
    delta?: Animated.SharedValue<number>;

    onChangeValue: (newX: number) => void;
    onChangeDelta?: (newX: number) => void;
    minValue: number;
    maxValue: number;
    step: number;
};
const Slider: FC<SliderProps> = (props) => {
    const { sliderWidth, createSliderButton, isPressed, offsetX, delta = useSharedValue(Infinity), onChangeValue, onChangeDelta = undefined, minValue, maxValue, step } = props;

    const AnimatedComponent = React.useMemo(() => createSliderButton(isPressed, offsetX), [createSliderButton]);

    const lastX = useSharedValue(offsetX.value);
    const left = useSharedValue(0);
    const right = useSharedValue(0);
    const stepUnit = useSharedValue(0);
    const valueCopy = useSharedValue(minValue);

    // GESTURE HANDLER
    const startX = useSharedValue(0);
    const gesture = Gesture.Pan()
        .onBegin(() => {
            isPressed.value = true;
        })
        .onUpdate((e) => {
            const newX = e.translationX + startX.value;
            if (newX <= right.value && newX >= left.value) {
                offsetX.value = newX;

                
                const curValue: number = offsetX.value === 0 ? minValue : (Math.floor(offsetX.value / stepUnit.value) + minValue) / step;
                if(curValue !== valueCopy.value) {
                  valueCopy.value = curValue;
                  runOnJS(onChangeValue)(curValue);
                }
 
                // Moved by some delta
                if (onChangeDelta !== undefined && Math.abs(offsetX.value - lastX.value) >= delta.value) {
                    lastX.value = offsetX.value;
                    runOnJS(onChangeDelta)(offsetX.value);
                }
            }
        })
        .onEnd(() => {
            startX.value = offsetX.value;
        })
        .onFinalize(() => {
            isPressed.value = false;
        });

    return (
        <StyledView
            onLayout={(evt) => {
                const { width } = evt.nativeEvent.layout;

                left.value = 0;
                right.value = 0 + width - sliderWidth;

                const panDistance = 0 - 0 + width - sliderWidth;
                const valueRange = maxValue - minValue + 1;
                // Define the pixel distance for a single step across the given value range
                stepUnit.value = panDistance / valueRange / step;
            }}
        >
            <GestureDetector gesture={gesture}>
                <AnimatedComponent />
            </GestureDetector>
        </StyledView>
    );
};

export default Slider;

const StyledView = styled.View`
  backgroundColor: grey;
`;
