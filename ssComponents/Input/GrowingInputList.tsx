import React, {FC} from 'react';
import {FlatList, FlatListProps} from 'react-native';

export type RenderItemProps = {
  item: any & {id: any};
  index: number;
  handleChangeText: (newText: string, index: number) => void;
};

export type GrowingListProps = {
  data: any[];
  RenderItem: FC<RenderItemProps>;
  keyExtractor: (dataPoint: any) => string;

  genNextDataPlaceholder: () => any;
  handleAddInput: (newText: string) => void;
  handleUpdateInput: (newText: string, index: number) => void;
} & Omit<FlatListProps<any>, 'data' | 'renderItem'>;
export const GrowingList: FC<GrowingListProps> = props => {
  const {
    data,
    RenderItem,
    keyExtractor,
    genNextDataPlaceholder,
    handleUpdateInput,
    handleAddInput,
  } = props;

  const [, forceUpdate] = React.useState<Object>({});

  const handleChangeText = (newText: string, index: number) => {
    console.log('HANDLECHANGETEXT------------------------');
    console.log(newText);
    console.log(index);
    if (index < data.length) {
      handleUpdateInput(newText, index);
    } else {
      handleAddInput(newText);
    }

    forceUpdate({});
  };

  // Add placeholder
  const grownData = [...data, genNextDataPlaceholder()];

  return (
    <FlatList
      {...props}
      data={[...data, genNextDataPlaceholder()]}
      renderItem={({item, index}) => (
        <RenderItem
          item={item}
          index={index}
          handleChangeText={handleChangeText}
        />
      )}
    />
  );
};
