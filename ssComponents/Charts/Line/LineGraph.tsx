import React, {FC} from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryLabel,
} from 'victory-native';
import {CallbackArgs, ForAxes, DomainTuple, PaddingType} from 'victory-core';
import {Defs, LinearGradient, Stop} from 'react-native-svg';

import {LineGraph} from 'ssDatabase/api/analytics/timeseries/types';

type GradientColor = {offset: string; color: string};
export type MyLineGraphProps = {
  height: number;
  gradientColors: GradientColor[];

  xDomain: ForAxes<DomainTuple>;
  xValues?: number[] | Date[];

  data: LineGraph;
  x: string;
  tickValues: number[];
  tickFormat: (t: CallbackArgs) => string | number;

  domainPadding: ForAxes<PaddingType>;
};

const MyLineGraph: FC<MyLineGraphProps> = props => {
  const {
    height,
    gradientColors,
    xDomain,
    xValues,
    data,
    x,
    tickValues,
    tickFormat,
    domainPadding,
  } = props;

  return (
    <VictoryChart
      height={height}
      domain={xDomain}
      domainPadding={domainPadding}>
      <Defs>
        <LinearGradient id="linearGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          {gradientColors.map(({offset, color}) => (
            <Stop offset={offset} stopColor={color} />
          ))}
        </LinearGradient>
      </Defs>

      <VictoryAxis
        style={{
          grid: {
            pointerEvents: 'painted',
            strokeWidth: 0.5,
          },
        }}
        tickValues={tickValues}
        dependentAxis
      />

      <VictoryAxis
        style={{
          grid: {
            pointerEvents: 'painted',
            strokeWidth: 0.5,
          },
          tickLabels: {},
        }}
        tickValues={xValues}
        tickLabelComponent={
          <VictoryLabel
            text={tickFormat}
            textAnchor={'end'}
            angle={-20}
            dy={20}
          />
        }
      />

      <VictoryLine
        style={{
          data: {
            stroke: 'url(#linearGradient1)',
            strokeWidth: 2,
          },
          parent: {border: '1px solid #ccc'},
        }}
        data={data}
        x={x}
      />
    </VictoryChart>
  );
};

export default MyLineGraph;
