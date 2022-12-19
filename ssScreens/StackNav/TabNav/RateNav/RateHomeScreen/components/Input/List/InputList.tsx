import React, {FC} from 'react';
import {FlatList, ListRenderItem, ListRenderItemInfo} from 'react-native';
import {useDispatch} from 'react-redux';

import {AppDispatch} from 'ssRedux/index';
import {
  InputState,
  removeInput as removeInputR,
  setInputs as setInputsR,
} from 'ssRedux/rateSidewaysSlice';
import {
  removeReplacementInput as removeInputUR,
  setReplacementInputs as setInputsUR,
} from 'ssRedux/undorateSidewaysSlice';
import DbCategoryRow from 'ssComponents/CategoryRow/DbCategoryRow';
import NoInputsDisplay from './NoInputsDisplay';
import MyPadding from 'ssComponents/ReactNative/MyPadding';
import {DISPLAY_SIZE} from '../../../../../../../../global';
import {RATING_TYPE} from '../../RatingMenu/types';
import {select} from 'ssUtils/selector';

type RatingInputListProps = {
  ratingType: RATING_TYPE;
  inputs: InputState[];
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
      name: newInputName,
    };
    console.log('here');
    console.log(inputsCopy[index]);
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    console.log('AFTER');
    console.log(inputsCopy);
    dispatch(setInputs(inputsCopy));
  };

  const handleCommitCId = (index: number, newCId: string) => {
    const inputsCopy = [...inputs];
    inputsCopy[index] = {
      ...inputsCopy[index],
      category: newCId,
    };
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    dispatch(setInputs(inputsCopy));
  };

  const handleRemoveInput = (index: number) => dispatch(removeInput(index));

  return (
    <>
      {inputs.length > 0 ? (
        <FlatList
          data={inputs}
          renderItem={renderItem(
            handleCommitInputName,
            handleCommitCId,
            handleRemoveInput,
          )}
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
    onCommitCId: (index: number, newCId: string) => void,
    onRemoveInput: (index: number) => void,
  ): ListRenderItem<InputState> =>
  itemInfo =>
    (
      <RatingInput
        itemInfo={itemInfo}
        onCommitInputName={onCommitInputName}
        onCommitCId={onCommitCId}
        onRemoveInput={onRemoveInput}
      />
    );

type RatingInputProps = {
  itemInfo: ListRenderItemInfo<InputState>;
  onCommitInputName: (index: number, newInputName: string) => void;
  onCommitCId: (index: number, newCId: string) => void;
  onRemoveInput: (index: number) => void;
};
const RatingInput: FC<RatingInputProps> = props => {
  const {itemInfo, onCommitInputName, onCommitCId, onRemoveInput} = props;
  const {item, index} = itemInfo;

  // HANDLERS
  const handleCommitInputName = (newInputName: string) => {
    onCommitInputName(index, newInputName);
  };

  const handleCommitCId = (newCId: string) => {
    onCommitCId(index, newCId);
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
        inputName={item.name}
        categoryId={item.category}
        onCommitInputName={newInputName => handleCommitInputName(newInputName)}
        onCommitCId={newCId => handleCommitCId(newCId)}
        onDeleteCategoryRow={handleDeleteCategoryRow}
      />
    </MyPadding>
  );
};
