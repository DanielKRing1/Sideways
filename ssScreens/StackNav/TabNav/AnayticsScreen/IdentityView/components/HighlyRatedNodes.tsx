import React, {FC, memo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../../../../ssRedux';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import HiLoRankingByOutputRow from '../../../../../../ssComponents/Nodes/HiLoRankingByOutputRow';

type HighlyRatedTandemNodesProps = {};
const HighlyRatedTandemNodes: FC<HighlyRatedTandemNodesProps> = () => {
  const {readSSSignature} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {nodeIdInput, highlyRatedTandemNodes, identityStatsSignature} =
    useSelector((state: RootState) => state.analyticsSlice.identityStatsSlice);

  return (
    <View>
      <MyText>You often feel... when doing these with {nodeIdInput}</MyText>

      <HiLoRankingByOutputRow hiLoRankingByOutput={highlyRatedTandemNodes} />
    </View>
  );
};

export default memo(HighlyRatedTandemNodes);
