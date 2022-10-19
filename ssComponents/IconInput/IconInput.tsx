import React, { FC, memo } from 'react';
import { ViewStyle } from 'react-native';
import { useFlexContainer } from '../../ssHooks/useFlexContainer';

import IconButton, { IconButtonProps } from '../Button/IconButton';
import { FlexContainerProps } from '../Flex';
import MyText from '../ReactNative/MyText';

export type IconInputProps = {
    iconStyle?: ViewStyle;

    name?: string;
    isSelected?: boolean;
    unselectedColor?: string;
    selectedColor?: string;
} & IconButtonProps;
const IconInput: FC<IconInputProps> = (props) => {
    const {
        iconStyle={},
        name, isSelected=false, unselectedColor='white', selectedColor='black',
        iconName, size,
        onPress,
        flexDirection='row', front=true,
        children
    } = props;

    const FlexContainer: FC<FlexContainerProps> = useFlexContainer(flexDirection);

    return (
        <FlexContainer
            {...props}
        >
            { !front && !!children && children }

            <IconButton
                style={iconStyle}
                flexDirection='column'
                iconName={iconName}
                onPress={onPress}
                size={size}
                color={isSelected ? selectedColor : unselectedColor}
            >
                {
                    name !== undefined &&
                    <MyText>{name}</MyText>
                }
            </IconButton>

            { front && !!children && children }
            
        </FlexContainer>
    );
}

export default memo(IconInput);
