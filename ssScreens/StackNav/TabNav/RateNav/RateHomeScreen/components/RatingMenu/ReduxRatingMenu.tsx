import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {AppDispatch, RootState} from 'ssRedux/index';
import {
  addInput,
  removeInput,
  setInputs,
  setOutputs,
  setRating,
} from 'ssRedux/rateSidewaysSlice';

import RatingMenu from './BaseRatingMenu';

type ReduxRatingMenuProps = {};
const ReduxRatingMenu: FC<ReduxRatingMenuProps> = props => {
  // REDUX
  const {inputs, outputs, rating} = useSelector(
    (state: RootState) => state.rateSidewaysSlice,
  );
  const dispatch: AppDispatch = useDispatch();

  // INPUTS-----------------
  const handleAddInput = (newId: number, newInputName: string) => {
    // Add the Redux InputList
    dispatch(addInput({id: newId, text: newInputName}));
  };
  const handleEditInput = (index: number, newInputName: string) => {
    const inputsCopy = [...inputs];
    inputsCopy[index] = {
      ...inputsCopy[index],
      text: newInputName,
    };
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    dispatch(setInputs(inputsCopy));
  };
  const handleDeleteCategoryRow = (index: number) => {
    dispatch(removeInput(index));
  };

  // OUTPUTS---------------
  const handleSetOutputs = (selectedOutputs: string[]) =>
    dispatch(setOutputs(Array.from(selectedOutputs)));

  // RATING----------------
  const handleSetRating = (newRating: number) => dispatch(setRating(newRating));

  return (
    <RatingMenu
      inputs={inputs}
      onAddInput={handleAddInput}
      onEditInput={handleEditInput}
      onDeleteCategoryRow={handleDeleteCategoryRow}
      outputs={outputs}
      onSetOutputs={handleSetOutputs}
      rating={rating}
      onSetRating={handleSetRating}
    />
  );
};

export default ReduxRatingMenu;
