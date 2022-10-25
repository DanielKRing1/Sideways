import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import DecorationRow from 'ssComponents/DecorationRow/DecorationRow';
import {FlexRow} from 'ssComponents/Flex';
import MyButton from 'ssComponents/ReactNative/MyButton';
import MyText from 'ssComponents/ReactNative/MyText';
import {DECORATION_ROW_KEY} from 'ssDatabase/api/types';
import styled, {DefaultTheme} from 'styled-components/native';
import GrowingIdList from '../../../../../ssComponents/Input/GrowingIdList';
import MyTextInput from '../../../../../ssComponents/ReactNative/MyTextInput';

// REDUX
import {RootState} from '../../../../../ssRedux';
import {
  addInput,
  setInputs,
  removeInput,
  forceSignatureRerender,
  RateInput,
} from '../../../../../ssRedux/rateSidewaysSlice';

const StyledTextInput = styled(MyTextInput)`
  borderwidth: 1px;
  bordercolor: ${({theme}: {theme: DefaultTheme}) => theme.colors.grayBorder};
  paddingvertical: 25px;
  paddinghorizontal: 10px;
`;

const createInputsRenderItemComponent =
  (deleteInput: (index: number) => void) =>
  (handleChangeText: (newText: string, index: number) => void) =>
  ({item, index}: {item: RateInput; index: number}) =>
    (
      <FlexRow>
        <DecorationRow
          placeholder="Add an input..."
          rowKey={DECORATION_ROW_KEY.INPUT}
          entityId={item.text}
          onEditEntityId={(newText: string) => handleChangeText(newText, index)}
        />
        {/* <StyledTextInput
            placeholder={'Anotha input...'}
            value={item.text}
            onChangeText={(newText: string) => handleChangeText(newText, index)}
        /> */}

        <MyButton onPress={() => deleteInput(index)}>
          <MyText>X</MyText>
        </MyButton>
      </FlexRow>
    );

const GrowingInputList: FC = () => {
  // REDUX
  const {ratedSignature, inputs} = useSelector(
    (state: RootState) => state.rateSidewaysSlice,
  );
  const dispatch = useDispatch();

  // HANDLER METHODS
  const keyExtractor = (dataPoint: RateInput) => `${dataPoint.id}`;
  const genNextDataPlaceholder = (id: number) => ({id, text: ''});
  const handleAddInput = (id: number, newInputOption: string) => {
    dispatch(addInput({id, text: newInputOption}));
  };
  const handleUpdateInput = (newText: string, index: number) => {
    inputs[index].text = newText;
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    dispatch(setInputs(inputs));
  };

  return (
    <GrowingIdList
      data={inputs}
      createRenderItemComponent={createInputsRenderItemComponent(
        (index: number) => dispatch(removeInput(index)),
      )}
      keyExtractor={keyExtractor}
      genNextDataPlaceholder={genNextDataPlaceholder}
      handleUpdateInput={handleUpdateInput}
      handleAddInput={handleAddInput}
    />
  );
};

export default GrowingInputList;
