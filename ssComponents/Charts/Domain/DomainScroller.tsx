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
import {LineGraph} from 'ssDatabase/hardware/realm/analytics/timeseriesStatsDriver';

export type DomainScrollerProps = {
  xDomain: XDomain;
  setXDomain: (newXDomain: XDomain) => void;

  data: LineGraph;
  brushXValues?: number[] | Date[];
  x: string;
  tickFormat: (t: CallbackArgs) => string | number;

  domainPadding: {x: number; y: number};
};
const DomainScroller: FC<DomainScrollerProps> = props => {
  const {
    xDomain,
    setXDomain,
    data,
    brushXValues,
    x,
    tickFormat,
    domainPadding,
  } = props;

  // Prevent updating even when domain has not changed
  const handleBrush = (newDomain: XDomain) => {
    if (newDomain.x[0] !== xDomain.x[0]) setXDomain({x: newDomain.x});
  };

  const fullDomain: XDomain = {
    // TODO Fix typing?
    // @ts-ignore
    x: [
      data[0].x,
      // @ts-ignore
      data[data.length - 1].x - Math.ceil(xDomain.x[1] - xDomain.x[0]) + 2,
    ],
  };

  return (
    <VictoryChart
      height={150}
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
      <VictoryAxis
        style={{
          grid: {
            pointerEvents: 'painted',
            strokeWidth: 0.5,
          },
          tickLabels: {
            angle: -20,
          },
        }}
        tickValues={brushXValues}
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
            stroke: 'transparent',
            strokeWidth: 1,
          },
          parent: {border: '1px solid #ccc'},
        }}
        data={[data[0], data[data.length - 1]]}
        x={x}
      />
    </VictoryChart>
  );
};

export default DomainScroller;
