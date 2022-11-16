import React, {FC} from 'react';
import styled from 'styled-components/native';
import MyButton, {MyButtonProps} from '../ReactNative/MyButton';

type CircleButtonProps = {} & MyButtonProps;
const CircleButton: FC<CircleButtonProps> = props => {
  return <StyledMyButton {...props} style={props.style} />;
};

export default CircleButton;

const StyledMyButton = styled(MyButton)`
  border-radius: 50px;
  border-width: 2px;

  justify-content: center;
  align-items: center;
`;
