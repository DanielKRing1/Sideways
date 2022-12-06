import React, {FC, useMemo} from 'react';
import {FlatList} from 'react-native';

export type GrowingListProps = {
  data: any[];
  keyExtractor: (dataPoint: any) => string;
  createRenderItemComponent: (
    handleChangeText: (newText: string, index: number) => void,
  ) => FC<any>;

  genNextDataPlaceholder: () => any;
  handleUpdateInput: (newText: string, index: number) => void;
  handleAddInput: (newText: string) => void;
};
export const GrowingList: FC<GrowingListProps> = props => {
  const {
    data,
    createRenderItemComponent,
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

  // Memoize
  const RenderItem = createRenderItemComponent(handleChangeText);

  const renderItem = ({item, index}: any) => (
    <RenderItem item={item} index={index} />
  );
  // const renderItem = createRenderItemComponent(handleChangeText);

  // Add placeholder
  const grownData = [...data, genNextDataPlaceholder()];

  return (
    <FlatList
      keyboardShouldPersistTaps="always"
      data={grownData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};
