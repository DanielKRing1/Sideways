import React, {FC} from 'react';
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View {...props}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardView;
