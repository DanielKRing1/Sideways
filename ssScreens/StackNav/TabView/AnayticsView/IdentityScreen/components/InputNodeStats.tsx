import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';
import { ID_KEY } from '@asianpersonn/realm-graph';

import { RootState } from '../../../../../../ssRedux';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import IconInput from '../../../../../../ssComponents/IconInput/IconInput';
import { FlexCol } from '../../../../../../ssComponents/Flex';
import NodeStats from './NodeStats';

type InputNodeStatsProps = {

};
const InputNodeStats: FC<InputNodeStatsProps> = (props) => {

    const { nodeStats, readSSSignature, inputStatsSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.identityStatsSlice }));

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
