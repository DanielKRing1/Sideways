import React, {FC, useMemo} from 'react';
import {TouchableOpacityProps, useWindowDimensions} from 'react-native';
import styled from 'styled-components/native';

import {HeatMapCellProps} from './HeatMap';
import {Dimensions} from '../types';

const HeatMapCell: FC<HeatMapCellProps> = props => {
  const {data, gridDim} = props;

  const {width} = useWindowDimensions();
  const margin = useMemo(() => {
    const lastRow: number = Math.floor(gridDim.y / gridDim.x);
    const bMargin: string =
      Math.floor(data.index / gridDim.x) < lastRow ? `${width / 100}` : `0px`;
    const rMargin: string =
      (data.index + 1) % gridDim.x !== 0 ? `${width / 100}` : `0px`;

    return `0px ${rMargin} ${bMargin} 0px`;
  }, [data.index]);

  return (
    <ColoredCell
      style={{backgroundColor: data.value}}
      onPress={() => data.onPress(data.index)}
      dim={{x: width / 10, y: width / 10}}
      margin={margin}
    />
  );
};

type ColoredCellProps = {
  dim: Dimensions;
  margin: string;
} & TouchableOpacityProps;
const ColoredCell = styled.TouchableOpacity<ColoredCellProps>`
  borderradius: 10%;
  height: ${({dim}: ColoredCellProps) => `${dim.y}px`};
  width: ${({dim}: ColoredCellProps) => `${dim.x}px`};
  margin: ${({margin}: ColoredCellProps) => margin};
`;

export default HeatMapCell;
