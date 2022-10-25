import React, {FC} from 'react';
import {View} from 'react-native';

type VerticalSpaceProps = {
  spacing?: number;
};
const VerticalSpace: FC<VerticalSpaceProps> = props => {
  const {spacing = 10} = props;

  return <View style={{height: spacing}} />;
};

export default VerticalSpace;
