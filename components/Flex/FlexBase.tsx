import React, { FC } from 'react';
import styled from 'styled-components/native';

type FlexBaseProps = {
  flexDirection: 'row' | 'column' |'column-reverse' | 'row-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
};

const FlexBase = styled.View<FlexBaseProps>`
  display: flex;

  justifyContent: ${({ justifyContent='flex-start' }: FlexBaseProps) => justifyContent};
  flexDirection: ${({ flexDirection }: FlexBaseProps) => flexDirection};
  alignItems: ${({ alignItems='stretch' }: FlexBaseProps) => alignItems};
`;

export default FlexBase;
