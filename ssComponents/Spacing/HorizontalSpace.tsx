import React, {FC} from 'react';
import {View} from 'react-native';

export type HorizontalSpaceProps = {
  spacing?: number;
};
const HorizontalSpace: FC<HorizontalSpaceProps> = props => {
  const {spacing = 10} = props;

  return <View style={{width: spacing}} />;
};

export default HorizontalSpace;
