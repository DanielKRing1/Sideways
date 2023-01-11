import React, {FC, memo, useCallback} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {AppDispatch, RootState} from 'ssRedux/index';
import {
  setSearchNodeIdInput,
  startSetNodeIdInput,
} from 'ssRedux/analyticsSlice/identityStatsSlice';
import MyText from 'ssComponents/ReactNative/MyText';
import AutoCompleteCategory from 'ssComponents/CategoryRow/AutoCompleteCategory';
import {GraphType} from 'ssDatabase/api/core/types';

type NodeInputProps = {};
const NodeInput: FC<NodeInputProps> = () => {
  const {searchedNodeIdInput, nodeIdInput, inputStatsSignature} = useSelector(
    (state: RootState) => state.analyticsSlice.identityStatsSlice,
  );
  const dispatch: AppDispatch = useDispatch();

  // HANDLERS
  const handleSetSearchedNodeId = useCallback((nodeIdInput: string): void => {
    dispatch(setSearchNodeIdInput(nodeIdInput));
  }, []);
  const handleSetNodeId = useCallback((nodeIdInput: string): void => {
    dispatch(startSetNodeIdInput({nodeIdInput, graphType: GraphType.Input}));
  }, []);

  // console.log('NODEINPUT RERENDERED');

  return (
    <View>
      <MyText>Choose an Input Node</MyText>
      <MyText>{nodeIdInput}</MyText>

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

export default memo(NodeInput);
