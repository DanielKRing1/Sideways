import React, { FC, useEffect, useRef } from 'react';
import { FlatList } from 'react-native';

type SearchableFlatListProps = {
    searchIndex: number;
    data: any[];
    renderItem: FC<any>;
    keyExtractor: (item: any) => string;
}
export const SearchableFlatList: FC<SearchableFlatListProps> = (props) => {

    const { searchIndex, data, renderItem, keyExtractor } = props;

  const flatListRef = useRef<FlatList>(null);

  // Scroll to searchIndex, when it changes
  useEffect(() => {
    scrollToIndex(searchIndex, false);
  }, [searchIndex]);

  // const getItemLayout = (data, index) => { return {length: 20, index, offset: 20 * index} };

  /**
   * Called by FlatList if it scrolls out of the range of its rendered list items
   * 
   *    Correct the error by scrolling some offset (based on averageItemLength), so a new batch of list items can render
   *    Then try scrolling to the searchIndex again
   *    This will repeat until the search index is within the set of rendered list items
   * 
   * @param error 
   */
  const scrollToIndexFailed = (error: any) => {
    const offset = error.averageItemLength * error.index;
    scrollToOffset(offset, false);
    setTimeout(() => {
        scrollToIndex(error.index, false);
    }, 10); // You may choose to skip this line if the above typically works well because your average item height is accurate.
  }

  const scrollToIndex = (index: number, animated: boolean) => {
    if(!!flatListRef.current && index+1 <= data.length) flatListRef.current.scrollToIndex({ animated, index })
  }
  const scrollToOffset = (offset: number, animated: boolean) => {
    if(!!flatListRef.current) flatListRef.current.scrollToOffset({ animated, offset });
  }

  return (
      <FlatList
        maxToRenderPerBatch={100}
        updateCellsBatchingPeriod={50}
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        onScrollToIndexFailed={scrollToIndexFailed}
        keyExtractor={keyExtractor}
      />
  );
};
