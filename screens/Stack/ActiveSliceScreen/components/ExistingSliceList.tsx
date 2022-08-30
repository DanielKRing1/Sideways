import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, Text } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';
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
import MyText from '../../../../components/ReactNative/MyText';
import DateCard from './DateCard';

type ExistingSliceCardProps = {
    item: ExistingSlice;
    index?: number;
};
const createExistingSliceCard = (onSelectSlice: (sliceName: string) => void): FC<ExistingSliceCardProps> => (props) => {
    const { item } = props;

    const { month=undefined, day=undefined } = item.lastLogged !== undefined ? abbrDate(item.lastLogged) : {};

    console.log(item.lastLogged)

    return (
        <StyledTouchableOpacity onPress={() => onSelectSlice(item.sliceName)}>
            <FlexRow justifyContent='space-around'>
                {
                    month === undefined || day === undefined ?
                        <MyText>Unused</MyText>
                    :
                        <DateCard
                            month={month}
                            day={day}
                        />
                }
                <MyText>{item.sliceName}</MyText>
            </FlexRow>
        </StyledTouchableOpacity>
    )
};

const StyledTouchableOpacity = styled.TouchableOpacity`
    borderColor: ${({ theme }: { theme: DefaultTheme }) => theme.colors.darkRed};
    borderWidth: 1px;
    borderRadius: 5px;

    marginLeft: 25px;
    marginRight: 25px;
    paddingTop: 15px;
    paddingBottom: 15px;
`;

type ExistingSliceListProps= {
    onSelectSlice: (sliceName: string) => void;
};
const ExistingSliceList: FC<ExistingSliceListProps> = (props) => {
    const { onSelectSlice } = props;

    const [ trie ] = useState<TrieTree<ExistingSlice>>(createTrie());
    const [ autoComplete, setAutoComplete ] = useState<ExistingSlice[]>([]);

    // REDUX
    const { activeSliceName, searchedSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
    
    // DB DRIVER
    const { isLoaded } = useContext(DbLoaderContext);
    const lastLoggedSlices = useMemo(() => dbDriver.getLastLoggedSlices(), [isLoaded]);
    useEffect(() => {
        trie.clear();
        
        const trieValues: { key: string, value: ExistingSlice }[] = lastLoggedSlices.map((existingSlice: ExistingSlice) => ({
            key: existingSlice.sliceName,
            value: existingSlice
        }));
        // console.log(trieValues);
        trie.addAll(trieValues);
    }, [lastLoggedSlices]);

    // LIST COMPONENT
    const ExistingSliceCard = useMemo(() => createExistingSliceCard(onSelectSlice), [onSelectSlice]);

    useEffect(() => {
        setAutoComplete(trie.search(searchedSliceName));
    }, [searchedSliceName]);

    return (
        <FlatList
            data={autoComplete}
            renderItem={ExistingSliceCard}
        />
    );
};

export default ExistingSliceList;
