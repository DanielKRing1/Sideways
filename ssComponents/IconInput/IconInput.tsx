import React, { FC } from 'react';
import { useFlexContainer } from '../../ssHooks/useFlexContainer';

import IconButton, { IconButtonProps } from '../Button/IconButton';
import { FlexRowProps } from '../Flex';
import MyText from '../ReactNative/MyText';

export type IconInputProps = {
    name: string;
    isSelected?: boolean;
    unselectedColor?: string;
    selectedColor?: string;
} & IconButtonProps;
const IconInput: FC<IconInputProps> = (props) => {
    const {
        name, isSelected=false, unselectedColor='white', selectedColor='black',
        iconName, size,
        onPress,
        flexDirection='row', front=true,
        children
    } = props;

    const FlexContainer: FC<FlexRowProps> = useFlexContainer(flexDirection);

    return (
        <FlexContainer
            {...props}
        >
            { !front && !!children && children }

            <IconButton
                flexDirection='column'
                iconName={iconName}
                onPress={onPress}
                size={size}
                color={isSelected ? selectedColor : unselectedColor}
                >
                <MyText>{name}</MyText>
            </IconButton>

            { front && !!children && children }
            
        </FlexContainer>
    );
}

export default IconInput;
