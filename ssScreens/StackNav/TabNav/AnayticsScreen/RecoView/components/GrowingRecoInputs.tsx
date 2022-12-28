import React, {FC, useCallback} from 'react';
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
} from '../../../../../../ssRedux/analyticsSlice/recoStatsSlice';

const createRenderItemComponent =
  (deleteInputNode: (index: number) => void) =>
  (handleChangeText: (newText: string, index: number) => void) =>
  ({item, index}: any) => {
    const handleChangeTextUseCallback = useCallback(
      (newText: string) => handleChangeText(newText, index),
      [],
    );

    return (
      <FlexRow>
        <AutoCompleteCategory
          clickOutsideId="GrowingRecoInputs"
          placeholder="Choose a past input..."
          inputValue={item.text}
          setInputValue={handleChangeTextUseCallback}
          onSelectEntityId={handleChangeTextUseCallback}
        />
        {/* <StyledTextInput
          placeholder={'Anotha one...'}
          value={item.text}
          onChangeText={(newText: string) => handleChangeText(newText, index)}
        /> */}

        <MyButton onPress={() => deleteInputNode(index)}>
          <MyText>X</MyText>
        </MyButton>
      </FlexRow>
    );
  };

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
  const genNextDataPlaceholder = (id: number) => ({id, text: ''});
  const handleAddInput = (id: number, newInputOption: string) => {
    dispatch(addRecommendationInput({id, text: newInputOption}));
  };
  const handleUpdateInput = (newText: string, index: number) => {
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    dispatch(editRecommendationInputs({index, text: newText}));
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
    <>
      {grownRecommendationInputs.map((item, index) => (
        <RI
          key={keyExtractor(item)}
          item={item}
          index={index}
          handleChangeText={handleChangeText}
        />
      ))}
    </>
  );
};

const RI = ({item, index, handleChangeText}: any) => {
  return (
    <AutoCompleteCategory
      clickOutsideId="GrowingRecoInputs"
      placeholder="Choose a past input..."
      inputValue={item.text}
      setInputValue={(newText: string) => handleChangeText(index, newText)}
      onSelectEntityId={(newText: string) => handleChangeText(index, newText)}
    />
  );
};

export default GrowingRecoInputs;
