import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { RootState } from '../../../../../../redux';
import MyText from '../../../../../../components/ReactNative/MyText';
import HiLoRankingByOutput from '../../../../../../components/Nodes/HiLoRankingByOutput';

type IdentityNodesProps = {

};
const IdentityNodes: FC<IdentityNodesProps> = (props) => {

    const { identityNodes, readSSSignature, identityStatsSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.statsSlice }));

    return (
        <View>
            <MyText>Your Identity Inputs</MyText>

            <HiLoRankingByOutput
                hiLoRankingByOutput={identityNodes}
            />
        </View>
    );
}

export default IdentityNodes;
