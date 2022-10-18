import React, { FC, forwardRef } from 'react';
import { ViewStyle, View } from 'react-native';

import FlexBase, { FlexContainerProps } from './FlexBase'

const FlexCol: FC<FlexContainerProps> = forwardRef<View, FlexContainerProps>((props, ref) => {
  const { style, children, justifyContent, alignItems } = props;

  return (
    <FlexBase
      // @ts-ignore
      ref={ref}
      style={style}
      flexDirection='column'
      justifyContent={justifyContent}
      alignItems={alignItems}
    >
      {children}
    </FlexBase>
  )
});

export default FlexCol;
