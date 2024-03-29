import React, {forwardRef} from 'react';
import {View} from 'react-native';

import FlexBase, {FlexContainerProps} from './FlexBase';

const FlexRow = forwardRef<View, FlexContainerProps>((props, ref) => {
  const {children} = props;

  return (
    <FlexBase ref={ref} flexDirection="row" {...props}>
      {children}
    </FlexBase>
  );
});

export default FlexRow;
