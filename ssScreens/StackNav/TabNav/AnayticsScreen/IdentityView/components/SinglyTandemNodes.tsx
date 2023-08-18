import React, {FC} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../../../../ssRedux';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import HiLoRankingByOutputRow from '../../../../../../ssComponents/Nodes/HiLoRankingByOutputRow';

type SinglyTandemNodesProps = {};
const SinglyTandemNodes: FC<SinglyTandemNodesProps> = () => {
  const {readSSSignature} = useSelector(
    (state: RootState) => state.appState.activeJournal,
  );

  const {nodeIdInput, singlyTandemNodes, identityStatsSignature} = useSelector(
    (state: RootState) => state.analyticsSlice.identityStatsSlice,
  );

  return (
    <View>
      <MyText>You often do these with {nodeIdInput} and feel...</MyText>

      <HiLoRankingByOutputRow hiLoRankingByOutput={singlyTandemNodes} />
    </View>
  );
};

export default SinglyTandemNodes;
