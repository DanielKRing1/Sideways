import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled, {DefaultTheme} from 'styled-components/native';

import GrowingIdList from '../../../../../ssComponents/Input/GrowingIdList';
import {FlexRow} from 'ssComponents/Flex';
import MyTextInput from '../../../../../ssComponents/ReactNative/MyTextInput';
import MyText from '../../../../../ssComponents/ReactNative/MyText';

// REDUX
import {RootState} from '../../../../../ssRedux';
import {
  addOutput,
  setOutputs,
  removeOutput,
  forceSignatureRerender,
} from '../../../../../ssRedux/rateSidewaysSlice';
import {GrowingIdText as RateInput} from '../../../../../ssComponents/Input/GrowingIdList';
import MyButton from 'ssComponents/ReactNative/MyButton';
import DecorationRow from 'ssComponents/DecorationRow/DecorationRow';
import {DECORATION_ROW_KEY} from 'ssDatabase/api/types';

const createOutputsRenderItemComponent =
  (deleteOutput: (index: number) => void) =>
  (handleChangeText: (newText: string, index: number) => void) =>
  ({item, index}: {item: RateInput; index: number}) =>
    (
      <FlexRow>
        <DecorationRow
          placeholder="Add an output..."
          rowKey={DECORATION_ROW_KEY.OUTPUT}
          entityId={item.text}
          onEditEntityId={(newText: string) => handleChangeText(newText, index)}
        />
        {/* <StyledTextOutput
            placeholder={'Anotha output...'}
            value={item.text}
            onChangeText={(newText: string) => handleChangeText(newText, index)}
        /> */}

        <MyButton onPress={() => deleteOutput(index)}>
          <MyText>X</MyText>
        </MyButton>
      </FlexRow>
    );

const GrowingOutputsList: FC = () => {
  // REDUX
  const {ratedSignature, outputs} = useSelector(
    (state: RootState) => state.rateSidewaysSlice,
  );
  const dispatch = useDispatch();

  // HANDLER METHODS
  const keyExtractor = (dataPoint: RateInput) => `${dataPoint.id}`;
  const genNextDataPlaceholder = (id: number) => ({id, text: ''});
  const handleAddOutput = (id: number, newOutputOption: string) => {
    dispatch(addOutput({id, text: newOutputOption}));
  };
  const handleUpdateOutput = (newText: string, index: number) => {
    outputs[index].text = newText;
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    dispatch(setOutputs(outputs));
  };

  return (
    <GrowingIdList
      data={outputs}
      createRenderItemComponent={createOutputsRenderItemComponent(
        (index: number) => dispatch(removeOutput(index)),
      )}
      keyExtractor={keyExtractor}
      genNextDataPlaceholder={genNextDataPlaceholder}
      handleUpdateInput={handleUpdateOutput}
      handleAddInput={handleAddOutput}
    />
  );
};

export default GrowingOutputsList;

const StyledTextOutput = styled(MyTextInput)`
  borderwidth: 1px;
  bordercolor: ${({theme}: {theme: DefaultTheme}) => theme.colors.grayBorder};
  paddingvertical: 25px;
  paddinghorizontal: 10px;
`;
