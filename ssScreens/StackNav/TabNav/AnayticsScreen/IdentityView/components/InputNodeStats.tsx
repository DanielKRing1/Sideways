import React, {FC, memo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../../../../ssRedux';
import NodeStats from './NodeStats';

type InputNodeStatsProps = {};
const InputNodeStats: FC<InputNodeStatsProps> = props => {
  const {readSSSignature} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {nodeStats, inputStatsSignature} = useSelector(
    (state: RootState) => state.analyticsSlice.identityStatsSlice,
  );

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
      }}>
      <NodeStats nodeStats={nodeStats} />
    </View>
  );
};

export default memo(InputNodeStats);
