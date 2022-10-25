import React, {FC} from 'react';
import {GrowingList, GrowingListProps} from './GrowingInputList';
import {useCounterId} from '../../ssHooks/useCounterId';

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
    startingId = data.reduce(
      (maxId: number, curVal: GrowingIdText) => Math.max(maxId, curVal.id),
      -1,
    ) + 1,
    genNextDataPlaceholder,
    handleUpdateInput,
    handleAddInput,
  } = props;

  // ID GENERATOR
  // Start id generator with current max id or 0
  const {peekId, popId} = useCounterId(startingId);

  // HANDLER METHODS
  const handleAddInputText = (newInputOption: string) => {
    handleAddInput(popId(), newInputOption);
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
