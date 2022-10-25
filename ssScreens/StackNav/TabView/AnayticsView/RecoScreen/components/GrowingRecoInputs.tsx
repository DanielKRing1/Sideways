import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';
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
} from '../../../../../../ssRedux/analyticsSlice/recoStatsSlice';

const createRenderItemComponent =
  (deleteInputNode: (index: number) => void) =>
  (handleChangeText: (newText: string, index: number) => void) =>
  ({item, index}: any) =>
    (
      <FlexRow>
        <StyledTextInput
          placeholder={'Anotha one...'}
          value={item.title}
          onChangeText={(newText: string) => handleChangeText(newText, index)}
        />

        <MyButton onPress={() => deleteInputNode(index)}>
          <MyText>X</MyText>
        </MyButton>
      </FlexRow>
    );

type GrowingRecoInputsProps = {};
const GrowingRecoInputs: FC<GrowingRecoInputsProps> = () => {
  const dispatch = useDispatch();
  const {readSSSignature, recommendationInputs, recommendationsSignature} =
    useSelector((state: RootState) => ({
      ...state.readSidewaysSlice.toplevelReadReducer,
      ...state.analyticsSlice.recoStatsSlice,
    }));

  // HANDLER METHODS
  const keyExtractor = (dataPoint: RecoInput) => `${dataPoint.id}`;
  const genNextDataPlaceholder = (id: number) => ({id, text: ''});
  const handleAddInput = (id: number, newInputOption: string) => {
    dispatch(addRecommendationInput({id, text: newInputOption}));
  };
  const handleUpdateInput = (newText: string, index: number) => {
    recommendationInputs[index].text = newText;
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    dispatch(setRecommendationInputs(recommendationInputs));
  };

  return (
    <GrowingIdList
      data={recommendationInputs}
      createRenderItemComponent={createRenderItemComponent((index: number) =>
        dispatch(removeRecommendationInput(index)),
      )}
      keyExtractor={keyExtractor}
      genNextDataPlaceholder={genNextDataPlaceholder}
      handleUpdateInput={handleUpdateInput}
      handleAddInput={handleAddInput}
    />
  );
};

export default GrowingRecoInputs;

const StyledTextInput = styled(MyTextInput)`
  borderwidth: 1px;
  bordercolor: ${({theme}: {theme: DefaultTheme}) => theme.colors.grayBorder};
  paddingvertical: 25px;
  paddinghorizontal: 10px;
`;
