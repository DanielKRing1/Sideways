/**
 * On submit, SearchInput component adds to CategoryDriver
 *
 * When a new input is added, a new InputList renderItem/DbCategoryRow renders.
 * It composes DbCategoryRow, which removes from and adds to CategoryDriver via handleCommitInputName
 */

import React, {FC, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import CategoryDriver from 'ssDatabase/api/userJson/category';

import {useCounterId} from 'ssHooks/useCounterId';
import {RootState, AppDispatch} from 'ssRedux/index';
import {addInput as addInputR, RateInput} from 'ssRedux/rateSidewaysSlice';
import {addReplacementInput as addInputUR} from 'ssRedux/undorateSidewaysSlice';
import {UNASSIGNED_CATEGORY_ID} from 'ssDatabase/api/userJson/category/constants';
import {startRefreshInputNameToCategoryNameMapping} from 'ssRedux/userJson';
import {RATING_TYPE} from '../RatingMenu/types';
import {select} from 'ssUtils/selector';
import {inToLastCId} from 'ssDatabase/hardware/realm/userJson/utils/joins';
import {getStartingId} from 'ssUtils/id';
import {GOOD_POSTFIX, toggleNodePostfix} from 'ssDatabase/api/types';
import AutoCompleteDisplay, {
  AutoCompleteListProps,
} from 'ssComponents/CategoryRow/AutoComplete/AutoCompleteDisplay';
import NoInputsDisplay from './List/NoInputsDisplay';
import {DISPLAY_SIZE} from '../../../../../../../global';
import DbCategoryRow from 'ssComponents/CategoryRow/DbCategoryRow';
import MyPadding from 'ssComponents/ReactNative/MyPadding';

import {
  editInput as editInputR,
  removeInput as removeInputR,
} from 'ssRedux/rateSidewaysSlice';
import {
  editReplacementInput as editInputUR,
  removeReplacementInput as removeInputUR,
} from 'ssRedux/undorateSidewaysSlice';
import StickyScrollView from 'ssComponents/View/StickyScrollView';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

type RatingInputDisplayProps = {
  ratingType: RATING_TYPE;
};
const RatingInputDisplay: FC<RatingInputDisplayProps> = props => {
  // PROPS
  const {ratingType} = props;

  // LOCAL STATE
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // REDUX
  const {inputs: ratingInputs} = useSelector(
    (state: RootState) => state.rateSidewaysSlice,
  );
  const {inputs: undoratingInputs} = useSelector(
    (state: RootState) => state.undorateSidewaysSlice,
  );
  const {fullUserJsonMap} = useSelector(
    (state: RootState) => state.fetched.userJson,
  );
  // Select reducer value
  const [, inputs] = select(
    ratingType,
    [RATING_TYPE.Rate, ratingInputs],
    [RATING_TYPE.UndoRate, undoratingInputs],
  );
  // Select reducer action
  const [, addInput] = select(
    ratingType,
    [RATING_TYPE.Rate, addInputR],
    [RATING_TYPE.UndoRate, addInputUR],
  );
  // Select category selector
  const getInputCategory = (inputName: string) =>
    inToLastCId(inputName, fullUserJsonMap);
  const dispatch: AppDispatch = useDispatch();

  // IDS
  const {popId} = useCounterId(getStartingId(inputs, d => d.id));

  // HANDLERS
  // SearchInput
  const handleFocus = () => setIsSearching(true);
  const handleBlur = () => setIsSearching(false);
  // SearchInput
  const handleSubmitSearchInput = () => {
    console.log('HEEEERREEEE------------------------');
    console.log(searchInput);
    handleAddInput(searchInput);
  };

  // SearchSuggestions
  const handleSelectSuggestion = (selectedInputName: string) => {
    handleAddInput(selectedInputName);
  };

  const handleAddInput = (newInputName: string) => {
    newInputName = newInputName.toLocaleLowerCase();

    // Do not add an empty string as an input
    if (newInputName === '') {
      return;
    }

    // REDUX
    // 1. Create new id
    const newId: number = popId();
    // 2. Add the Redux InputList
    dispatch(
      addInput({
        id: newId,
        item: {
          id: newInputName,
          postfix: GOOD_POSTFIX,
          category: getInputCategory(newInputName),
        },
      }),
    );

    // 3. Reset searchInput
    setSearchInput('');

    // DB
    // 4. Add new inputName
    // **Will not add inputName if inputName === ''
    CategoryDriver.addInputCategory({
      inputId: newInputName,
      categoryId: UNASSIGNED_CATEGORY_ID,
    });

    dispatch(startRefreshInputNameToCategoryNameMapping());
  };

  console.log(
    'IS SEARCHING-----------------------------------: ' + isSearching,
  );

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <AutoCompleteDisplay
        placeholder={'Add an input'}
        value={searchInput}
        onChangeText={setSearchInput}
        onSubmitEditing={handleSubmitSearchInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data={inputs}
        onSelectEntityId={handleSelectSuggestion}
        ListRenderItem={({item, index}) => (
          <RatingInput item={item} index={index} ratingType={ratingType} />
        )}
        NoInputsDisplay={NoInputsDisplay}
      />
    </ScrollView>
  );
};

export default RatingInputDisplay;

type RatingInputProps = AutoCompleteListProps<RateInput> & {
  ratingType: RATING_TYPE;
};
const RatingInput: FC<RatingInputProps> = props => {
  // PROPS
  const {item, index, ratingType} = props;

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
  const handleCommitInputName = (newInputName: string) => {
    dispatch(
      editInput({
        index,
        input: {
          ...item,
          item: {
            ...item.item,
            id: newInputName,
          },
        },
      }),
    );
  };
  const handleToggleInputPostfix = () => {
    dispatch(
      editInput({
        index,
        input: {
          ...item,
          item: {
            ...item.item,
            postfix: toggleNodePostfix(item.item.postfix),
          },
        },
      }),
    );
  };

  const handleCommitCId = (newCId: string) => {
    dispatch(
      editInput({
        index,
        input: {
          ...item,
          item: {
            ...item.item,
            category: newCId,
          },
        },
      }),
    );
  };

  const handleDeleteCategoryRow = () => dispatch(removeInput(index));

  return (
    <MyPadding
      baseSize={DISPLAY_SIZE.xs}
      rightSize={DISPLAY_SIZE.sm}
      leftSize={DISPLAY_SIZE.sm}>
      <DbCategoryRow
        inputName={item.item.id}
        goodOrBad={item.item.postfix}
        onToggleGoodOrBad={handleToggleInputPostfix}
        categoryId={item.item.category}
        onCommitInputName={handleCommitInputName}
        onCommitCId={handleCommitCId}
        onDeleteCategoryRow={handleDeleteCategoryRow}
      />
    </MyPadding>
  );
};
