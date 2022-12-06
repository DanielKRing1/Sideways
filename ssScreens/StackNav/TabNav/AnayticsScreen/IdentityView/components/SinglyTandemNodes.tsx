import React, {FC} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../../../../ssRedux';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import HiLoRankingByOutput from '../../../../../../ssComponents/Nodes/HiLoRankingByOutput';

type SinglyTandemNodesProps = {};
const SinglyTandemNodes: FC<SinglyTandemNodesProps> = () => {
  const {readSSSignature} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );

  const {nodeIdInput, singlyTandemNodes, identityStatsSignature} = useSelector(
    (state: RootState) => state.analyticsSlice.identityStatsSlice,
  );

  return (
    <View>
      <MyText>You often do these with {nodeIdInput} and feel...</MyText>

      <HiLoRankingByOutput hiLoRankingByOutput={singlyTandemNodes} />
    </View>
  );
};

export default SinglyTandemNodes;
