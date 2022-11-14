import React, {FC} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CGNode} from '@asianpersonn/realm-graph';

import {AppDispatch, RootState} from 'ssRedux/index';
import {
  setSearchNodeIdInput,
  startSetNodeIdInput,
} from 'ssRedux/analyticsSlice/identityStatsSlice';
import MyText from 'ssComponents/ReactNative/MyText';
import AutoCompleteCategory from 'ssComponents/CategoryRow/AutoCompleteCategory';

type NodeInputProps = {};
const NodeInput: FC<NodeInputProps> = () => {
  const {searchedNodeIdInput, inputStatsSignature} = useSelector(
    (state: RootState) => ({
      ...state.analyticsSlice.identityStatsSlice,
    }),
  );
  const dispatch: AppDispatch = useDispatch();

  // HANDLERS
  const handleSetSearchedNodeId = (nodeId: string): void => {
    dispatch(setSearchNodeIdInput(nodeId));
  };
  const handleSetNodeId = (nodeId: string): void => {
    dispatch(startSetNodeIdInput(nodeId));
  };

  return (
    <View>
      <MyText>Choose an Input Node</MyText>

      <AutoCompleteCategory
        clickOutsideId="StatsNodeInput"
        placeholder="Choose a past input..."
        inputValue={searchedNodeIdInput}
        setInputValue={handleSetSearchedNodeId}
        onSelectEntityId={handleSetNodeId}
      />
    </View>
  );
};

export default NodeInput;
