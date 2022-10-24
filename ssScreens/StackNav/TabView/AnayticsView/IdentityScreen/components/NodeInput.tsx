import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CGNode } from '@asianpersonn/realm-graph';

import { AppDispatch, RootState } from 'ssRedux/index';
import { setSearchNodeIdInput, startSetNodeIdInput } from 'ssRedux/analyticsSlice/identityStatsSlice';
import MyText from 'ssComponents/ReactNative/MyText';
import dbDriver from 'ssDatabase/api/core/dbDriver';
import AutoCompleteDecoration from 'ssComponents/DecorationRow/AutoCompleteDecoration';
import { DECORATION_ROW_KEY } from 'ssDatabase/api/types';

type NodeInputProps = {

};
const NodeInput: FC<NodeInputProps> = (props) => {
    const {
        activeSliceName,
        searchedNodeIdInput, nodeIdInput, readSSSignature, inputStatsSignature,
    } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.analyticsSlice.identityStatsSlice }));
    const dispatch: AppDispatch = useDispatch();

    // HANDLERS
    const handleSetSearchedNodeId = (nodeId: string): void => {
        dispatch(setSearchNodeIdInput(nodeId));
    }
    const handleSetNodeId = (nodeId: string): void => {
        dispatch(startSetNodeIdInput(nodeId));
    }

    return (
        <View>
            <MyText>Choose an Input Node</MyText>

            <AutoCompleteDecoration
                clickOutsideId='StatsNodeInput'
                placeholder='Choose a past input...'
                allEntityIds={dbDriver.getAllNodes(activeSliceName).map((node: Realm.Object & CGNode) => node.id)}
                inputValue={searchedNodeIdInput}
                setInputValue={handleSetSearchedNodeId}
                decorationRowKey={DECORATION_ROW_KEY.INPUT}
                onSelectEntityId={handleSetNodeId}
            />

        </View>
    );
}

export default NodeInput;
