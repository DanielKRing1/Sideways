import React, {FC} from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryBar,
  VictoryLabel,
} from 'victory-native';
import {CallbackArgs, DomainPropType} from 'victory-core';
import {Defs, LinearGradient, Stop} from 'react-native-svg';
import {ChartBar} from 'ssDatabase/api/analytics/timeseries/types';

export type GradientColor = {offset: string; color: string};
export type MyHistogramProps = {
  horizontal?: boolean;
  gradientColors: GradientColor[];

  data: ChartBar[];
  domain: DomainPropType;
  domainPadding?: {x: number; y: number};

  xValues?: (number | string)[];
  xTickFormat?: (t: CallbackArgs) => string | number;
  yValues?: (number | string)[];
  yTickFormat?: (t: CallbackArgs) => string | number;
  x: string;
};

const MyHistogram: FC<MyHistogramProps> = props => {
  const {
    horizontal,
    gradientColors,
    data,
    domainPadding,
    domain,
    xValues,
    xTickFormat,
    yValues,
    yTickFormat,
    x,
  } = props;

  return (
    <>
      <VictoryChart domain={domain} domainPadding={domainPadding}>
        <Defs>
          <LinearGradient
            id="linearGradient1"
            x1="0%"
            y1="0%"
            x2={horizontal ? '100%' : '0%'}
            y2={horizontal ? '0%' : '100%'}>
            {gradientColors.map(({offset, color}) => (
              <Stop key={color} offset={offset} stopColor={color} />
            ))}
          </LinearGradient>
        </Defs>

        {/* <VictoryHistogram
          horizontal={true}
          data={data.map(({y}) => ({x: y}))}
          binSpacing={5}
          labels={({datum}) => `${datum.y}`}
        /> */}

        <VictoryBar
          domain={domain}
          horizontal={horizontal}
          animate={{
            duration: 500,
            onLoad: {duration: 1000},
          }}
          data={data}
          x={x}
          style={{
            data: {
              stroke: 'transparent',
              fill: 'url(#linearGradient1)',
              strokeWidth: 1,
            },
            labels: {
              fill: 'red',
            },
          }}
          alignment="end"
        />

        <VictoryAxis
          domain={domain}
          style={{
            grid: {
              pointerEvents: 'painted',
              strokeWidth: 0.5,
            },
            tickLabels: {
              angle: -20,
            },
          }}
          tickValues={yValues}
          tickLabelComponent={
            <VictoryLabel
              text={yTickFormat}
              textAnchor={'start'}
              angle={-20}
              dy={10}
            />
          }
          dependentAxis
        />

        <VictoryAxis
          domain={domain}
          style={{
            grid: {
              pointerEvents: 'painted',
              strokeWidth: 0.5,
            },
            tickLabels: {
              angle: -20,
            },
          }}
          tickValues={xValues}
          tickLabelComponent={
            <VictoryLabel
              text={xTickFormat}
              verticalAnchor={'start'}
              textAnchor={'end'}
              dx={-10}
            />
          }
        />
      </VictoryChart>
    </>
  );
};

export default MyHistogram;
