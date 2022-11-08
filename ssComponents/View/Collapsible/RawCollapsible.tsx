import React, {FC, useEffect, useState} from 'react';
import {Animated, Easing, TouchableOpacity, View} from 'react-native';

type RawCollapsibleProps = {
  Header: FC<{}>;

  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  openHeight: number;
  duration?: number;
  children?: React.ReactNode;
};
const RawCollapsible: FC<RawCollapsibleProps> = props => {
  const {
    Header,
    isOpen,
    setIsOpen,
    openHeight,
    duration = 400,
    children,
  } = props;

  // STATE
  const [animation] = useState(new Animated.Value(isOpen ? openHeight : 0));

  // EFFECTS
  useEffect(() => {
    if (isOpen) animation.setValue(openHeight);
  }, [openHeight]);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? openHeight : 0,
      duration,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  // HANDLERS
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleOpen}>
        <Header />
      </TouchableOpacity>

      <Animated.View
        style={{
          overflow: 'hidden',
          height: animation,
        }}>
        {children}
      </Animated.View>
    </View>
  );
};

export default RawCollapsible;
