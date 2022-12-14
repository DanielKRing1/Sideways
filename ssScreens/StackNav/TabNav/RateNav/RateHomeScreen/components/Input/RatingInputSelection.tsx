/**
 * On submit, SearchInput component adds to CategoryDriver
 *
 * When a new input is added, a new InputList renderItem/DbCategoryRow renders.
 * It composes DbCategoryRow, which removes from and adds to CategoryDriver via handleCommitInputName
 */

import React, {FC, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import CategoryDriver from 'ssDatabase/api/userJson/category';

import SearchInput from './Search/SearchInput';
import SearchSuggestions from './Search/SearchSuggestions';
import InputList from './List/InputList';
import {useCounterId} from 'ssHooks/useCounterId';
import {RootState, AppDispatch} from 'ssRedux/index';
import {addInput as addInputR} from 'ssRedux/rateSidewaysSlice';
import {addReplacementInput as addInputUR} from 'ssRedux/undorateSidewaysSlice';
import {UNASSIGNED_CATEGORY_ID} from 'ssDatabase/api/userJson/category/constants';
import {startRefreshInputNameToCategoryNameMapping} from 'ssRedux/userJson';
import {RATING_TYPE} from '../RatingMenu/types';
import {select} from 'ssUtils/selector';

type RatingInputSelectionProps = {
  ratingType: RATING_TYPE;
};
const RatingInputSelection: FC<RatingInputSelectionProps> = props => {
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
  const dispatch: AppDispatch = useDispatch();

  // IDS
  const {popId} = useCounterId(
    // Get starting id
    inputs.reduce((acc, cur) => Math.max(cur.id + 1, acc), 0),
  );

  // HANDLERS
  // SearchInput
  const handleFocus = () => setIsSearching(true);
  const handleBlur = () => setIsSearching(false);
  // SearchInput
  const handleSubmitSearchInput = () => {
    handleAddInput(searchInput);
  };

  // SearchSuggestions
  const handleSelectSuggestion = (selectedInputName: string) => {
    handleAddInput(selectedInputName);
  };

  const handleAddInput = (newInputName: string) => {
    // Do not add an empty string as an input
    if (newInputName === '') return;

    // REDUX
    // 1. Create new id
    const newId: number = popId();
    // 2. Add the Redux InputList
    dispatch(addInput({id: newId, text: newInputName}));

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

  return (
    <>
      <SearchInput
        ref={null}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitSearchInput={handleSubmitSearchInput}
      />

      {isSearching ? (
        <SearchSuggestions
          searchInput={searchInput}
          onSelectSuggestion={handleSelectSuggestion}
        />
      ) : (
        <InputList ratingType={ratingType} inputs={inputs} />
      )}
    </>
  );
};

export default RatingInputSelection;
