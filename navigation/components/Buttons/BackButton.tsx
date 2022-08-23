import React, { FC } from 'react';
import { View } from 'react-native';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import MyButton from '../../../components/ReactNative/MyButton';
import { MyButtonProps } from '../../../components/ReactNative/MyButton';


type BackButtonProps = {

} & MyButtonProps;
const BackButton: FC<BackButtonProps> = (props) => {
    const theme = useTheme();

    return (
        <StyledMyButton
            {...props}
            style={props.style}
        >
            <Icon name="angle-double-left" size={30} color={theme.colors.darkRed} />
            {/* <Icon.Button
                onPress={onPress}
                name="angle-double-left"
                size={30}
                iconStyle={{marginRight: 3}}
                backgroundColor={theme.colors.whiteBg}
                color={theme.colors.darkRed}
                borderRadius={50}
                borderWidth={2}
                borderColor={theme.colors.grayBorder}
            /> */}
        </StyledMyButton>
    );
}

export default BackButton;

const StyledMyButton = styled(MyButton)`
    justifyContent: center;
    alignItems: center;
    
    padding: 5px;
    marginRight: 3px;

    backgroundColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.whiteBg};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.darkRed};
`;
