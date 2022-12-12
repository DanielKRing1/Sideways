import React, {FC} from 'react';
import {FlatList, ListRenderItem, ListRenderItemInfo} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {AppDispatch, RootState} from 'ssRedux/index';
import {removeInput, setInputs} from 'ssRedux/rateSidewaysSlice';
import {GrowingIdText} from 'ssComponents/Input/GrowingIdList';
import DbCategoryRow from 'ssComponents/CategoryRow/DbCategoryRow';
import NoInputsDisplay from './NoInputsDisplay';
import MyPadding from 'ssComponents/ReactNative/MyPadding';
import {DISPLAY_SIZE} from '../../../../../../../../global';

type RatingInputListProps = {
  inputs: GrowingIdText[];
  onEditInputName: (id: number, newInputName: string) => void;
  onDeleteCategoryRow: (id: number) => void;
};
const RatingInputList: FC<RatingInputListProps> = props => {
  const {inputs, onEditInputName, onDeleteCategoryRow} = props;

  return (
    <>
      {inputs.length > 0 ? (
        <FlatList
          data={inputs}
          renderItem={renderItem(onEditInputName, onDeleteCategoryRow)}
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
    onDeleteCategoryRow: (index: number) => void,
  ): ListRenderItem<GrowingIdText> =>
  itemInfo =>
    (
      <RatingInput
        itemInfo={itemInfo}
        onCommitInputName={onCommitInputName}
        onDeleteCategoryRow={onDeleteCategoryRow}
      />
    );

type RatingInputProps = {
  itemInfo: ListRenderItemInfo<GrowingIdText>;
  onCommitInputName: (index: number, newInputName: string) => void;
  onDeleteCategoryRow: (index: number) => void;
};
const RatingInput: FC<RatingInputProps> = props => {
  const {itemInfo, onCommitInputName, onDeleteCategoryRow} = props;
  const {item, index} = itemInfo;

  // HANDLERS
  const handleCommitInputName = (newInputName: string) => {
    onCommitInputName(index, newInputName);
  };

  const handleDeleteCategoryRow = () => {
    onDeleteCategoryRow(index);
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
