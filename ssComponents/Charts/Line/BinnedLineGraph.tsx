import React, {FC, useMemo} from 'react';

import LineGraph, {MyLineGraphProps} from './LineGraph';
import DomainScroller, {DomainScrollerProps} from '../Domain/DomainScroller';
import {useTabBarHeight} from 'ssHooks/useTabBarHeight';

type GradientColor = {offset: string; color: string};
export type BinnedLineGraphProps = {
  colorMap: Record<number, string>;
} & Omit<MyLineGraphProps, 'gradientColors'> &
  DomainScrollerProps;

const BinnedLineGraph: FC<BinnedLineGraphProps> = props => {
  const {
    colorMap,
    xDomain,
    setXDomain,
    xValues,
    xTickFormat,
    brushXValues,
    brushTickFormat,
    data,
    x,
    yValues,
    yTickFormat,
    domainPadding,
  } = props;

  // HOOKS

  const {remainingHeight} = useTabBarHeight();

  // GRADIENT COLORS

  const gradientColors: GradientColor[] = useMemo(() => {
    const colorBins: number[] = Object.keys(colorMap)
      .map((val: string) => parseInt(val))
      .sort((a, b) => a - b);
    const min: number = colorBins[0];
    const max: number = colorBins[colorBins.length - 1];
    const domainRange: number = max - min;

    return colorBins.map((bin: number) => ({
      offset: `${((bin - min) / domainRange) * 100}%`,
      color: colorMap[bin],
    }));
  }, [colorMap]);

  return (
    <>
      <LineGraph
        height={(remainingHeight / 4) * 2}
        gradientColors={gradientColors}
        xDomain={xDomain}
        domainPadding={domainPadding}
        data={data}
        xValues={xValues}
        xTickFormat={xTickFormat}
        x={x}
        yValues={yValues}
        yTickFormat={yTickFormat}
      />

      <DomainScroller
        height={remainingHeight / 4}
        xDomain={xDomain}
        setXDomain={setXDomain}
        brushXValues={brushXValues}
        brushTickFormat={brushTickFormat}
        data={data}
        x={x}
      />
    </>
  );
};

export default BinnedLineGraph;
