import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

// DB DRIVER
import dbDriver from '../../../../../database/dbDriver';
import { DbLoaderContext } from '../../../../../contexts/DbLoader/DbLoader';

// REDUX
import { RootState } from '../../../../../redux';

// COMPONENTS
import { FlexRow } from '../../../../../components/Flex';
import { SearchableFlatList } from '../../../../../components/Search/SearchableFlatList';
import MyText from '../../../../../components/ReactNative/MyText';

type StackCardProps = {
    item: SidewaysSnapshotRow;
    index?: number;
};
const createStackCard = (): FC<StackCardProps> => (props) => {
    const { item } = props;

    return (
        <TouchableOpacity onPress={() => {}}>
            <FlexRow>
                <MyText>{item.timestamp.toDateString()}</MyText>
                <MyText>{item.rating}</MyText>

                <MyText>Inputs:</MyText>
                {
                    item.inputs.map((input: string) => <MyText>{input}</MyText>)
                }
                
                <MyText>Outputs:</MyText>
                {
                    item.outputs.map((output: string) => <MyText>{output}</MyText>)
                }
            </FlexRow>
        </TouchableOpacity>
    )
};

type StackListProps= {
};
const StackList: FC<StackListProps> = (props) => {
    const {  } = props;

    // LOCAL STATE
    const [ searchIndex, setSearchIndex ] = useState<number>(-1);
    const [ stack, setStack ] = useState<SidewaysSnapshotRow[]>([]);

    // REDUX
    const { activeSliceName, searchedSliceName, readSSSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.toplevelReadReducer }));
    const { stackStartDate, readStackSignature } = useSelector((state: RootState) => ({ ...state.readSidewaysSlice.internalReadReducer.readStackReducer }));

    // DB DRIVER
    const { isLoaded } = useContext(DbLoaderContext);

    // 1. Get stack list
    useEffect(() => {
        // if(!activeSliceName) return setStack([]);

        (async () => {
            const stack: SidewaysSnapshotRow[] = await dbDriver.getStack(activeSliceName);
            setStack(stack);
        })();

    }, [isLoaded, activeSliceName]);

    // 2. Get stack search index
    useEffect(() => {
        // if(!activeSliceName) return setSearchIndex(-1);

        (async () => {
            let index: number = await dbDriver.searchStack(activeSliceName, stackStartDate);
            setSearchIndex(index);
        })();
        
    }, [stackStartDate, stack]);

    // LIST COMPONENT
    const StackCard = useMemo(() => createStackCard(), []);

    console.log(searchIndex)
    console.log('searchIndex')

    return (
        <SearchableFlatList
            searchIndex={searchIndex}
            data={stack}
            renderItem={StackCard}
            keyExtractor={(item: SidewaysSnapshotRow): string => item.timestamp.toISOString()}
        />
    );
};

export default StackList;
