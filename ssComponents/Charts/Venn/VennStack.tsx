import React, {FC} from 'react';
import {
  VictoryTheme,
  VictoryAxis,
  VictoryChart,
  VictoryBar,
  VictoryLabel,
  VictoryStack,
} from 'victory-native';
import {CallbackArgs, DomainPropType} from 'victory-core';
import {ChartBar} from 'ssDatabase/api/analytics/timeseries/types';

export type VennStackDataPoint = {
  x: number | Date;
  y: number | Date;
};
export type VennStackProps = {
  colorScale: string[];

  data: ChartBar[][];
  domain: DomainPropType;
  domainPadding?: {x: number; y: number};
  barWidth?: number;

  x?: string;
  xdx?: (t: CallbackArgs) => any | number;
  xdy?: (t: CallbackArgs) => any | number;
  xValues?: number[] | Date[];
  xLabels?: any[];
  xLabelFill?: (l: CallbackArgs) => string | number;
  xTickFormat?: (t: CallbackArgs) => any | number;

  ydx?: (t: CallbackArgs) => any | number;
  ydy?: (t: CallbackArgs) => any | number;
  yValues?: any[];
  yTickFormat?: (t: CallbackArgs) => any | number;
};

const VennStack: FC<VennStackProps> = props => {
  const {
    colorScale,
    data,
    domain,
    domainPadding,
    barWidth = 0,

    xdx = 0,
    xdy = 0,
    xValues,
    xLabels,
    xLabelFill = (l: CallbackArgs) => '',

    ydx = 0,
    ydy = 0,
    yValues = [],
    xTickFormat,
    yTickFormat,
  } = props;

  console.log('DATA------------------');
  console.log(data);

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domain={domain}
      domainPadding={domainPadding}>
      <VictoryStack
        domain={domain}
        colorScale={colorScale}
        labelComponent={<VictoryLabel angle={-20} textAnchor="start" />}
        labels={xLabels}
        style={{
          labels: {
            fill: (data: CallbackArgs) => xLabelFill(data),
          },
        }}>
        {data.map(
          (
            row: {x: number | string | Date; y: number | string | Date}[],
            i: number,
          ) => {
            console.log('row--------------------');
            console.log(row);
            return (
              row.length > 0 && (
                <VictoryBar
                  key={yValues[i]}
                  barWidth={barWidth}
                  animate={{
                    duration: 500,
                    onLoad: {duration: 1000},
                  }}
                  data={row}
                  // Replace this line with 'alignment' prop
                  // dataComponent={<Bar transform={`translate(${barWidth / 2})`} />}
                  alignment="start"
                />
              )
            );
          },
        )}
      </VictoryStack>

      <VictoryAxis
        domain={domain}
        style={{
          grid: {
            pointerEvents: 'painted',
            strokeWidth: 0.5,
            stroke: 'grey',
            opacity: 0.5,
          },
          tickLabels: {
            angle: -20,
          },
        }}
        tickValues={yValues}
        tickLabelComponent={
          <VictoryLabel
            text={yTickFormat}
            textAnchor={'end'}
            angle={-20}
            dx={ydx}
            dy={ydy}
          />
        }
        dependentAxis
      />

      <VictoryAxis
        domain={domain}
        style={{
          grid: {
            pointerEvents: 'painted',
            strokeWidth: 0,
            stroke: 'grey',
            opacity: 0.5,
          },
          tickLabels: {
            angle: -20,
          },
        }}
        tickValues={xValues}
        tickLabelComponent={
          <VictoryLabel
            text={xTickFormat}
            textAnchor={'end'}
            angle={-20}
            dx={xdx}
            dy={xdy}
          />
        }
      />
    </VictoryChart>
  );
};

export default VennStack;
