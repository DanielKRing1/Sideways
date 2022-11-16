import React, {FC} from 'react';
import {TouchableOpacity, TouchableOpacityProps, ViewStyle} from 'react-native';
import styled from 'styled-components';

type MyTouchableOpacityProps = {
  children: React.ReactNode;
  style?: ViewStyle;
} & TouchableOpacityProps;
const MyTouchableOpacity: FC<MyTouchableOpacityProps> = props => {
  const {children, style = {}} = props;

  return (
    // @ts-ignore
    <StyledTouchableOpacity {...props} style={{...style}}>
      {children}
    </StyledTouchableOpacity>
  );
};

const StyledTouchableOpacity = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
`;

export default MyTouchableOpacity;
