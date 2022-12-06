import React, {FC, useMemo} from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  ViewProps,
} from 'react-native';

type DismissKeyboardViewProps = {
  children: React.ReactNode;
} & ViewProps;
const DismissKeyboardView: FC<DismissKeyboardViewProps> = props => {
  const {children} = props;

  const id: number = useMemo(() => Math.random(), []);

  console.log('DISMISSKEYBOARD RERENDER');
  console.log(id);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View {...props}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardView;

type PersistKeyboardViewProps = {
  children: React.ReactNode;
} & ViewProps;
export const PersistKeyboardView: FC<PersistKeyboardViewProps> = props => {
  const {children} = props;

  return (
    <TouchableWithoutFeedback onPress={() => {}} accessible={false}>
      <View {...props}>{children}</View>
    </TouchableWithoutFeedback>
  );
};
