import React, { FC, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';

/**
 * To properly use this component,
 * The 'lastInput' must be 'up-to-date' after each change to the provided 'list',
 *      meaning that the provided 'lastInput' key matches the key of the next item actually pushed onto the list, so
 *      the provided 'push' method must both push another item onto the list and update the 'lastInput' object's id
 * This constant key allows FlatList to keep focus on the 'lastInput', even after it is no longer the last input, ie FlatList re-renders
 */

export type GrowingInputListProps = {
    list: any;
    renderInput: FC<{ item: any; index: number; push: () => void; replace: () => void; rm: (index: number) => void; }>;
    lastInput: any & { id: any };
    keyExtractor: (data: any) => any;
};

// const NOT_FOCUSED_INDEX: number = -1;

type RenderConditionalItemProps = {
    item: any;
    index: number;
};

const GrowingInputList: FC<GrowingInputListProps> = (props) => {
    const { list, renderInput, lastInput, keyExtractor, push, rm, replace, } = props;

    // const [focusedIndex, setFocusedIndex] = useState<number>(NOT_FOCUSED_INDEX);
    // const [prevLen, setPrevLen] = useState(list.length);

    const myPush = (newItem: any) => {
        // 1. List grew, focus last index
        // setFocusedIndex(prevLen);
        // setPrevLen(prevLen + 1)
        
        push(newItem);
    }

    const myRm = (index: number) => {
        // setFocusedIndex(NOT_FOCUSED_INDEX);
        // setPrevLen(prevLen - 1);

        rm(index);
    }

    const RenderInput = renderInput;

    const renderConditionalItem = ({ item, index }: RenderConditionalItemProps) => {
        return <RenderInput list={list} item={item} index={index} push={myPush} replace={index < list.length ? replace : myPush} rm={myRm} />
    };

    return (
            <FlatList data={[...list, lastInput]} renderItem={renderConditionalItem} keyExtractor={keyExtractor} />
    );
};

export default GrowingInputList;
