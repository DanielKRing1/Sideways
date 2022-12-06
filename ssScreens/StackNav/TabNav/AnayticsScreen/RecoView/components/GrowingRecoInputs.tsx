import React, {FC, useCallback, useEffect, useMemo} from 'react';
import {FlatList, TextInput} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AutoCompleteCategory from 'ssComponents/CategoryRow/AutoCompleteCategory';
import AutoCompleteDecoration from 'ssComponents/CategoryRow/AutoCompleteCategory';
import {useCounterId} from 'ssHooks/useCounterId';
import styled, {DefaultTheme} from 'styled-components/native';
import {FlexRow} from '../../../../../../ssComponents/Flex';

// MY COMPONENTS
import GrowingIdList from '../../../../../../ssComponents/Input/GrowingIdList';
import MyButton from '../../../../../../ssComponents/ReactNative/MyButton';
import MyText from '../../../../../../ssComponents/ReactNative/MyText';
import MyTextInput from '../../../../../../ssComponents/ReactNative/MyTextInput';

// REDUX
import {RootState} from '../../../../../../ssRedux';
import {
  setRecommendationInputs,
  addRecommendationInput,
  removeRecommendationInput,
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

  const cric = useMemo(
    () =>
      createRenderItemComponent((index: number) =>
        dispatch(removeRecommendationInput(index)),
      ),
    [],
  );

  // const {peekId, popId: _popId} = useCounterId(0);
  // const popId = useCallback(() => _popId(), []);
  const {peekId, popId} = useCounterId(0);

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
    // <RI
    //   item={recommendationInputs}
    //   recommendationInputs={recommendationInputs}
    //   popId={popId}
    //   handleUpdateInput={handleUpdateInput}
    //   handleAddInput={handleAddInput}
    // />
    <FlatList
      keyboardShouldPersistTaps="always"
      data={grownRecommendationInputs}
      renderItem={({item, index}) => (
        <RI item={item} index={index} handleChangeText={handleChangeText} />
      )}
      keyExtractor={keyExtractor}
    />
    // <GrowingIdList
    //   data={recommendationInputs}
    //   createRenderItemComponent={cric}
    //   keyExtractor={keyExtractor}
    //   genNextDataPlaceholder={genNextDataPlaceholder}
    //   handleUpdateInput={handleUpdateInput}
    //   handleAddInput={handleAddInput}
    // />
  );
};

const RI = ({item, index, handleChangeText}: any) => {
  return (
    // <TextInput
    //   placeholder="Choose a past input..."
    //   value={item.text}
    //   onChangeText={(newText: string) => handleChangeText(index, newText)}
    // />

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

const StyledTextInput = styled(MyTextInput)`
  border-width: 1px;
  bordercolor: ${({theme}: {theme: DefaultTheme}) => theme.colors.grayBorder};
  paddingvertical: 25px;
  paddinghorizontal: 10px;
`;
