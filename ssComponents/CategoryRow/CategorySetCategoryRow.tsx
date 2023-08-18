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
import {editC, removeC} from 'ssRedux/input/createCategorySet';
import {UserJsonMap} from 'ssDatabase/api/userJson/types';
import {DEFAULT_CREATE_CS_ACTIVE_SLICE} from 'ssScreens/StackNav/AddCategorySet/components/GrowingCategorySet';
import {GJ_COLLECTION_ROW_KEY} from 'ssDatabase/api/userJson/globalDriver/types';

type CategorySetCategoryRowProps = Omit<
  BaseCategoryRowProps,
  'inputName' | 'activeSliceName' | 'fullUserJsonMap'
> & {csUserJsonMap: UserJsonMap; categoryId?: string};
const CategorySetCategoryRow: FC<CategorySetCategoryRowProps> = props => {
  const {categoryId, csUserJsonMap} = props;

  // REDUX
  const dispatch: AppDispatch = useDispatch();

  // HANDLERS
  const handleDeleteCategoryRow = () => {
    // Db
    // 1. Decrement original inputName counter (and delete if counter <= 0)
    dispatch(removeC(categoryId));
  };

  const handleCommitCId = (newCId: string) => {};
  const handleCommitIcon = (icon: AvailableIcons) => {
    // Redux
    // 1. Update CategoryDecortion.icon
    dispatch(editC({cId: categoryId, partialUserCD: {icon}}));
  };
  const handleCommitColor = (color: HexColor) => {
    // Db
    // 1. Update CategoryDecortion.color
    dispatch(editC({cId: categoryId, partialUserCD: {color}}));
  };

  return (
    <BaseCategoryRow
      {...props}
      inputName={
        csUserJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_NAME_MAPPING][categoryId]
      }
      categoryId={categoryId}
      activeSliceName={DEFAULT_CREATE_CS_ACTIVE_SLICE}
      fullUserJsonMap={csUserJsonMap}
      onDeleteCategoryRow={handleDeleteCategoryRow}
      onCommitCId={handleCommitCId}
      onCommitColor={handleCommitColor}
      onCommitIcon={handleCommitIcon}
    />
  );
};

export default memo<CategorySetCategoryRowProps>(CategorySetCategoryRow);
