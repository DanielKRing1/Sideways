import React, { FC, forwardRef } from 'react';
import { View } from 'react-native';

import FlexBase, { FlexContainerProps } from './FlexBase'

const FlexCol: FC<FlexContainerProps> = forwardRef<View, FlexContainerProps>((props, ref) => {
  const { children } = props;

  return (
    <FlexBase
      ref={ref}
      flexDirection='column'
      {...props}
    >
      {children}
    </FlexBase>
  )
});

export default FlexCol;
