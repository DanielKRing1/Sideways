import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AutoCompleteCategory from 'ssComponents/CategoryRow/AutoCompleteCategory';
import DbCategoryRow from 'ssComponents/CategoryRow/DbCategoryRow';
import {useCounterId} from 'ssHooks/useCounterId';
import {getStartingId} from 'ssUtils/id';

// REDUX
import {RootState} from '../../../../../../ssRedux';
import {
  addRecommendationInput,
  RecoInput,
  editRecommendationInputs,
  removeRecommendationInput,
  editSearchInput,
} from '../../../../../../ssRedux/analyticsSlice/recoStatsSlice';

type GrowingRecoInputsProps = {};
const GrowingRecoInputs: FC<GrowingRecoInputsProps> = () => {
  const dispatch = useDispatch();
  const {readSSSignature} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {searchInput, recommendationInputs, recommendationsSignature} =
    useSelector((state: RootState) => state.analyticsSlice.recoStatsSlice);

  // HANDLER METHODS
  const keyExtractor = (dataPoint: RecoInput) => `${dataPoint.id}`;
  const handleAddInput = (newInputOption: string) => {
    const id: number = popId();
    dispatch(addRecommendationInput({id, text: newInputOption}));
  };
  const handleDeleteInput = (index: number): void => {
    dispatch(removeRecommendationInput(index));
  };
  const handleUpdateInput = (newText: string, index: number) => {
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    if (newText === '') handleDeleteInput(index);
    else dispatch(editRecommendationInputs({index, text: newText}));
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
      handleUpdateInput(newText, index);
    } else {
      handleAddInput(newText);
    }
  };

  return (
    <>
      <>
        {grownRecommendationInputs.map((item, index) => (
          <DbCategoryRow
            editable={false}
            key={item.id}
            inputName={item.text}
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
        filterSuggestions={(all: string[]) => {
          const exisiting = new Set(
            recommendationInputs.map((ri: RecoInput) => ri.text),
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
