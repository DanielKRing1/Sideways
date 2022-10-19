import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';

import { RootState } from '../../../../../../ssRedux';
import NodeStats from './NodeStats';

type InputNodeStatsProps = {

};
const InputNodeStats: FC<InputNodeStatsProps> = (props) => {

    const { nodeStats, readSSSignature, inputStatsSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.analyticsSlice.identityStatsSlice }));

    const theme: DefaultTheme = useTheme();

    // TODO: Get Node icon info
    const iconName: string = 'heart';

    return (
        <View>
            <NodeStats
                nodeStats={nodeStats}
            />
        </View>
    );
}

export default InputNodeStats;
