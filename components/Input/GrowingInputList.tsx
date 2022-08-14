import React, { FC, useMemo } from 'react';
import { FlatList } from 'react-native';

type GrowingListProps = {
    data: any[];
    keyExtractor: (dataPoint: any) => string;
    createRenderItemComponent: (handleChangeText: (newText: string, index: number) => void) => FC<any>;

    genNextDataPlaceholder: () => any;
    handleUpdateText: (newText: string, index: number) => void;
    handleAddInput: (newText: string) => void;
};
export const GrowingList: FC<GrowingListProps> = (props) => {
    const { data, createRenderItemComponent, keyExtractor, genNextDataPlaceholder, handleUpdateText, handleAddInput } = props;

    const [ , forceUpdate ] = React.useState<Object>({});

    const handleChangeText = (newText: string, index: number) => {
        if (index < data.length) {
            handleUpdateText(newText, index);
        } else {
            handleAddInput(newText);
        }

        forceUpdate({});
    }

    // Memoize
    const renderItem = useMemo(() => createRenderItemComponent(handleChangeText), [data]);
    // const renderItem = createRenderItemComponent(handleChangeText);

    // Add placeholder
    const grownData = [...data, genNextDataPlaceholder()];

    return (
        <FlatList
            data={grownData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
        />
    )
}