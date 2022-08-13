import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

// DB DRIVER
import dbDriver from '../../../../../database/dbDriver';
import { DbLoaderContext } from '../../../../../contexts/DbLoader';

// REDUX
import { RootState } from '../../../../../redux';

// COMPONENTS
import { FlexRow } from '../../../../../components/Flex';
import { SearchableFlatList } from '../../../../../components/Search/SearchableFlatList';

type StackCardProps = {
    item: StackSnapshotRow;
    index?: number;
};
const createStackCard = (): FC<StackCardProps> => (props) => {
    const { item } = props;

    return (
        <TouchableOpacity onPress={() => {}}>
            <FlexRow>
                <Text>{item.timestamp}</Text>
                <Text>{item.rating}</Text>

                <Text>Inputs:</Text>
                {
                    item.inputs.map((input: string) => <Text>{input}</Text>)
                }
                
                <Text>Outputs:</Text>
                {
                    item.outputs.map((output: string) => <Text>{output}</Text>)
                }
            </FlexRow>
        </TouchableOpacity>
    )
};

type StackListProps= {
};
const StackList: FC<StackListProps> = (props) => {
    const {  } = props;

    // REDUX
    const { activeSliceName, searchedSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
    const { stackStartDate, readStackSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.internalReadReducer.readStackReducer }));

    // DB DRIVER
    const { isLoaded } = useContext(DbLoaderContext);
    const stack = useMemo(() => {
        if(!activeSliceName) return [];
        
        return dbDriver.getStack(activeSliceName);
    }, [isLoaded, activeSliceName]);
    const searchIndex: number = useMemo(() => {
        if(!activeSliceName) return 0;

        return dbDriver.searchStack(activeSliceName, stackStartDate || new Date(0));
    }, [isLoaded, activeSliceName, stackStartDate]);

    // LIST COMPONENT
    const StackCard = useMemo(() => createStackCard(), []);

    console.log(searchIndex)
    console.log('searchIndex')

    return (
        <SearchableFlatList
            searchIndex={searchIndex}
            data={stack}
            renderItem={StackCard}
            keyExtractor={(item: StackSnapshotRow): string => item.timestamp.toISOString()}
        />
    );
};

export default StackList;
