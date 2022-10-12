import React, { FC } from 'react';
import { VictoryTheme, VictoryAxis, VictoryChart, VictoryBar, VictoryLabel, VictoryStack } from 'victory-native';
import { CallbackArgs } from 'victory-core';
import { ChartBar } from 'ssDatabase/hardware/realm/analytics/timeseriesStatsDriver';

export type VennStackDataPoint = {
    x: number | Date;
    y: number | Date;
};
export type VennStackProps = {
  colorScale: string[];
  
  data: ChartBar[][];
  x?: string;
  xValues?: number[] | Date[];
  xLabels?: any[];
  xLabelFill?: (l: CallbackArgs) => string | number;
  yValues?: any[];
  tickFormat?: (t: CallbackArgs) => any | number;

  domainPadding?: { x: number, y: number };
};

const VennStack: FC<VennStackProps> = (props) => {

  const { colorScale, data, x, xValues, xLabels, xLabelFill=(l: CallbackArgs) => '', yValues, tickFormat, domainPadding } = props;

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={domainPadding}
    >
      <VictoryAxis
        style={{
          grid: {
            pointerEvents: "painted",
            strokeWidth: 0.5
          },
          tickLabels: {
            angle: -20,
          }
        }}
        tickValues={yValues}
        tickLabelComponent={<VictoryLabel text={tickFormat} textAnchor={'end'} angle={-20} dy={20}/>}
        dependentAxis
      />

      <VictoryAxis
        style={{
          grid: {
            pointerEvents: "painted",
            strokeWidth: 0.5
          },
          tickLabels: {
            angle: -20,
          }
        }}
        tickValues={xValues}
        tickLabelComponent={<VictoryLabel text={tickFormat} textAnchor={'end'} angle={-20} dy={20}/>}
      />

      <VictoryStack
        colorScale={colorScale}
        labelComponent={<VictoryLabel angle={-20} textAnchor='start' />}
        labels={xLabels}
        style={{
          labels: {
            fill: (data: CallbackArgs) => xLabelFill(data)
          }
        }}
      >
      {
        data.map((row: {x: number | Date, y: number | Date}[]) => (
          <VictoryBar
            animate={{
              duration: 500,
              onLoad: { duration: 1000 }
            }}
            data={row}
            alignment="start"
          />
        ))
      }
      </VictoryStack>
    </VictoryChart>
  )
}

export default VennStack;
