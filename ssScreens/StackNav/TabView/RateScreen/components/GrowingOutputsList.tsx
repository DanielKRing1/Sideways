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
import {DECORATION_ROW_TYPE} from 'ssDatabase/api/userJson/decoration/types';
import {useEffect} from 'react';
import {useMemo} from 'react';
import dbDriver from 'ssDatabase/api/core/dbDriver';

const createOutputsRenderItemComponent =
  (rmOutput: (index: number) => void) =>
  (handleChangeText: (newText: string, index: number) => void) =>
  ({item, index}: {item: RateInput; index: number}) =>
    (
      <FlexRow>
        <DecorationRow
          placeholder="Add an output..."
          dRowType={DECORATION_ROW_TYPE.OUTPUT}
          entityId={item.text}
          onEditEntityId={(newText: string) => handleChangeText(newText, index)}
        />
        {/* <StyledTextOutput
            placeholder={'Anotha output...'}
            value={item.text}
            onChangeText={(newText: string) => handleChangeText(newText, index)}
        /> */}

        <MyButton onPress={() => rmOutput(index)}>
          <MyText>X</MyText>
        </MyButton>
      </FlexRow>
    );

const GrowingOutputsList: FC = () => {
  // REDUX
  const {ratedSignature, outputs} = useSelector(
    (state: RootState) => state.rateSidewaysSlice,
  );
  const {activeSliceName, allDbOutputs} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const dispatch = useDispatch();

  /*
1. Record all in/outputs
2. Allow duplicate inputs
3. When adding an output, remove from allOutputs list
4. When removing an output, add back to allOutputs list
5. Input is trie dropdown of allInputs
6. Output is trie dropdown of remainingOutputs, without text input
  */

  // HANDLER METHODS
  const keyExtractor = (dataPoint: RateInput) => `${dataPoint.id}`;
  const genNextDataPlaceholder = (id: number) => ({id, text: ''});
  const handleAddOutput = (id: number, newOutputOption: string) => {
    // 1. Do not add an output if thereare no unique outputs left
    if (outputs.length < allDbOutputs.length)
      dispatch(addOutput({id, text: newOutputOption}));
  };
  const handleUpdateOutput = (newText: string, index: number) => {
    outputs[index].text = newText;
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    dispatch(setOutputs(outputs));
  };
  const handleRmOutput = (index: number) => dispatch(removeOutput(index));

  return (
    <GrowingIdList
      data={outputs}
      createRenderItemComponent={createOutputsRenderItemComponent(
        handleRmOutput,
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
