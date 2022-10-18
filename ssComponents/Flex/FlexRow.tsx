import React, { FC, forwardRef } from 'react';
import { View } from 'react-native';

import FlexBase, { FlexContainerProps } from './FlexBase'

const FlexRow: FC<FlexContainerProps> = forwardRef<View, FlexContainerProps>((props, ref) => {
  const { style, children, justifyContent, alignItems } = props;

  return (
    <FlexBase
      // @ts-ignore
      ref={ref}
      style={style}
      flexDirection='row'
      justifyContent={justifyContent}
      alignItems={alignItems}
    >
      {children}
    </FlexBase>
  )
});

export default FlexRow;
