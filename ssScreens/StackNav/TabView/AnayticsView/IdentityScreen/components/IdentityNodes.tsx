import React, { FC, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../../../../../../ssRedux';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import HiLoRankingByOutput from '../../../../../../ssComponents/Nodes/HiLoRankingByOutput';
import { startGetIdentityNodes } from 'redux/identityStatsSlice';

type IdentityNodesProps = {

};
const IdentityNodes: FC<IdentityNodesProps> = (props) => {

    const { identityNodes, readSSSignature, identityStatsSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.identityStatsSlice }));
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(startGetIdentityNodes());
    }, []);

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
