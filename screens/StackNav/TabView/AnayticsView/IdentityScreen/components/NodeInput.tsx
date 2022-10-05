import React, { FC, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';
import { CGNode, ID_KEY, RankedNode } from '@asianpersonn/realm-graph';

import { AppDispatch, RootState } from '../../../../../../redux';
import { setSearchNodeIdInput, startSetNodeIdInput } from '../../../../../../redux/identityStatsSlice';
import MyText from '../../../../../../components/ReactNative/MyText';
import IconInput from '../../../../../../components/IconInput/IconInput';
import { FlexCol } from '../../../../../../components/Flex';
import MyTextInput from '../../../../../../components/ReactNative/MyTextInput';
import MyButton from '../../../../../../components/ReactNative/MyButton';
import dbDriver from '../../../../../../database/dbDriver';
import { SearchableDropdown } from '../../../../../../components/Search/SearchableDropdown';
import { useTrie } from '../../../../../../hooks/useTrie';

type NodeInputProps = {

};
const NodeInput: FC<NodeInputProps> = (props) => {
    const [ allNodeIds, setAllNodeIds ] = useState<string[]>([]);

    const { activeSliceName, searchedNodeIdInput, nodeIdInput, readSSSignature, inputStatsSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer, ...state.identityStatsSlice }));
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
