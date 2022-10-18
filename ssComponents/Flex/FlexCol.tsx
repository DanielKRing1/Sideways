import React, { FC, forwardRef } from 'react';
import { ViewStyle, View } from 'react-native';

import FlexBase from './FlexBase'

type FlexColProps = {
  style?: ViewStyle;
  children: React.ReactNode;

  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
};
const FlexCol: FC<FlexColProps> = forwardRef<View, FlexColProps>((props, ref) => {
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
