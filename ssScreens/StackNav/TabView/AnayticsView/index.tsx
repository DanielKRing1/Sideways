import React, {FC} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import Todo from '../../../../ssComponents/Dev/Todo';
import {TabNavHeader} from '../../../../ssComponents/Navigation/NavHeader';

import {RootState} from '../../../../ssRedux';
import {forceSignatureRerender} from '../../../../ssRedux/readSidewaysSlice';

// Possible outputs

type GraphViewScreenProps = {};
const GraphViewScreen: FC<GraphViewScreenProps> = props => {
  const {} = props;

  const {readSSSignature, readGraphSignature} = useSelector(
    (state: RootState) => ({
      ...state.readSidewaysSlice.toplevelReadReducer,
      ...state.readSidewaysSlice.internalReadReducer.readGraphReducer,
    }),
  );

  return (
    <View>
      <TabNavHeader />

      <Todo name="Input selections dropdown" />
      <Todo name="Output selections dropdown" />
    </View>
  );
};

export default GraphViewScreen;
