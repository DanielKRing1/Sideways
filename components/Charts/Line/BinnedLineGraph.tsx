import React, { FC, useMemo } from 'react';
import { CallbackArgs, ForAxes, DomainTuple } from 'victory-core';

import LineGraph, { MyLineGraphProps } from './LineGraph';
import DomainScroller, { DomainScrollerProps } from '../Domain/DomainScroller';

type GradientColor = { offset: string, color: string; };
export type BinnedLineGraphProps = {
  colorMap: Record<number, string>;
} & Omit<MyLineGraphProps, 'gradientColors'> & DomainScrollerProps;

const BinnedLineGraph: FC<BinnedLineGraphProps> = (props) => {

  const { colorMap, xDomain, setXDomain, xValues, brushXValues, data, x, tickValues, tickFormat, domainPadding } = props;

  const gradientColors: GradientColor[] = useMemo(() => {
    const colorBins: number[] = Object.keys(colorMap).map((val: string) => parseInt(val)).sort((a,b)=>a-b);
    const min: number = colorBins[0];
    const max: number = colorBins[colorBins.length-1];
    const domainRange: number = max-min;

    return colorBins.map((bin: number) => ({ offset: `${(bin-min)/domainRange*100}%`, color: colorMap[bin] }));
  }, [colorMap]);

  return (
    <>
      <LineGraph
        gradientColors={gradientColors}
        xDomain={xDomain}
        xValues={xValues}
        data={data}
        x={x}
        tickValues={tickValues}
        tickFormat={tickFormat}
        domainPadding={domainPadding}
      />

      <DomainScroller
        xDomain={xDomain}
        setXDomain={setXDomain}
        brushXValues={brushXValues}
        data={data}
        x={x}
        tickFormat={tickFormat}
        domainPadding={domainPadding}
      />
    </>
  )
}

export default BinnedLineGraph;