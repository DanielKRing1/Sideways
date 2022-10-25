import React, {FC, memo} from 'react';
import {ViewStyle} from 'react-native';
import {useTheme, DefaultTheme} from 'styled-components';
import {useFlexContainer} from '../../ssHooks/useFlexContainer';

import IconButton, {IconButtonProps} from '../Button/IconButton';
import {FlexContainerProps} from '../Flex';
import MyText from '../ReactNative/MyText';

export type IconInputProps = {
  iconStyle?: ViewStyle;

  name?: string;
  isSelected?: boolean;
  unselectedColor?: string;
  selectedColor?: string;
} & Omit<IconButtonProps, 'color'>;
const IconInput: FC<IconInputProps> = props => {
  const theme: DefaultTheme = useTheme();

  const {
    iconStyle = {},
    name,
    isSelected = false,
    unselectedColor = theme.colors.whiteFg,
    selectedColor = theme.colors.pastelPurple,
    iconName,
    size,
    onPress,
    flexDirection = 'row',
    front = true,
    children,
  } = props;

  const FlexContainer: FC<FlexContainerProps> = useFlexContainer(flexDirection);

  return (
    <FlexContainer {...props}>
      {!front && !!children && children}

      <IconButton
        style={iconStyle}
        flexDirection="column"
        iconName={iconName}
        onPress={onPress}
        size={size}
        color={isSelected ? selectedColor : unselectedColor}>
        {name !== undefined && <MyText>{name}</MyText>}
      </IconButton>

      {front && !!children && children}
    </FlexContainer>
  );
};

export default memo(IconInput);
