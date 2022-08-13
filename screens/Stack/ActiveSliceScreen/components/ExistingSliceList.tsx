import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import createTrie, { TrieTree } from '@asianpersonn/trie';

// DB DRIVER
import dbDriver from '../../../../database/dbDriver';
import { DbLoaderContext } from '../../../../contexts/DbLoader';

// REDUX
import { RootState } from '../../../../redux';

// COMPONENTS
import { FlexRow } from '../../../../components/Flex';

// UTILS
import { abbrDate } from '../../../../utils/date';
import MyText from '../../../../components/Text/MyText';

type ExistingSliceCardProps = {
    item: ExistingSlice;
    index?: number;
};
const createExistingSliceCard = (onSelectSlice: (sliceName: string) => void): FC<ExistingSliceCardProps> => (props) => {
    const { item } = props;

    return (
        <TouchableOpacity onPress={() => onSelectSlice(item.sliceName)}>
            <FlexRow>
                <MyText>{abbrDate(item.lastLogged)}</MyText>
                <MyText>{item.sliceName}</MyText>
            </FlexRow>
        </TouchableOpacity>
    )
};

type ExistingSliceListProps= {
    onSelectSlice: (sliceName: string) => void;
};
const ExistingSliceList: FC<ExistingSliceListProps> = (props) => {
    const { onSelectSlice } = props;

    const [ trie, setTrie ] = useState<TrieTree<ExistingSlice>>(createTrie());

    // REDUX
    const { activeSliceName, searchedSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));

    // DB DRIVER
    const { isLoaded } = useContext(DbLoaderContext);
    const lastLoggedSlices = useMemo(() => dbDriver.getLastLoggedSlices(), [isLoaded]);
    useEffect(() => {
        setTrie(createTrie());

        const trieValues: { key: string, value: ExistingSlice }[] = lastLoggedSlices.map((existingSlice: ExistingSlice) => ({
            key: existingSlice.sliceName,
            value: existingSlice
        }));
        trie.addAll(trieValues);
    }, [lastLoggedSlices]);

    // LIST COMPONENT
    const ExistingSliceCard = useMemo(() => createExistingSliceCard(onSelectSlice), [onSelectSlice]);

    return (
        <FlatList
            data={trie.search(searchedSliceName)}
            renderItem={ExistingSliceCard}
        />
    );
};

export default ExistingSliceList;
