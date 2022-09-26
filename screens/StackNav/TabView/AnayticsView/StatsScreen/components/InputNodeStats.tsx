import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';
import { ID_KEY } from '@asianpersonn/realm-graph';

import { RootState } from '../../../../../../redux';
import MyText from '../../../../../../components/ReactNative/MyText';
import IconInput from '../../../../../../components/IconInput/IconInput';
import { FlexCol } from '../../../../../../components/Flex';
import NodeStats from './NodeStats';

type InputNodeStatsProps = {

};
const InputNodeStats: FC<InputNodeStatsProps> = (props) => {

    const { nodeStats, readSSSignature, inputStatsSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.statsSlice }));

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
