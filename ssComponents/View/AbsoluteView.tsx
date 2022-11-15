import React, {FC} from 'react';
import {View, ViewStyle} from 'react-native';

type AbsoluteViewProps = {
  children?: React.ReactNode;
  style?: ViewStyle;
};
const AbsoluteView: FC<AbsoluteViewProps> = props => {
  const {children, style = {}} = props;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}>
      {children}
    </View>
  );
};

export default AbsoluteView;
