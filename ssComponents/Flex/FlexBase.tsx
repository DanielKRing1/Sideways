import {ViewProps} from 'react-native';
import styled from 'styled-components/native';

export type FlexContainerProps = Omit<FlexBaseProps, 'flexDirection'>;
type FlexBaseProps = {
  flexDirection: 'row' | 'column' | 'column-reverse' | 'row-reverse';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
} & ViewProps;

const FlexBase = styled.View<FlexBaseProps>`
  display: flex;

  justify-content: ${({justifyContent = 'flex-start'}: FlexBaseProps) =>
    justifyContent};
  flexdirection: ${({flexDirection}: FlexBaseProps) => flexDirection};
  align-items: ${({alignItems = 'stretch'}: FlexBaseProps) => alignItems};
`;

export default FlexBase;
