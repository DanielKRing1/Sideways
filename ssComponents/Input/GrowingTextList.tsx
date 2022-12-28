import React, {FC} from 'react';
import {FlatList, FlatListProps, ListRenderItem} from 'react-native';
import {useCounterId} from 'ssHooks/useCounterId';
import {getStartingId} from 'ssUtils/id';

export type GrowingListItem = {
  id: number;
  text: string;
};
export type RenderItemProps = {
  item: GrowingListItem;
  index: number;
  handleChangeText: (newText: string, index: number) => void;
};
type GrowingTextListProps = {
  data: GrowingListItem[];
  RenderItem: FC<RenderItemProps>;
  startingId?: number;
  handleAddOutput: (id: number, newText: string) => void;
  handleUpdateOutput: (index: number, newText: string) => void;
} & Omit<FlatListProps<any>, 'data' | 'renderItem'>;
const GrowingTextList: FC<GrowingTextListProps> = props => {
  // PROPS
  const {
    data = [],
    RenderItem,
    startingId = getStartingId(data, d => d.id),
    handleAddOutput,
    handleUpdateOutput,
  } = props;

  // HOOKS
  const {peekId, popId} = useCounterId(startingId);

  // HANDLE
  const handleChangeText = (newText: string, index: number) => {
    console.log('HANDLECHANGETEXT------------------------');
    console.log(newText);
    console.log(index);
    if (index === data.length) handleAddOutput(popId(), '');
    handleUpdateOutput(index, newText);
  };

  return (
    <FlatList
      {...props}
      data={[...data, {id: peekId(), text: ''}]}
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

export default GrowingTextList;
