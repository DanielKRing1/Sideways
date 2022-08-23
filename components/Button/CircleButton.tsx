import React, { FC } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import MyButton, { MyButtonProps } from '../ReactNative/MyButton';

type CircleButtonProps = {

} & MyButtonProps;
const CircleButton: FC<CircleButtonProps> = (props) => {


    return (
        <StyledMyButton
            {...props}
            style={props.style}
        />
    );
}

export default CircleButton;

const StyledMyButton = styled(MyButton)`
    borderRadius: 50px;
    borderWidth: 2px;
    
    justifyContent: center;
    alignItems: center;
`;
