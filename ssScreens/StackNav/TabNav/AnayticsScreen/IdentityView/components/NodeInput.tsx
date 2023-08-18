import React, {FC, memo, useCallback} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {AppDispatch, RootState} from 'ssRedux/index';
import {
  setSearchNodeIdInput,
  startSetNodeIdInput,
} from 'ssRedux/analytics/identityStats';
import MyText from 'ssComponents/ReactNative/MyText';
import AutoCompleteCategory from 'ssComponents/CategoryRow/AutoComplete/AutoCompleteCategory';
import {GraphType} from 'ssDatabase/api/core/types';
import styled, {DefaultTheme} from 'styled-components/native';
import {GOOD_POSTFIX} from 'ssDatabase/api/types';

type NodeInputProps = {};
const NodeInput: FC<NodeInputProps> = () => {
  const {typingNodeIdInput, nodeIdInput} = useSelector(
    (state: RootState) => state.analytics.identityStats,
  );
  const dispatch: AppDispatch = useDispatch();

  // HANDLERS
  const handleSetSearchedNodeId = useCallback((nodeIdInput: string): void => {
    dispatch(setSearchNodeIdInput(nodeIdInput));
  }, []);
  const handleSetNodeId = useCallback((nodeIdInput: string): void => {
    // TODO Add option to selection good or bad postfix
    dispatch(
      startSetNodeIdInput({
        nodeIdInput,
        goodOrBad: GOOD_POSTFIX,
        graphType: GraphType.Input,
      }),
    );
  }, []);

  // console.log('NODEINPUT RERENDERED');

  return (
    <StyleView>
      <MyText>Choose an Input Node</MyText>
      <MyText>{nodeIdInput}</MyText>

      <AutoCompleteCategory
        placeholder="Choose a past input..."
        value={typingNodeIdInput}
        onChangeText={handleSetSearchedNodeId}
        onSelectEntityId={handleSetNodeId}
      />
    </StyleView>
  );
};

export default memo(NodeInput);

const StyleView = styled.View`
  background: ${({theme}) => theme.backgroundColors.main};
`;
