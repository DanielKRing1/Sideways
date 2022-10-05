import React, { FC, forwardRef } from 'react';

import FlexBase from './FlexBase'

type FlexColProps = {
  children: React.ReactNode;

  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
};
const FlexCol: FC<FlexColProps> = forwardRef((props, ref) => {
  const { children, justifyContent, alignItems } = props;

  return (
    <FlexBase
      // @ts-ignore
      ref={ref}
      flexDirection='column'
      justifyContent={justifyContent}
      alignItems={alignItems}
    >
      {children}
    </FlexBase>
  )
});

export default FlexCol;
