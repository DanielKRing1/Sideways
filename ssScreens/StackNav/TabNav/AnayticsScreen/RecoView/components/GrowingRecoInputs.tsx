import React, {FC} from 'react';
import {FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AutoCompleteCategory from 'ssComponents/CategoryRow/AutoCompleteCategory';
import MyText from 'ssComponents/ReactNative/MyText';
import {useCounterId} from 'ssHooks/useCounterId';
import {getStartingId} from 'ssUtils/id';
import {FlexRow} from '../../../../../../ssComponents/Flex';

// MY COMPONENTS
import MyButton from '../../../../../../ssComponents/ReactNative/MyButton';

// REDUX
import {RootState} from '../../../../../../ssRedux';
import {
  addRecommendationInput,
  RecoInput,
  editRecommendationInputs,
  removeRecommendationInput,
} from '../../../../../../ssRedux/analyticsSlice/recoStatsSlice';

type GrowingRecoInputsProps = {};
const GrowingRecoInputs: FC<GrowingRecoInputsProps> = () => {
  const dispatch = useDispatch();
  const {readSSSignature} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {recommendationInputs, recommendationsSignature} = useSelector(
    (state: RootState) => state.analyticsSlice.recoStatsSlice,
  );

  // HANDLER METHODS
  const keyExtractor = (dataPoint: RecoInput) => `${dataPoint.id}`;
  const handleAddInput = (id: number, newInputOption: string) => {
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
    {id: peekId(), text: ''},
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
      const newId = popId();
      handleAddInput(newId, newText);
    }
  };

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      data={grownRecommendationInputs}
      renderItem={({item, index}) => (
        <RI
          item={item}
          index={index}
          handleChangeText={handleChangeText}
          handleDeleteInput={handleDeleteInput}
        />
      )}
      keyExtractor={keyExtractor}
    />
  );
};

const RI = ({item, index, handleChangeText, deleteInputNode}: any) => {
  return (
    <FlexRow>
      <AutoCompleteCategory
        placeholder="Choose a past input..."
        inputValue={item.text}
        setInputValue={(newText: string) => handleChangeText(index, newText)}
        onSelectEntityId={(newText: string) => handleChangeText(index, newText)}
      />
    </FlexRow>
  );
};

export default GrowingRecoInputs;
