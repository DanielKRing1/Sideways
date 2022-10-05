import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, Text } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import createTrie, { TrieTree } from '@asianpersonn/trie';

// DB DRIVER
import dbDriver from '../../../../ssDatabase/dbDriver';
import { DbLoaderContext } from '../../../../ssCcontexts/DbLoader/DbLoader';

// REDUX
import { RootState } from '../../../../ssRedux';

// COMPONENTS
import { FlexRow } from '../../../../ssComponents/Flex';

// HOOKS
import { useTrie } from '../../../../ssHooks/useTrie';

// UTILS
import { abbrDate } from '../../../../ssUtils/date';
import MyText from '../../../../ssComponents/ReactNative/MyText';
import DateCard from './DateCard';
import MyButton from '../../../../ssComponents/ReactNative/MyButton';
import { ExistingSlice } from '../../../../ssDatabase/types';

type ExistingSliceCardProps = {
    item: ExistingSlice;
    index?: number;
};
const createExistingSliceCard = (onSelectSlice: (sliceName: string) => void, onDeleteSlice: (sliceName: string) => void): FC<ExistingSliceCardProps> => (props) => {
    const { item } = props;

    const { month=undefined, day=undefined } = item.lastLogged !== undefined ? abbrDate(item.lastLogged) : {};

    console.log(item.lastLogged);

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

                <MyButton
                    onPress={() => onDeleteSlice(item.sliceName)}
                >
                    <MyText>X</MyText>
                </MyButton>
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
    onDeleteSlice: (sliceName: string) => void;
};
const ExistingSliceList: FC<ExistingSliceListProps> = (props) => {
    const { onSelectSlice, onDeleteSlice } = props;

    const { setValues: setTrieValues, search, autoComplete } = useTrie<ExistingSlice>((existingSlice: ExistingSlice) => existingSlice.sliceName);
    const [ lastLogged, setLastLogged ] = useState<ExistingSlice[]>([]);

    // REDUX
    const { activeSliceName, searchedSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
    
    // DB DRIVER
    const { isLoaded } = useContext(DbLoaderContext);
    
    // 1. Get lastLogged slices
    useEffect(() => {
        (async () => {
            const lastLogged: ExistingSlice[] = await dbDriver.getLastLoggedSlices();
            setLastLogged(lastLogged);
        })();

    }, [isLoaded]);

    // 2. Fill lastLogged slices into Trie
    useEffect(() => { setTrieValues(searchedSliceName, lastLogged); }, [lastLogged]);

    // 3. Get autoComplete list, based on searchedSliceName
    useEffect(() => { search(searchedSliceName) }, [searchedSliceName]);

    // LIST COMPONENT
    const ExistingSliceCard = useMemo(() => createExistingSliceCard(onSelectSlice, onDeleteSlice), [onSelectSlice, onDeleteSlice]);

    return (
        <FlatList
            data={autoComplete}
            renderItem={ExistingSliceCard}
        />
    );
};

export default ExistingSliceList;
