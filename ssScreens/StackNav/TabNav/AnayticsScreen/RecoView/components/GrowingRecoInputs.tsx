import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AutoCompleteCategory from 'ssComponents/CategoryRow/AutoComplete/AutoCompleteCategory';
import DbCategoryRow from 'ssComponents/CategoryRow/DbCategoryRow';
import {GOOD_POSTFIX, toggleNodePostfix} from 'ssDatabase/api/types';
import {useCounterId} from 'ssHooks/useCounterId';
import {getStartingId} from 'ssUtils/id';

// REDUX
import {RootState} from '../../../../../../ssRedux';
import {
  addRecommendationInput,
  RecoInput,
  editRecommendationInput,
  removeRecommendationInput,
  editSearchInput,
} from '../../../../../../ssRedux/analyticsSlice/recoStatsSlice';

type GrowingRecoInputsProps = {};
const GrowingRecoInputs: FC<GrowingRecoInputsProps> = () => {
  const dispatch = useDispatch();
  const {readSSSignature} = useSelector(
    (state: RootState) => state.appState.activeJournal,
  );
  const {searchInput, recommendationInputs, recommendationsSignature} =
    useSelector((state: RootState) => state.analyticsSlice.recoStatsSlice);

  // HANDLER METHODS
  const keyExtractor = (dataPoint: RecoInput) => `${dataPoint.id}`;
  const handleAddInput = (newInputOption: string) => {
    const id: number = popId();
    dispatch(
      addRecommendationInput({
        id,
        item: {id: newInputOption, postfix: GOOD_POSTFIX},
      }),
    );
  };
  const handleDeleteInput = (index: number): void => {
    dispatch(removeRecommendationInput(index));
  };
  const handleUpdateInput = (newInput: RecoInput, index: number) => {
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    if (newInput.item.id === '') {
      handleDeleteInput(index);
    } else {
      dispatch(editRecommendationInput({index, input: newInput}));
    }
  };

  console.log('RECOMMENDATION INPUTS----------------------');
  console.log(recommendationInputs);

  const {peekId, popId} = useCounterId(
    getStartingId(recommendationInputs, d => d.id),
  );

  const grownRecommendationInputs = [
    ...recommendationInputs,
    // {id: peekId(), text: ''},
  ];

  const handleChangeText = (index: number, newText: string) => {
    console.log(
      'HANDLECHANGETEXT ----------------------------------------------------------',
    );
    console.log(index);
    console.log(newText);
    console.log(recommendationInputs);
    if (index < recommendationInputs.length) {
      handleUpdateInput(
        {
          ...recommendationInputs[index],
          item: {
            ...recommendationInputs[index].item,
            id: newText,
          },
        },
        index,
      );
    } else {
      handleAddInput(newText);
    }
  };
  const handleToggleGoodOrBad = (index: number) => {
    handleUpdateInput(
      {
        ...recommendationInputs[index],
        item: {
          ...recommendationInputs[index].item,
          postfix: toggleNodePostfix(recommendationInputs[index].item.postfix),
        },
      },
      index,
    );
  };

  return (
    <>
      <>
        {grownRecommendationInputs.map((growingRecommendationInput, index) => (
          <DbCategoryRow
            editable={false}
            key={growingRecommendationInput.id}
            inputName={growingRecommendationInput.item.id}
            goodOrBad={growingRecommendationInput.item.postfix}
            onToggleGoodOrBad={() => handleToggleGoodOrBad(index)}
            onCommitInputName={(newText: string) =>
              handleChangeText(index, newText)
            }
            onDeleteCategoryRow={() => handleDeleteInput(index)}
          />
        ))}
      </>
      <AutoCompleteCategory
        placeholder="Choose a past input..."
        value={searchInput}
        onChangeText={(newText: string) => dispatch(editSearchInput(newText))}
        onSubmitEditing={() => handleAddInput(searchInput)}
        // Do not suggest already-selected ids
        filterSuggestions={(all: string[]) => {
          const exisiting = new Set(
            recommendationInputs.map((ri: RecoInput) => ri.item.id),
          );
          return all.filter((suggestion: string) => !exisiting.has(suggestion));
        }}
        onSelectEntityId={(selectedText: string) =>
          handleAddInput(selectedText)
        }
      />
    </>
  );
};

export default GrowingRecoInputs;
