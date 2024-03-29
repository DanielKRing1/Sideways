/**
 * This DbCategoryRow writes directly to the Db for each commit
 *
 */

/**
 * InputName
 * // Receive initial state
 * 1. Receive inputName prop, stored in parent state
 *
 * // Local state
 * 2. EditablText caches 'localInputName' in its local state
 *
 * // Edits
 * 3. Edits to inputName in the DbCategoryRow (via EditableText) occur on the 'localInputName'
 *
 * // Commits
 * 4. Upon clicking out of EditableText, commit 'localInputName' to Db
 */

import React, {forwardRef, memo, useMemo} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import CategoryDriver from 'ssDatabase/api/userJson/category';
import GlobalDriver from 'ssDatabase/api/userJson/globalDriver';

import BaseCategoryRow, {BaseCategoryRowProps} from './BaseCategoryRow';
import {AppDispatch, RootState} from 'ssRedux/index';
import {inToLastCId, snToCSId} from 'ssDatabase/hardware/realm/userJson/utils';
import {
  startRefreshCategoryMapping,
  startRefreshInputNameToCategoryNameMapping,
} from 'ssRedux/userJson';
import {AvailableIcons} from 'ssDatabase/api/userJson/constants';
import {HexColor} from '../../global';

interface DbCategoryRowProps
  extends Omit<
    BaseCategoryRowProps,
    'categoryId' | 'activeSliceName' | 'fullUserJsonMap'
  > {
  categoryId?: string;
}
const DbCategoryRow = forwardRef<View, DbCategoryRowProps>((props, ref) => {
  const {
    inputName,
    categoryId: categoryIdProp,
    onCommitInputName,
    onCommitCId = () => {},
    onDeleteCategoryRow,
  } = props;

  // REDUX
  const {activeSliceName} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {fullUserJsonMap, userJsonSignature} = useSelector(
    (state: RootState) => state.userJsonSlice,
  );
  const dispatch: AppDispatch = useDispatch();

  // EFFECTS

  // MEMO
  const categoryId =
    categoryIdProp !== undefined
      ? categoryIdProp
      : useMemo(
          () => inToLastCId(inputName, fullUserJsonMap, 'dbcategoryrow'),
          [inputName, fullUserJsonMap],
        );

  // HANDLERS
  const handleUpdateInputCategory = (newInputName: string) => {
    // Db
    // 1. Decrement original inputName counter (and delete if counter <= 0)
    console.log(1);
    CategoryDriver.rmInputCategories([inputName]);
    // 2. Add new inputName
    // **Will not add inputName if inputName === ''
    console.log(2);
    CategoryDriver.addInputCategory({
      inputId: newInputName,
      categoryId,
    });
  };
  // So this component's interaction with the db is entirely self-sufficient
  const handleCommitInputName = (newInputName: string) => {
    handleUpdateInputCategory(newInputName);

    // 3. Update inputName in parent component
    console.log(3);
    onCommitInputName(newInputName);

    // Redux
    // 4. Update UserJsonMap
    console.log(4);
    dispatch(startRefreshInputNameToCategoryNameMapping());
  };

  const handleDeleteCategoryRow = () => {
    // Db
    // 1. Decrement original inputName counter (and delete if counter <= 0)
    CategoryDriver.rmInputCategories([inputName]);

    // 3. Update inputName in parent component
    onDeleteCategoryRow();

    // Redux
    // 4. Update UserJsonMap
    dispatch(startRefreshInputNameToCategoryNameMapping());
  };

  const handleCommitCId = (newCId: string) => {
    // Db
    // 1. Update input name -> categoryId mapping
    CategoryDriver.editInputCategory({inputId: inputName, categoryId: newCId});

    // 2. Update categoryId in parent component
    onCommitCId(newCId);

    // Redux
    // 3. Update UserJsonMap
    dispatch(startRefreshInputNameToCategoryNameMapping());
  };
  const handleCommitIcon = (newIcon: AvailableIcons) => {
    // Db
    // 1. Update CategoryDecortion.color
    GlobalDriver.editCD(snToCSId(activeSliceName, fullUserJsonMap)!, {
      cId: categoryId,
      icon: newIcon,
    });

    // Redux
    // 2. Update UserJsonMap
    dispatch(startRefreshCategoryMapping());
  };
  const handleCommitColor = (newColor: HexColor) => {
    // Db
    // 1. Update CategoryDecortion.color
    GlobalDriver.editCD(snToCSId(activeSliceName, fullUserJsonMap)!, {
      cId: categoryId,
      color: newColor,
    });

    // Redux
    // 2. Update UserJsonMap
    dispatch(startRefreshCategoryMapping());

    // console.log('DBCATEGORYROW RERENDERED');
  };

  return (
    <BaseCategoryRow
      {...props}
      categoryId={categoryId}
      activeSliceName={activeSliceName}
      fullUserJsonMap={fullUserJsonMap}
      onCommitInputName={handleCommitInputName}
      onDeleteCategoryRow={handleDeleteCategoryRow}
      onCommitCId={handleCommitCId}
      onCommitColor={handleCommitColor}
      onCommitIcon={handleCommitIcon}
    />
  );
});

export default memo<DbCategoryRowProps>(DbCategoryRow);
