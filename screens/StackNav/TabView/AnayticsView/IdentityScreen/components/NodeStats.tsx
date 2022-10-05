import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';
import { ID_KEY, RankedNode } from '@asianpersonn/realm-graph';

import { RootState } from '../../../../../../redux';
import MyText from '../../../../../../components/ReactNative/MyText';
import IconInput from '../../../../../../components/IconInput/IconInput';
import { FlexCol } from '../../../../../../components/Flex';

type NodeStatsProps = {
    nodeStats: RankedNode | undefined;
};
const NodeStats: FC<NodeStatsProps> = (props) => {
    const { nodeStats } = props;

    const theme: DefaultTheme = useTheme();

    // TODO: Get Node icon info
    const iconName: string = 'heart';

    return (
        <View>
        {
            !!nodeStats ?
            <IconInput
                name={nodeStats.id}
                iconName={iconName}
                isSelected={true}
                selectedColor={theme.colors.pastelPurple}
            >
                <FlexCol>
                {
                    Object.keys(nodeStats).filter((key: string) => key !== ID_KEY).map((key: string) => <MyText>{key}: {nodeStats[key]}</MyText>)
                }
                </FlexCol>
            </IconInput>
            :
            <MyText>Choose an input...</MyText>
        }
        </View>
    );
}

export default NodeStats;
