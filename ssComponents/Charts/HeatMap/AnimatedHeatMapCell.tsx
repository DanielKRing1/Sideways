import React, {FC, useEffect, useMemo, useState} from 'react';
import {
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
  useWindowDimensions,
} from 'react-native';
import styled from 'styled-components/native';

import {HeatMapCellProps} from './HeatMap';
import {Dimensions} from '../types';

const AnimatedHeatMapCell: FC<HeatMapCellProps> = props => {
  const {data, gridDim} = props;

  const {width} = useWindowDimensions();

  // MARGINS
  const margin = useMemo(() => {
    const lastRow: number = Math.floor(gridDim.y / gridDim.x);
    const bMargin: string =
      Math.floor(data.index / gridDim.x) < lastRow ? `${width / 100}px` : `0px`;
    const rMargin: string =
      (data.index + 1) % gridDim.x !== 0 ? `${width / 100}px` : `0px`;

    return `0px ${rMargin} ${bMargin} 0px`;
  }, [data.index]);

  // ANIMATION
  // Animation value
  const [animVal, setAnimVal] = useState(new Animated.Value(0));
  const [color, setColor] = useState({
    start: '#fff',
    end: '#fff',
  });

  // Animation colors
  useEffect(() => {
    setColor({
      start: color.end,
      end: data.value,
    });
  }, [data.value]);

  // Animation trigger
  useEffect(() => {
    // 1. Reset value
    animVal.setValue(0);
    // 2. Animate
    Animated.timing(animVal, {
      duration: 1000,
      delay: 200,
      toValue: 1,
      useNativeDriver: false,
    }).start();
  }, [color]);

  console.log({x: `${width / 20}`, y: `${width / 20}`});

  // 3. Get color interpolation
  const myColor = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [color.start, color.end],
  });

  return (
    <ColoredCell
      // @ts-ignore
      style={{backgroundColor: myColor}}
      data={data}
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
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const ColoredCell = styled(AnimatedTouchableOpacity)<ColoredCellProps>`
  border-radius: 10%;
  height: ${({dim}: ColoredCellProps) => `${dim.y}px`};
  width: ${({dim}: ColoredCellProps) => `${dim.x}px`};
  margin: ${({margin}: ColoredCellProps) => margin};
`;

export default AnimatedHeatMapCell;
