import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { RootState } from '../../../../../../redux';
import MyText from '../../../../../../components/ReactNative/MyText';
import HiLoRankingDisplay from '../../../../../../components/Nodes/HiLoRanking';

type CollectivelyTandemNodesProps = {

};
const CollectivelyTandemNodes: FC<CollectivelyTandemNodesProps> = (props) => {

    const { nodeIdInput, collectivelyTandemNodes, readSSSignature, identityStatsSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.statsSlice }));

    return (
        <View>
            <MyText>You often do these with {nodeIdInput}</MyText>

            <HiLoRankingDisplay
                hiLoRanking={collectivelyTandemNodes}
            />
        </View>
    );
}

export default CollectivelyTandemNodes;
