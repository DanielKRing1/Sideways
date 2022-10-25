import React, {FC} from 'react';
import styled from 'styled-components/native';

import MyText from '../../../ssComponents/ReactNative/MyText';

type LoadingComponentProps = {};
export const LoadingComponent: FC<LoadingComponentProps> = props => {
  const {} = props;

  return <MyText>Loading...</MyText>;
};
