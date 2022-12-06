import React, {FC, memo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../../../../ssRedux';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import HiLoRankingByOutput from '../../../../../../ssComponents/Nodes/HiLoRankingByOutput';

type IdentityNodesProps = {};
const IdentityNodes: FC<IdentityNodesProps> = () => {
  const {identityNodes} = useSelector(
    (state: RootState) => state.analyticsSlice.identityStatsSlice,
  );

  return (
    <View>
      <MyText>Your Identity Inputs</MyText>

      <HiLoRankingByOutput hiLoRankingByOutput={identityNodes} />
    </View>
  );
};

export default memo(IdentityNodes);
