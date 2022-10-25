import React, {FC} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Todo from '../../../../ssComponents/Dev/Todo';
import {TabNavHeader} from '../../../../ssComponents/Navigation/NavHeader';

import {RootState} from '../../../../ssRedux';
import {forceSignatureRerender} from '../../../../ssRedux/readSidewaysSlice';
import {
  setInputSelections,
  setOutputSelections,
  forceSignatureRerender as forceGraphSignatureRerender,
} from '../../../../ssRedux/readSidewaysSlice/readGraph';

// Possible outputs

type GraphViewScreenProps = {};
const GraphViewScreen: FC<GraphViewScreenProps> = props => {
  const {} = props;

  const {
    readSSSignature,
    activeSliceName,
    readGraphSignature,
    inputSelections,
    outputSelections,
  } = useSelector((state: RootState) => ({
    ...state.readSidewaysSlice.toplevelReadReducer,
    ...state.readSidewaysSlice.internalReadReducer.readGraphReducer,
  }));

  return (
    <View>
      <TabNavHeader />

      <Todo name="Input selections dropdown" />
      <Todo name="Output selections dropdown" />
    </View>
  );
};

export default GraphViewScreen;
