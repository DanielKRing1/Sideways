import React, { FC, useEffect, useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

/**
 * To properly use this component,
 * wrap the provided RenderItem and RenderInput components in 'React.forwardRef'.
 * This component uses a ref to access the provided TextInput.focus method
 * to focus the most recently added list item,
 * when a new item is added to the list data
 */

export type GrowingInputListProps = {
    list: any;
    renderItem: FC<{ item: any; index: number }>;
    lastInput: any & { id: any };
    updateLastInput: () => void;
    keyExtractor: (data: any) => any;
};

const GrowingInputList: FC<GrowingInputListProps> = (props) => {
    const { list, renderItem, lastInput, updateLastInput, keyExtractor } = props;

    // Check when list grows
    const [prevListLen, setPrevListLen] = React.useState(list.length);
    React.useEffect(() => {
        // Record, then update prev list len
        const prevLen = prevListLen;
        setPrevListLen(list.length);

        // Do not need to update id counter, List got smaller
        if (list.length < prevLen) return;

        // Update id counter
        updateLastInput();
    }, [list.length]);

    // const RenderItem = renderItem;
    // type RenderConditionalItemProps = {
    //     item: any;
    //     index: number;
    // };
    // const renderConditionalItem = ({ item, index }: RenderConditionalItemProps) => {
    //     return <RenderItem renderType={index < list.length ? RenderType.Item : RenderType.Input} item={item} index={index} />;

    //     // return RenderItem({renderType: index < data.length ? RenderType.Item : RenderType.Input, item: item, index: index})
    // };

    return <FlatList data={[...list, lastInput]} renderItem={renderItem} keyExtractor={keyExtractor} />;
    // return (
    // <FlatList
    //   data={[...data]}
    //   renderItem={({ item, index }: { item: any, index: number }) => <RenderItem item={item} index={index} />}
    //   keyExtractor={keyExtractor}
    // />
    // );
};

export default GrowingInputList;
