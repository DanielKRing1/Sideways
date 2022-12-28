import React, {FC} from 'react';
import {GrowingList, GrowingListProps} from './GrowingInputList';
import {useCounterId} from '../../ssHooks/useCounterId';
import {getStartingId} from 'ssUtils/id';

export type GrowingIdText = {text: string; id: number};
type GrowingIdListProps = {
  startingId?: number;

  genNextDataPlaceholder: (id: number) => any;
  handleAddInput: (id: number, newText: string) => void;
} & Omit<GrowingListProps, 'genNextDataPlaceholder' | 'handleAddInput'>;
const GrowingIdList: FC<GrowingIdListProps> = props => {
  const {
    data,
    createRenderItemComponent,
    keyExtractor,
    startingId = getStartingId(data, d => d.id),
    genNextDataPlaceholder,
    handleUpdateInput,
    handleAddInput,
  } = props;

  // ID GENERATOR
  // Start id generator with current max id or 0
  const {peekId, popId} = useCounterId(startingId);

  // HANDLER METHODS
  const handleAddInputText = (newInputOption: string) => {
    const newId: number = popId();
    console.log('NEW ID-------------------------');
    console.log(newId);
    handleAddInput(newId, newInputOption);
  };

  return (
    <GrowingList
      data={data}
      createRenderItemComponent={createRenderItemComponent}
      keyExtractor={keyExtractor}
      genNextDataPlaceholder={() => genNextDataPlaceholder(peekId())}
      handleUpdateInput={handleUpdateInput}
      handleAddInput={handleAddInputText}
    />
  );
};

export default GrowingIdList;
