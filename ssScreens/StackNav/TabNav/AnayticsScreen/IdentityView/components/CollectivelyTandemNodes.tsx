import React, {FC, memo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../../../../ssRedux';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import HiLoRankingDisplay from '../../../../../../ssComponents/Nodes/HiLoRanking';

type CollectivelyTandemNodesProps = {};
const CollectivelyTandemNodes: FC<CollectivelyTandemNodesProps> = () => {
  const {readSSSignature} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {nodeIdInput, collectivelyTandemNodes, identityStatsSignature} =
    useSelector((state: RootState) => state.analyticsSlice.identityStatsSlice);

  return (
    <View>
      <MyText>You often do these with {nodeIdInput}</MyText>

      <HiLoRankingDisplay hiLoRanking={collectivelyTandemNodes} />
    </View>
  );
};

export default memo(CollectivelyTandemNodes);
