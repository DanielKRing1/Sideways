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

import React, {FC, memo, useEffect, useMemo} from 'react';

import CategoryDriver from 'ssDatabase/api/userJson/category';
import GlobalDriver from 'ssDatabase/api/userJson/globalDriver';

import BaseCategoryRow, {BaseCategoryRowProps} from './BaseCategoryRow';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'ssRedux/index';
import {inToLastCId, snToCSId} from 'ssDatabase/hardware/realm/userJson/utils';
import {
  startRefreshCategoryMapping,
  startRefreshInputNameToCategoryNameMapping,
} from 'ssRedux/userJson';
import {AvailableIcons} from 'ssDatabase/api/userJson/constants';
import {HexColor} from '../../global';

type DbCategoryRowProps = Omit<
  BaseCategoryRowProps,
  'categoryId' | 'activeSliceName' | 'fullUserJsonMap'
>;
const DbCategoryRow: FC<DbCategoryRowProps> = props => {
  const {inputName, onCommitInputName, onDeleteCategoryRow} = props;

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
  // Do we want ton change the category when the user changes the input name??
  const categoryId: string = useMemo(
    () => inToLastCId(inputName, fullUserJsonMap),
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

  const handleCommitCategoryColor = (newColor: HexColor) => {
    // Db
    // 1. Update CategoryDecortion.color
    GlobalDriver.editCD(snToCSId(activeSliceName, fullUserJsonMap)!, {
      categoryId,
      color: newColor,
    });

    // Redux
    // 2. Update UserJsonMap
    dispatch(startRefreshCategoryMapping());
  };
  const handleCommitCategoryIcon = (newIconName: AvailableIcons) => {
    // Db
    // 1. Update CategoryDecortion.icon
    GlobalDriver.editCD(snToCSId(activeSliceName, fullUserJsonMap)!, {
      categoryId,
      icon: newIconName,
    });

    // Redux
    // 2. Update UserJsonMap
    dispatch(startRefreshCategoryMapping());
  };

  return (
    <BaseCategoryRow
      {...props}
      categoryId={categoryId}
      activeSliceName={activeSliceName}
      fullUserJsonMap={fullUserJsonMap}
      onCommitInputName={handleCommitInputName}
      onDeleteCategoryRow={handleDeleteCategoryRow}
      onCommitColor={handleCommitCategoryColor}
      onCommitIcon={handleCommitCategoryIcon}
    />
  );
};

export default memo<DbCategoryRowProps>(DbCategoryRow);
