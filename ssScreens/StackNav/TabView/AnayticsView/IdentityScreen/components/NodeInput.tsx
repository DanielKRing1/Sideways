import React, { FC, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';
import { CGNode, ID_KEY, RankedNode } from '@asianpersonn/realm-graph';

import { AppDispatch, RootState } from '../../../../../../ssRedux';
import { setSearchNodeIdInput, startSetNodeIdInput } from '../../../../../../ssRedux/analyticsSlice/identityStatsSlice';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import IconInput from '../../../../../../ssComponents/IconInput/generic/IconInput';
import { FlexCol } from '../../../../../../ssComponents/Flex';
import MyTextInput from '../../../../../../ssComponents/ReactNative/MyTextInput';
import MyButton from '../../../../../../ssComponents/ReactNative/MyButton';
import dbDriver from '../../../../../../ssDatabase/api/core/dbDriver';
import { SearchableDropdown } from '../../../../../../ssComponents/Search/SearchableDropdown';
import { useTrie } from '../../../../../../ssHooks/useTrie';

type NodeInputProps = {

};
const NodeInput: FC<NodeInputProps> = (props) => {
    const [ allNodeIds, setAllNodeIds ] = useState<string[]>([]);

    const { activeSliceName, searchedNodeIdInput, nodeIdInput, readSSSignature, inputStatsSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.analyticsSlice.identityStatsSlice }));
    const dispatch: AppDispatch = useDispatch();

    const { setValues: setTrieValues, search, autoComplete } = useTrie<string>((nodeId: string) => nodeId);
    const theme: DefaultTheme = useTheme();

    // HANDLERS
    const handleChangeInput = (newText: string): void => {
        dispatch(setSearchNodeIdInput(newText));
    }

    const handleSetNodeId = (nodeId: string): void => {
        dispatch(startSetNodeIdInput(nodeId));
    }

    // TRIE EFFECTS
    // 1. Get all node ids from DB
    useEffect(() => {
        const nodeIds: string[] = dbDriver.getAllNodes(activeSliceName).map((node: Realm.Object & CGNode) => node.id)
        setAllNodeIds(nodeIds);
    }, [readSSSignature, inputStatsSignature]);

    // 2. Set up Trie
    useEffect(() => {
        setTrieValues(searchedNodeIdInput, allNodeIds);
    }, [allNodeIds]);

    const Dropdown: FC<{}> = () => (
        <FlexCol>
        {
            autoComplete.map((nodeId: string) => (
                <MyButton
                    onPress={() => handleSetNodeId(nodeId)}
                >
                    <MyText>{nodeId}</MyText>
                </MyButton>
            ))
        }
        </FlexCol>
    )

    return (
        <View>
            <MyText>Choose an Input Node</MyText>

            <SearchableDropdown
                clickOutsideId='StatsNodeInput'
                placeholder='Choose a past input'
                inputValue={searchedNodeIdInput}
                setInputValue={handleChangeInput}
                DropdownComponent={Dropdown}
            />
        </View>
    );
}

export default NodeInput;
