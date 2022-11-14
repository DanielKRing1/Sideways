import React, {FC} from 'react';
import {View, ViewStyle} from 'react-native';

type StopPropagationViewProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};
const StopPropagationView: FC<StopPropagationViewProps> = props => {
  const {children, style = {}} = props;

  return (
    <View
      onStartShouldSetResponder={event => true}
      onTouchEnd={e => {
        e.stopPropagation();
      }}
      style={style}>
      {children}
    </View>
  );
};

export default StopPropagationView;
