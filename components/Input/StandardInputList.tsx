import { FC } from 'react';

import { LinearGradient } from '../Effects';
import GrowingInputList, { GrowingInputListProps } from './GrowingInputList';

const StandardInputList: FC<GrowingInputListProps> = (props) => {
    const { list, renderItem: RenderItem, lastInput, updateLastInput, keyExtractor } = props;

    const linearGradientRenderItem: FC<{ item: any; index: number }> = (props) => {
        const { item, index } = props;

        return (
            // <LinearGradient fromLeft={index % 2 == 0}>
            <RenderItem item={item} index={index} />
            // </LinearGradient>
        );
    };

    return <GrowingInputList list={list} renderItem={linearGradientRenderItem} lastInput={lastInput} updateLastInput={updateLastInput} keyExtractor={keyExtractor} />;
};

export default StandardInputList;
