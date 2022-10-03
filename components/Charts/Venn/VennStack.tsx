import React, { FC } from 'react';
import { VictoryTheme, VictoryAxis, VictoryChart, VictoryBar, VictoryLabel, VictoryStack } from 'victory-native';
import { CallbackArgs } from 'victory-core';

export type VennStackDataPoint = {
    x: number | Date;
    y: number | Date;
};
export type VennStackProps = {
  colorScale: string[];
  
  data: VennStackDataPoint[][];
  x: string;
  xValues: number[];
  yLabels: any[];
  tickFormat: (t: CallbackArgs) => any;

  domainPadding: { x: number, y: number };
};

const VennStack: FC<VennStackProps> = (props) => {

  const { colorScale, data, x, xValues, yLabels, tickFormat, domainPadding } = props;

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
        tickValues={yLabels}
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
        animate={{
          duration: 500,
          onLoad: { duration: 1000 }
        }}
        colorScale={colorScale}
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
