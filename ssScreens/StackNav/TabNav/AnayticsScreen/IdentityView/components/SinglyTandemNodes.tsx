import React, {FC} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../../../../ssRedux';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import HiLoRankingByOutputRow from '../../../../../../ssComponents/Nodes/HiLoRankingByOutputRow';

type SinglyTandemNodesProps = {};
const SinglyTandemNodes: FC<SinglyTandemNodesProps> = () => {
  const {nodeIdInput, singlyTandemNodes} = useSelector(
    (state: RootState) => state.analytics.identityStats,
  );

  return (
    <View>
      <MyText>You often do these with {nodeIdInput} and feel...</MyText>

      <HiLoRankingByOutputRow hiLoRankingByOutput={singlyTandemNodes} />
    </View>
  );
};

export default SinglyTandemNodes;
