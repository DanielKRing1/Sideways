import React, {FC, useState} from 'react';
import {Animated, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

import {BoxShadowStyles} from '../Shadow/BoxShadowStyles';

type Coordinate = {
  x: number;
  y: number;
};

type FloatingActionButtonProps = {
  position: Coordinate;
  radius: number;

  Components: FC<{}>[];
};
const FloatingActionButton: FC<FloatingActionButtonProps> = props => {
  const {position, radius, Components} = props;

  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);

    Animated.spring(animation, {
      toValue,
      friction: 7,
      useNativeDriver: false,
    }).start();
  };

  const secondaryRadius: number = (radius * 4) / 5;
  const primaryRadius: number = radius;

  return (
    <AbsoluteContainer position={position}>
      {/* Secondary */}
      {Components.map((Component: FC<{}>, i: number) => (
        <StyledAnimation
          style={[
            getTranslateY(animation, secondaryRadius, i),
            getOpacity(animation),
          ]}
          radius={secondaryRadius}>
          <Component />
        </StyledAnimation>
      ))}

      {/* Primary */}
      <MyTouchable
        animation={getRotation(animation)}
        radius={primaryRadius}
        onPress={toggleMenu}>
        <Text>X</Text>
      </MyTouchable>
    </AbsoluteContainer>
  );
};

export default FloatingActionButton;

const getRotation = (animation: Animated.Value) => ({
  transform: [
    {
      rotate: animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
      }),
    },
  ],
});

const getTranslateY = (
  animation: Animated.Value,
  radius: number,
  index: number,
) => ({
  transform: [
    {scale: animation},
    {
      translateY: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -(2.4 * radius * (index + 1))],
      }),
    },
  ],
});

const getOpacity = (animation: Animated.Value) => ({
  opacity: animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  }),
});

// MY TOUCHABLE
type MyTouchableProps = {
  animation: any;
  radius: number;
  onPress: () => void;
  children: React.ReactNode;
};
const MyTouchable: FC<MyTouchableProps> = ({
  radius,
  onPress,
  children,
  animation,
}) => (
  <TouchableOpacity onPress={onPress}>
    <StyledAnimation style={animation} radius={radius}>
      {children}
    </StyledAnimation>
  </TouchableOpacity>
);

// BUILDING BLOCKS
type AbsoluteContainerProps = {
  position: Coordinate;
};
const AbsoluteContainer = styled.View<AbsoluteContainerProps>`
  flex: 1;

  position: absolute;

  right: ${({position}: AbsoluteContainerProps) => position.x};
  bottom: ${({position}: AbsoluteContainerProps) => position.y};
`;
type StyledAnimationProps = {
  radius: number;
};
const StyledAnimation = styled(Animated.View)<StyledAnimationProps>`
  position: absolute;
  alignitems: center;
  justifycontent: center;
  alignself: center;

  height: ${({radius}: StyledAnimationProps) => radius * 2};
  width: ${({radius}: StyledAnimationProps) => radius * 2};
  borderradius: ${({radius}: StyledAnimationProps) => radius};

  ${BoxShadowStyles}

  backgroundColor: white;
`;
