import React, {FC} from 'react';
import {FlatList, ListRenderItem, ListRenderItemInfo} from 'react-native';
import {useDispatch} from 'react-redux';

import {AppDispatch} from 'ssRedux/index';
import {
  editInput as editInputR,
  RateInput,
  removeInput as removeInputR,
} from 'ssRedux/rateSidewaysSlice';
import {
  editReplacementInput as editInputUR,
  removeReplacementInput as removeInputUR,
} from 'ssRedux/undorateSidewaysSlice';
import DbCategoryRow from 'ssComponents/CategoryRow/DbCategoryRow';
import NoInputsDisplay from './NoInputsDisplay';
import MyPadding from 'ssComponents/ReactNative/MyPadding';
import {DISPLAY_SIZE} from '../../../../../../../../global';
import {RATING_TYPE} from '../../RatingMenu/types';
import {select} from 'ssUtils/selector';
import {toggleNodePostfix} from 'ssDatabase/api/types';

type RatingInputListProps = {
  ratingType: RATING_TYPE;
  inputs: RateInput[];
};
const RatingInputList: FC<RatingInputListProps> = props => {
  // PROPS
  const {ratingType, inputs} = props;

  // REDUX
  // Select reducer actions
  const [, editInput] = select(
    ratingType,
    [RATING_TYPE.Rate, editInputR],
    [RATING_TYPE.UndoRate, editInputUR],
  );
  const [, removeInput] = select(
    ratingType,
    [RATING_TYPE.Rate, removeInputR],
    [RATING_TYPE.UndoRate, removeInputUR],
  );
  const dispatch: AppDispatch = useDispatch();

  // HANDLERS
  const handleCommitInputName = (index: number, newInputName: string) => {
    console.log('BEFORE');
    console.log(inputs);
    console.log(index);
    console.log(newInputName);
    console.log('here');
    console.log(inputs[index]);
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    dispatch(
      editInput({
        index,
        input: {
          ...inputs[index],
          item: {
            ...inputs[index].item,
            id: newInputName,
          },
        },
      }),
    );
  };
  const handleToggleInputPostfix = (index: number) => {
    console.log('BEFORE');
    console.log(inputs);
    console.log(index);
    console.log('here');
    console.log(inputs[index]);
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    dispatch(
      editInput({
        index,
        input: {
          ...inputs[index],
          item: {
            ...inputs[index].item,
            postfix: toggleNodePostfix(inputs[index].item.postfix),
          },
        },
      }),
    );
  };

  const handleCommitCId = (index: number, newCId: string) => {
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    dispatch(
      editInput({
        index,
        input: {
          ...inputs[index],
          item: {
            ...inputs[index].item,
            category: newCId,
          },
        },
      }),
    );
  };

  const handleRemoveInput = (index: number) => dispatch(removeInput(index));

  return (
    <>
      {inputs.length > 0 ? (
        <FlatList
          data={inputs}
          renderItem={renderItem(
            handleCommitInputName,
            handleToggleInputPostfix,
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
    onToggleGoodOrBad: (index: number) => void,
    onCommitCId: (index: number, newCId: string) => void,
    onRemoveInput: (index: number) => void,
  ): ListRenderItem<RateInput> =>
  itemInfo =>
    (
      <RatingInput
        itemInfo={itemInfo}
        onCommitInputName={onCommitInputName}
        onToggleGoodOrBad={onToggleGoodOrBad}
        onCommitCId={onCommitCId}
        onRemoveInput={onRemoveInput}
      />
    );

type RatingInputProps = {
  itemInfo: ListRenderItemInfo<RateInput>;
  onCommitInputName: (index: number, newInputName: string) => void;
  onToggleGoodOrBad: (index: number) => void;
  onCommitCId: (index: number, newCId: string) => void;
  onRemoveInput: (index: number) => void;
};
const RatingInput: FC<RatingInputProps> = props => {
  const {
    itemInfo,
    onCommitInputName,
    onToggleGoodOrBad,
    onCommitCId,
    onRemoveInput,
  } = props;
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
        inputName={item.item.id}
        goodOrBad={item.item.postfix}
        onToggleGoodOrBad={() => onToggleGoodOrBad(index)}
        categoryId={item.item.category}
        onCommitInputName={newInputName => handleCommitInputName(newInputName)}
        onCommitCId={newCId => handleCommitCId(newCId)}
        onDeleteCategoryRow={handleDeleteCategoryRow}
      />
    </MyPadding>
  );
};
