import React, {FC} from 'react';
import {GrowingList, GrowingListProps} from './GrowingInputList';
import {IdGenerator} from '../../ssHooks/useCounterId';
import {View} from 'react-native';

export type GrowingIdText = {text: string; id: number};
type GrowingIdListProps = {
  idGenerator: IdGenerator<any>;

  genNextDataPlaceholder: (id: any) => any;
  handleAddInput: (id: any, newText: string) => void;
  handleUpdateInput: (newText: string, index: number, id: any) => void;
} & Omit<
  GrowingListProps,
  'genNextDataPlaceholder' | 'handleAddInput' | 'handleUpdateInput'
>;
const GrowingIdList: FC<GrowingIdListProps> = props => {
  const {
    data,
    RenderItem,
    keyExtractor,
    idGenerator,
    genNextDataPlaceholder,
    handleUpdateInput,
    handleAddInput,
  } = props;

  // ID GENERATOR
  // Start id generator with current max id or 0
  const {peekId, popId} = idGenerator;

  // HANDLER METHODS
  const _handleAddInput = (newText: string) => {
    const newId: number = popId();
    console.log('NEW ID-------------------------');
    console.log(newId);
    handleAddInput(newId, newText);
  };
  const _handleUpdateInput = (newText: string, index: number) => {
    handleUpdateInput(newText, index, keyExtractor(data[index]));
  };

  return (
    <GrowingList
      data={data}
      RenderItem={RenderItem}
      keyExtractor={keyExtractor}
      genNextDataPlaceholder={() => genNextDataPlaceholder(peekId())}
      handleUpdateInput={_handleUpdateInput}
      handleAddInput={_handleAddInput}
    />
  );
};

export default GrowingIdList;
