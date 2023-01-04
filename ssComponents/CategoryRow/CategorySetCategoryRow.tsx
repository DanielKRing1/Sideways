/**
 * This CategorySetCategoryRow writes directly to the Db for each commit
 *
 */

/**
 * CategoryName
 * // Receive initial state
 * 1. Receive inputName prop, stored in parent state
 *
 * // Local state
 * 2. EditablText caches 'localCategoryName' in its local state
 *
 * // Edits
 * 3. Edits to inputName in the CategorySetCategoryRow (via EditableText) occur on the 'localCategoryName'
 *
 * // Commits
 * 4. Upon clicking out of EditableText, commit 'localCategoryName' to Db
 */

import React, {FC, memo} from 'react';

import BaseCategoryRow, {BaseCategoryRowProps} from './BaseCategoryRow';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'ssRedux/index';
import {AvailableIcons} from 'ssDatabase/api/userJson/constants';
import {HexColor} from '../../global';
import {editC, removeC} from 'ssRedux/createCategorySetSlice';
import {UserJsonMap} from 'ssDatabase/api/userJson/types';
import {DEFAULT_CREATE_CS_ACTIVE_SLICE} from 'ssScreens/StackNav/AddSliceScreen/components/AddCategorySet';

type CategorySetCategoryRowProps = Omit<
  BaseCategoryRowProps,
  'categoryId' | 'activeSliceName' | 'fullUserJsonMap'
> & {csUserJsonMap: UserJsonMap; categoryId?: string};
const CategorySetCategoryRow: FC<CategorySetCategoryRowProps> = props => {
  const {inputName, csUserJsonMap} = props;

  // REDUX
  const dispatch: AppDispatch = useDispatch();

  // HANDLERS
  // So this component's interaction with the db is entirely self-sufficient
  const handleCommitCategoryName = (newCategoryName: string) => {
    // 1. Change input key in redux
    dispatch(editC({cName: inputName, partialUserCD: {name: newCategoryName}}));
  };

  const handleDeleteCategoryRow = () => {
    // Db
    // 1. Decrement original inputName counter (and delete if counter <= 0)
    removeC(inputName);
  };

  const handleCommitCId = (newCId: string) => {};
  const handleCommitIcon = (icon: AvailableIcons) => {
    // Redux
    // 1. Update CategoryDecortion.icon
    dispatch(editC({cName: inputName, partialUserCD: {icon}}));
  };
  const handleCommitColor = (color: HexColor) => {
    // Db
    // 1. Update CategoryDecortion.color
    dispatch(editC({cName: inputName, partialUserCD: {color}}));
  };

  return (
    <BaseCategoryRow
      {...props}
      categoryId={inputName}
      activeSliceName={DEFAULT_CREATE_CS_ACTIVE_SLICE}
      fullUserJsonMap={csUserJsonMap}
      onCommitInputName={handleCommitCategoryName}
      onDeleteCategoryRow={handleDeleteCategoryRow}
      onCommitCId={handleCommitCId}
      onCommitColor={handleCommitColor}
      onCommitIcon={handleCommitIcon}
    />
  );
};

export default memo<CategorySetCategoryRowProps>(CategorySetCategoryRow);
