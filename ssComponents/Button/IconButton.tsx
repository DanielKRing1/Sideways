import React, {FC} from 'react';
import {useWindowDimensions} from 'react-native';
import styled, {DefaultTheme, useTheme} from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import MyButton, {MyButtonProps} from '../ReactNative/MyButton';
import {FlexContainerProps} from '../Flex';
import {useFlexContainer} from '../../ssHooks/useFlexContainer';
import {RequiredExceptFor} from '../../global';
import {AvailableIcons} from 'ssDatabase/api/userJson/constants';

export type IconButtonProps = {
  iconName: AvailableIcons | string;

  size?: number;
  color?: string;

  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;

  flexDirection?: 'row' | 'column';
  front?: boolean;
} & MyButtonProps &
  RequiredExceptFor<FlexContainerProps, 'children'>;
const IconButton: FC<IconButtonProps> = props => {
  // HOOKS
  const theme = useTheme();
  const {width} = useWindowDimensions();

  const {
    iconName,
    size = width / theme.iconSizeDivisors.md,
    color = theme.colors.darkRed,
    style = {},
    marginTop = 0,
    marginRight = 0,
    marginBottom = 0,
    marginLeft = 0,
    flexDirection = 'row',
    front = true,
    children,
  } = props;

  const FlexContainer: FC<FlexContainerProps> = useFlexContainer(flexDirection);

  return (
    <StyledMyButton {...props}>
      <FlexContainer {...props}>
        {!front && !!children && children}

        <Icon
          style={{
            // @ts-ignore
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

        {front && !!children && children}
      </FlexContainer>
    </StyledMyButton>
  );
};

export default IconButton;

const StyledMyButton = styled(MyButton)`
  justify-content: center;
  align-items: center;

  padding: 5px;
  marginright: 3px;

  background-color: ${({theme}: {theme: DefaultTheme}) => theme.colors.whiteBg};
  color: ${({theme}: {theme: DefaultTheme}) => theme.colors.darkRed};
`;
