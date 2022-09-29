import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { RootState } from '../../../../../../redux';
import MyText from '../../../../../../components/ReactNative/MyText';
import HiLoRankingByOutput from '../../../../../../components/Nodes/HiLoRankingByOutput';

type HighlyRatedTandemNodesProps = {

};
const HighlyRatedTandemNodes: FC<HighlyRatedTandemNodesProps> = (props) => {

    const { nodeIdInput, highlyRatedTandemNodes, readSSSignature, identityStatsSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.identityStatsSlice }));

    return (
        <View>
            <MyText>You often feel... when doing these with {nodeIdInput}</MyText>

            <HiLoRankingByOutput
                hiLoRankingByOutput={highlyRatedTandemNodes}
            />
        </View>
    );
}

export default HighlyRatedTandemNodes;
