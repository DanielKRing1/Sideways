import React, {FC} from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';

type VerticalSpaceProps = {
  spacing?: number;
};
const VerticalSpace: FC<VerticalSpaceProps> = props => {
  const {spacing = 10} = props;

  return <View style={{height: spacing}}></View>;
};

export default VerticalSpace;
