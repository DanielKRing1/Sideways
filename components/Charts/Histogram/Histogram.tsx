import React, { FC } from 'react';
import { VictoryAxis, VictoryChart, VictoryBar, VictoryLabel } from 'victory-native';
import { CallbackArgs } from 'victory-core';
import { Defs, LinearGradient, Stop } from  'react-native-svg';
import { DataPoint } from '../types';

type GradientColor = { offset: string, color: string; };
export type MyHistogramProps = {
  horizontal?: boolean;
  gradientColors: GradientColor[];
  
  data: DataPoint[];
  x: string;
  tickFormat: (t: CallbackArgs) => string | number

  domainPadding: { x: number, y: number };
};

const MyHistogram: FC<MyHistogramProps> = (props) => {

  const { horizontal, gradientColors, data, x, tickFormat, domainPadding } = props;

  return (
    <>
      <VictoryChart
        domainPadding={domainPadding}
      >

        <Defs>
          <LinearGradient id="linearGradient1" x1="0%" y1="0%" x2={horizontal?'100%':"0%"} y2={horizontal?'0%':"100%"}>
            {
              gradientColors.map(({ offset, color }) => <Stop offset={offset} stopColor={color}/>)
            }
          </LinearGradient>
        </Defs>

          <VictoryAxis
            style={{
              grid: {
                pointerEvents: "painted",
                strokeWidth: 0.5
              }
            }}
            dependentAxis
          />

          <VictoryAxis
            domain={[1, 10]}
            style={{
              grid: {
                pointerEvents: "painted",
                strokeWidth: 0.5
              },
              tickLabels: {
                angle: -20,
              }
            }}
            tickLabelComponent={<VictoryLabel text={tickFormat} textAnchor={'end'} angle={-20} dy={20}/>}
          />

        <VictoryBar
          horizontal={horizontal}
          animate={{
            duration: 500,
            onLoad: { duration: 1000 }
          }}
          data={data}
          x={x}

          style={{
              data: {
                stroke: "transparent",
                fill: "url(#linearGradient1)",
                strokeWidth: 1,
              },
              labels: {
                fill: "red"
              }
          }}
        />
      </VictoryChart>

    </>
  )
}

export default MyHistogram;
