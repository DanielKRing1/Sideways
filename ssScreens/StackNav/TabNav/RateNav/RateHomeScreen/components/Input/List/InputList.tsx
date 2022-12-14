import React, {FC} from 'react';
import {FlatList, ListRenderItem, ListRenderItemInfo} from 'react-native';
import {useDispatch} from 'react-redux';

import {AppDispatch} from 'ssRedux/index';
import {
  removeInput as removeInputR,
  setInputs as setInputsR,
} from 'ssRedux/rateSidewaysSlice';
import {
  removeReplacementInput as removeInputUR,
  setReplacementInputs as setInputsUR,
} from 'ssRedux/undorateSidewaysSlice';
import {GrowingIdText} from 'ssComponents/Input/GrowingIdList';
import DbCategoryRow from 'ssComponents/CategoryRow/DbCategoryRow';
import NoInputsDisplay from './NoInputsDisplay';
import MyPadding from 'ssComponents/ReactNative/MyPadding';
import {DISPLAY_SIZE} from '../../../../../../../../global';
import {RATING_TYPE} from '../../RatingMenu/types';
import {select} from 'ssUtils/selector';

type RatingInputListProps = {
  ratingType: RATING_TYPE;
  inputs: GrowingIdText[];
};
const RatingInputList: FC<RatingInputListProps> = props => {
  // PROPS
  const {ratingType, inputs} = props;

  // REDUX
  // Select reducer actions
  const [, setInputs] = select(
    ratingType,
    [RATING_TYPE.Rate, setInputsR],
    [RATING_TYPE.UndoRate, setInputsUR],
  );
  const [, removeInput] = select(
    ratingType,
    [RATING_TYPE.Rate, removeInputR],
    [RATING_TYPE.UndoRate, removeInputUR],
  );
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

  const handleRemoveInput = (index: number) => dispatch(removeInput(index));

  return (
    <>
      {inputs.length > 0 ? (
        <FlatList
          data={inputs}
          renderItem={renderItem(handleCommitInputName, handleRemoveInput)}
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
    onRemoveInput: (index: number) => void,
  ): ListRenderItem<GrowingIdText> =>
  itemInfo =>
    (
      <RatingInput
        itemInfo={itemInfo}
        onCommitInputName={onCommitInputName}
        onRemoveInput={onRemoveInput}
      />
    );

type RatingInputProps = {
  itemInfo: ListRenderItemInfo<GrowingIdText>;
  onCommitInputName: (index: number, newInputName: string) => void;
  onRemoveInput: (index: number) => void;
};
const RatingInput: FC<RatingInputProps> = props => {
  const {itemInfo, onCommitInputName, onRemoveInput} = props;
  const {item, index} = itemInfo;

  // HANDLERS
  const handleCommitInputName = (newInputName: string) => {
    onCommitInputName(index, newInputName);
  };

  const handleDeleteCategoryRow = () => {
    onRemoveInput(index);
  };

  return (
    <MyPadding
      baseSize={DISPLAY_SIZE.xs}
      rightSize={DISPLAY_SIZE.sm}
      leftSize={DISPLAY_SIZE.sm}>
      <DbCategoryRow
        inputName={item.text}
        onCommitInputName={newInputName => handleCommitInputName(newInputName)}
        onDeleteCategoryRow={handleDeleteCategoryRow}
      />
    </MyPadding>
  );
};
