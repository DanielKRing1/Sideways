import React, {FC} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../../../../ssRedux';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import HiLoRankingDisplay from '../../../../../../ssComponents/Nodes/HiLoRanking';

type CollectivelyTandemNodesProps = {};
const CollectivelyTandemNodes: FC<CollectivelyTandemNodesProps> = () => {
  const {
    nodeIdInput,
    collectivelyTandemNodes,
    readSSSignature,
    identityStatsSignature,
  } = useSelector((state: RootState) => ({
    ...state.readSidewaysSlice.toplevelReadReducer,
    ...state.analyticsSlice.identityStatsSlice,
  }));

  return (
    <View>
      <MyText>You often do these with {nodeIdInput}</MyText>

      <HiLoRankingDisplay hiLoRanking={collectivelyTandemNodes} />
    </View>
  );
};

export default CollectivelyTandemNodes;
