import React, { FC } from 'react';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import MyButton, { MyButtonProps } from '../ReactNative/MyButton';
import { FlexContainerProps } from '../Flex';
import { useFlexContainer } from '../../ssHooks/useFlexContainer';
import { RequiredExceptFor } from '../../global';


export type IconButtonProps = {
    iconName: string;

    size?: number;
    color?: string;

    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;

    flexDirection?: 'row' | 'column';
    front?: boolean;

} & MyButtonProps & RequiredExceptFor<FlexContainerProps, 'children'>;
const IconButton: FC<IconButtonProps> = (props) => {
    const theme = useTheme();

    const {
        iconName,
        size=theme.iconSizes.md,
        color=theme.colors.darkRed,
        style={},
        marginTop=0, marginRight=0, marginBottom=0, marginLeft=0,
        flexDirection='row', front=true,
        children
    } = props;

    const FlexContainer: FC<FlexContainerProps> = useFlexContainer(flexDirection);

    return (
        <StyledMyButton
            {...props}
        >
            <FlexContainer
                {...props}
            >
                
                { !front && !!children && children }

                <Icon
                    style={{
                        ...style,
                        marginTop,
                        marginRight,
                        marginBottom,
                        marginLeft,
                    }}
                    name={iconName}
                    size={size}
                    color={color}
                />

                { front && !!children && children }

            </FlexContainer>
        </StyledMyButton>
    );
}

export default IconButton;

const StyledMyButton = styled(MyButton)`
    justifyContent: center;
    alignItems: center;
    
    padding: 5px;
    marginRight: 3px;

    backgroundColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.whiteBg};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.darkRed};
`;
