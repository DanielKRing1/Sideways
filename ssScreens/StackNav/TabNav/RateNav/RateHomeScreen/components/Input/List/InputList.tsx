import React, {FC, useEffect} from 'react';
import {FlatList, ListRenderItem, ListRenderItemInfo} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

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
    const inputsCopy = [...inputs];
    console.log('BEFORE');
    console.log(inputsCopy);
    console.log(index);
    console.log(newInputName);
    inputsCopy[index] = {
      ...inputsCopy[index],
      text: newInputName,
    };
    console.log('here');
    console.log(inputsCopy[index]);
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    console.log('AFTER');
    console.log(inputsCopy);
    dispatch(setInputs(inputsCopy));
  };

  return (
    <>
      {inputs.length > 0 ? (
        <FlatList
          data={inputs}
          renderItem={renderItem(handleCommitInputName)}
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
  ): ListRenderItem<GrowingIdText> =>
  itemInfo =>
    <RatingInput itemInfo={itemInfo} onCommitInputName={onCommitInputName} />;

type RatingInputProps = {
  itemInfo: ListRenderItemInfo<GrowingIdText>;
  onCommitInputName: (index: number, newInputName: string) => void;
};
const RatingInput: FC<RatingInputProps> = props => {
  const {itemInfo, onCommitInputName} = props;
  const {item, index} = itemInfo;

  // REDUX
  const dispatch: AppDispatch = useDispatch();

  // HANDLERS
  const handleCommitInputName = (newInputName: string) => {
    onCommitInputName(index, newInputName);
  };

  const handleDeleteCategoryRow = () => {
    dispatch(removeInput(index));
  };

  return (
    <DbCategoryRow
      inputName={item.text}
      onCommitInputName={newInputName => handleCommitInputName(newInputName)}
      onDeleteCategoryRow={handleDeleteCategoryRow}
    />
  );
};
