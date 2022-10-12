import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import { CallbackArgs, ForAxes, DomainTuple } from 'victory-core';

import dbDriver from 'ssDatabase/api/core/dbDriver';
import MyText from 'ssComponents/ReactNative/MyText';
import BinnedLineGraph from 'ssComponents/Charts/Line/BinnedLineGraph';
import { RootState, AppDispatch } from 'ssRedux/index';
import { getStringMapSubset, ID_TYPES } from 'ssDatabase/hardware/realm/user/utils';
import { StringMap } from 'ssDatabase/api/types';

type OutputLineGraphProps = {

};
const OutputLineGraph: FC<OutputLineGraphProps> = (props) => {

    const [ domain, setDomain ] = React.useState<ForAxes<DomainTuple>>({ x: [0, 7] });


    const { activeSliceName, lineGraph } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.timeseriesStatsSlice }));
    const dispatch: AppDispatch = useDispatch();

// colorMap={{
//     0: 'green',
//     1: '#FFA99F',
//     2: 'yellow',
//   }}
    const fullColorMap: StringMap = {};
    const outputColorMap: StringMap = useMemo(() => getStringMapSubset<string>(dbDriver.getSlicePropertyNames(activeSliceName), fullColorMap, ID_TYPES.OUTPUT, (i: number) => i, (value: string) => value), [activeSliceName, fullColorMap]);

    return (
        <View>

            <MyText>Output Line Graph</MyText>
            
            <BinnedLineGraph
            // TODO Fill in color map
                colorMap={outputColorMap}
                xDomain={domain}
                setXDomain={setDomain}
                // @ts-ignore
                tickValues={Object.keys(outputColorMap)}
                // xValues={lineGraph.map((day: DailyOutput) => day.x)}
                // brushXValues={lineGraph.map((day: DailyOutput) => day.x)}
                data={lineGraph}
                tickFormat={(t: CallbackArgs) => t.index !== undefined ? t.ticks[t.index] : ''}
                // @ts-ignore
                domainPadding={{ x: 20 }}
            />

        </View>
    );
}

export default OutputLineGraph;
