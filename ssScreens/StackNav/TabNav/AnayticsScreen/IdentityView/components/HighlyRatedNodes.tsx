import React, {FC} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../../../../ssRedux';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import HiLoRankingByOutput from '../../../../../../ssComponents/Nodes/HiLoRankingByOutput';

type HighlyRatedTandemNodesProps = {};
const HighlyRatedTandemNodes: FC<HighlyRatedTandemNodesProps> = () => {
  const {
    nodeIdInput,
    highlyRatedTandemNodes,
    readSSSignature,
    identityStatsSignature,
  } = useSelector((state: RootState) => ({
    ...state.readSidewaysSlice.toplevelReadReducer,
    ...state.analyticsSlice.identityStatsSlice,
  }));

  return (
    <View>
      <MyText>You often feel... when doing these with {nodeIdInput}</MyText>

      <HiLoRankingByOutput hiLoRankingByOutput={highlyRatedTandemNodes} />
    </View>
  );
};

export default HighlyRatedTandemNodes;