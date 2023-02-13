import React, {FC} from 'react';
import {
  VictoryChart,
  VictoryAxis,
  VictoryBrushContainer,
  VictoryLabel,
  VictoryLine,
} from 'victory-native';
import {CallbackArgs} from 'victory-core';

import {XDomain} from '../types';
import {LineGraph} from 'ssDatabase/api/analytics/timeseries/types';

export type DomainScrollerProps = {
  height: number;
  xDomain: XDomain;
  setXDomain: (newXDomain: XDomain) => void;
  domainPadding?: {x: number; y: number};

  data: LineGraph;
  brushXValues: number[] | Date[];
  brushTickFormat: (t: CallbackArgs) => string | number;
  x: string;
};
const DomainScroller: FC<DomainScrollerProps> = props => {
  const {
    height,
    xDomain,
    setXDomain,
    domainPadding,
    data,
    brushXValues,
    brushTickFormat,
    x,
  } = props;

  // Prevent updating even when domain has not changed
  const handleBrush = (newDomain: XDomain) => {
    if (newDomain.x[0] !== xDomain.x[0]) setXDomain({x: newDomain.x});
  };

  const fullDomain: XDomain = {
    x: [
      brushXValues[0] as number,
      brushXValues[brushXValues.length - 1] as number,
    ],
  };

  console.log('FULL DOMAIN--------------------');
  console.log(fullDomain);
  console.log(xDomain);

  return (
    <VictoryChart
      height={height}
      domain={fullDomain}
      domainPadding={domainPadding}
      containerComponent={
        <VictoryBrushContainer
          allowResize={false}
          brushDimension="x"
          brushDomain={xDomain}
          onBrushDomainChange={handleBrush}
        />
      }>
      <VictoryLine
        style={{
          data: {
            stroke: 'transparent',
            strokeWidth: 1,
          },
          parent: {border: '1px solid #ccc'},
        }}
        data={data}
        x={x}
      />

      <VictoryAxis
        style={{
          grid: {
            pointerEvents: 'painted',
            strokeWidth: 0.5,
          },
          tickLabels: {
            angle: 20,
          },
        }}
        tickValues={brushXValues}
        tickLabelComponent={
          <VictoryLabel
            text={brushTickFormat}
            textAnchor={'start'}
            angle={20}
            // dy={20}
          />
        }
      />
    </VictoryChart>
  );
};

export default DomainScroller;
