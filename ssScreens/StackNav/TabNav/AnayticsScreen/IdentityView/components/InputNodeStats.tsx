import React, {FC, memo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../../../../ssRedux';
import NodeStats from './NodeStats';

type InputNodeStatsProps = {};
const InputNodeStats: FC<InputNodeStatsProps> = props => {
  const {nodeStats} = useSelector(
    (state: RootState) => state.analytics.identityStats,
  );

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
      }}>
      {/* @ts-ignore */}
      <NodeStats nodeStats={nodeStats} />
    </View>
  );
};

export default memo(InputNodeStats);
