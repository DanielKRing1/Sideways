import React, { FC, forwardRef } from 'react';
import { ViewStyle } from 'react-native';
import { View } from 'react-native';

import FlexBase from './FlexBase'

export type FlexRowProps = {
  style?: ViewStyle;
  children: React.ReactNode;

  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
};
const FlexRow: FC<FlexRowProps> = forwardRef<View, FlexRowProps>((props, ref) => {
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
