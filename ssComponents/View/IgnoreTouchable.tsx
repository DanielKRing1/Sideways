import React, {FC} from 'react';
import {View} from 'react-native';

type IgnoreTouchableProps = {
  children: React.ReactNode;
};
const IgnoreTouchable: FC<IgnoreTouchableProps> = ({children}) => (
  <View onStartShouldSetResponder={() => true}>{children}</View>
);

export default IgnoreTouchable;
