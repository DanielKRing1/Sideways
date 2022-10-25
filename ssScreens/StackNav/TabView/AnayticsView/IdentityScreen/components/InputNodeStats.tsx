import React, {FC} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../../../../ssRedux';
import NodeStats from './NodeStats';

type InputNodeStatsProps = {};
const InputNodeStats: FC<InputNodeStatsProps> = props => {
  const {nodeStats, readSSSignature, inputStatsSignature} = useSelector(
    (state: RootState) => ({
      ...state.readSidewaysSlice.toplevelReadReducer,
      ...state.analyticsSlice.identityStatsSlice,
    }),
  );

  return (
    <View>
      <NodeStats nodeStats={nodeStats} />
    </View>
  );
};

export default InputNodeStats;
