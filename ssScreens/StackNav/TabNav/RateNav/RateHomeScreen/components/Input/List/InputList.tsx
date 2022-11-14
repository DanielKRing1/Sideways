import React, {FC} from 'react';
import {FlatList, ListRenderItem, ListRenderItemInfo} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from 'styled-components';

import {AppDispatch, RootState} from 'ssRedux/index';
import {removeInput, setInputs} from 'ssRedux/rateSidewaysSlice';
import {GrowingIdText} from 'ssComponents/Input/GrowingIdList';
import DbCategoryRow from 'ssComponents/CategoryRow/DbCategoryRow';
import NoInputsDisplay from './NoInputsDisplay';

type RatingInputListProps = {};
const RatingInputList: FC<RatingInputListProps> = props => {
  // REDUX
  const {inputs} = useSelector((state: RootState) => state.rateSidewaysSlice);
  const dispatch: AppDispatch = useDispatch();

  // HANDLERS
  const handleCommitInputName = (index: number, newInputName: string) => {
    inputs[index].text = newInputName;
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    dispatch(setInputs(inputs));
  };

  const handleDeleteInput = (index: number) => dispatch(removeInput(index));

  return (
    <>
      {inputs.length > 0 ? (
        <FlatList
          data={inputs}
          renderItem={renderItem(handleCommitInputName, handleDeleteInput)}
          keyExtractor={item => `${item.id}`}
        />
      ) : (
        <NoInputsDisplay />
      )}
    </>
  );
};

export default RatingInputList;

// RENDER ITEM
const renderItem =
  (
    onCommitInputName: (index: number, newInputName: string) => void,
    onDeleteInput: (index: number) => void,
  ): ListRenderItem<GrowingIdText> =>
  itemInfo =>
    (
      <RatingInput
        itemInfo={itemInfo}
        onCommitInputName={onCommitInputName}
        onDeleteInput={onDeleteInput}
      />
    );

type RatingInputProps = {
  itemInfo: ListRenderItemInfo<GrowingIdText>;
  onCommitInputName: (index: number, newInputName: string) => void;
  onDeleteInput: (index: number) => void;
};
const RatingInput: FC<RatingInputProps> = props => {
  const {itemInfo, onCommitInputName, onDeleteInput} = props;
  const {item, index} = itemInfo;

  // THEME
  const theme = useTheme();

  // HANDLERS
  const handleCommitInputName = (newInputName: string) => {
    onCommitInputName(index, newInputName);
  };
  const handleDeleteCategoryRow = () => {
    onDeleteInput(index);
  };

  return (
    <DbCategoryRow
      inputName={item.text}
      onCommitInputName={newInputName => handleCommitInputName(newInputName)}
      onDeleteCategoryRow={() => handleDeleteCategoryRow()}
    />
  );
};
