import React, {FC} from 'react';
import {View, ViewStyle} from 'react-native';

type VerticalSpaceProps = {
  spacing?: number;
  style?: ViewStyle;
};
const VerticalSpace: FC<VerticalSpaceProps> = props => {
  const {spacing = 10, style = {}} = props;

  return <View style={{height: spacing, ...style}} />;
};

export default VerticalSpace;
