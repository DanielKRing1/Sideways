import React, {FC, memo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../../../../ssRedux';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import HiLoRankingByOutputRow from '../../../../../../ssComponents/Nodes/HiLoRankingByOutputRow';

type IdentityNodesProps = {};
const IdentityNodes: FC<IdentityNodesProps> = () => {
  const {identityNodes} = useSelector(
    (state: RootState) => state.analytics.identityStats,
  );

  return (
    <View>
      <MyText>Your Identity Inputs</MyText>

      <HiLoRankingByOutputRow hiLoRankingByOutput={identityNodes} />
    </View>
  );
};

export default memo(IdentityNodes);
