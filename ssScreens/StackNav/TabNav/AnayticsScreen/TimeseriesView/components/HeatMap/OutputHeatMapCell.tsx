import React, {FC, useEffect, useMemo, useState} from 'react';
import {
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
  useWindowDimensions,
} from 'react-native';
import styled from 'styled-components/native';

import {HeatMapCellProps} from 'ssComponents/Charts/HeatMap/HeatMap';
import {Dimensions} from 'ssComponents/Charts/types';

const OutputHeatMapCell: FC<HeatMapCellProps> = props => {
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
  const [animVal] = useState(new Animated.Value(0));
  const [color, setColor] = useState({
    start: '#fff',
    end: '#fff',
  });

  // Animation colors
  const GREY: string = 'grey';
  useEffect(() => {
    setColor({
      start: color.end !== undefined ? color.end : GREY,
      // Just use first color for now
      end: data.value[0] !== undefined ? data.value[0] : GREY,
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
  console.log('OUTPUTHEATMAPCELL');
  console.log(animVal);
  console.log(color);
  const myColor = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [color.start, color.end],
  });

  return (
    <ColoredCell
      // @ts-ignore
      style={{backgroundColor: myColor}}
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
  border-radius: 10px;
  height: ${({dim}: ColoredCellProps) => `${dim.y}px`};
  width: ${({dim}: ColoredCellProps) => `${dim.x}px`};
  margin: ${({margin}: ColoredCellProps) => margin};
`;

export default OutputHeatMapCell;
