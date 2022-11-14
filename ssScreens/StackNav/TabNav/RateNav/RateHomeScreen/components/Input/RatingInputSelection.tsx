import React, {FC, useState} from 'react';

import SearchInput from './Search/SearchInput';
import SearchSuggestions from './Search/SearchSuggestions';
import InputList from './List/InputList';
import {useSelector, useDispatch} from 'react-redux';
import {useCounterId} from 'ssHooks/useCounterId';
import {RootState, AppDispatch} from 'ssRedux/index';
import {addInput} from 'ssRedux/rateSidewaysSlice';

type RatingInputSelectionProps = {};
const RatingInputSelection: FC<RatingInputSelectionProps> = props => {
  // LOCAL STATE
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // REDUX
  const {inputs} = useSelector((state: RootState) => state.rateSidewaysSlice);
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
  const handleSubmitSearchInput = () => {
    // 1. Create new id
    const newId: number = popId();
    // 2. Add the Redux InputList
    dispatch(addInput({id: newId, text: searchInput}));

    // 3. Reset newInput
    setSearchInput('');
  };

  // SearchSuggestions
  const handleSelectSuggestion = (selectedInputName: string) => {
    setSearchInput(selectedInputName);

    handleSubmitSearchInput();
  };

  return (
    <>
      <SearchInput
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
        <InputList />
      )}
    </>
  );
};

export default RatingInputSelection;
