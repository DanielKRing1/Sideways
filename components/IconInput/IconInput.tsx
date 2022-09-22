import React, { FC } from 'react';
import { View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import IconButton, { IconButtonProps } from '../Button/IconButton';
import MyText from '../ReactNative/MyText';

type IconInputProps = {
    name: string;
    isSelected: boolean;
    unselectedColor: string;
    selectedColor: string;
} & IconButtonProps;
const IconInput: FC<IconInputProps> = (props) => {
    const theme = useTheme();
    const { name, iconName, onPress, isSelected, size, unselectedColor, selectedColor } = props;

    return (
        <IconButton
            flexDirection='column'
            iconName={iconName}
            onPress={onPress}
            size={size}
            color={isSelected ? selectedColor : unselectedColor}
        >
            <MyText>{name}</MyText>
        </IconButton>
    );
}

export default IconInput;
