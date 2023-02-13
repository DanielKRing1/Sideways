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
  domainPadding: ForAxes<PaddingType>;

  data: LineGraph;
  xValues?: number[] | Date[];
  xTickFormat: (t: CallbackArgs) => string | number;
  x: string;
  yValues: number[];
  yTickFormat: (t: CallbackArgs) => string | number;
};

const MyLineGraph: FC<MyLineGraphProps> = props => {
  const {
    height,
    gradientColors,
    xDomain,
    data,
    xValues,
    xTickFormat,
    x,
    yValues,
    yTickFormat,
    domainPadding,
  } = props;

  // console.log('LINEGRAPH DATA------------------------');
  // console.log(data);

  return (
    <VictoryChart
      height={height}
      domain={xDomain}
      domainPadding={domainPadding}>
      <Defs>
        <LinearGradient id="linearGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          {gradientColors.map(({offset, color}, i) => (
            <Stop key={`${color}-${i}`} offset={offset} stopColor={color} />
          ))}
        </LinearGradient>
      </Defs>

      <VictoryLine
        style={{
          data: {
            stroke: 'url(#linearGradient1)',
            strokeWidth: 2,
          },
          parent: {border: '1px solid #ccc'},
        }}
        // data={[
        //   {x: 1, y: 0},
        //   {x: 2, y: 0},
        //   {x: 3, y: 0},
        //   {x: 4, y: 0},
        //   {x: 5, y: 1},
        //   {x: 6, y: 0},
        //   {x: 7, y: 0},
        // ]}
        data={data}
        x={x}
      />

      <VictoryAxis
        style={{
          grid: {
            pointerEvents: 'painted',
            strokeWidth: 0.5,
          },
        }}
        tickValues={yValues}
        tickLabelComponent={
          <VictoryLabel
            text={yTickFormat}
            textAnchor={'end'}
            angle={-20}
            dy={20}
          />
        }
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
            text={xTickFormat}
            textAnchor={'start'}
            angle={20}
            // dy={20}
          />
        }
      />
    </VictoryChart>
  );
};

export default MyLineGraph;
