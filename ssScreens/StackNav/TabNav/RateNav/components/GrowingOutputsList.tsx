import React, {FC} from 'react';
import styled, {DefaultTheme} from 'styled-components/native';

import {FlexRow} from 'ssComponents/Flex';
import MyTextInput from '../../../../../ssComponents/ReactNative/MyTextInput';

import {GrowingIdText as RateInput} from '../../../../../ssComponents/Input/GrowingIdList';
import DbCategoryRow from 'ssComponents/CategoryRow/DbCategoryRow';
import {ListRenderItemInfo, View} from 'react-native';

const createOutputsRenderItemComponent =
  (handleDeleteCategoryRow: (index: number) => void) =>
  (handleChangeText: (newText: string) => void) =>
  ({item, index}: ListRenderItemInfo<RateInput>) =>
    (
      <FlexRow>
        <DbCategoryRow
          inputName={item.text}
          onCommitInputName={handleChangeText}
          onDeleteCategoryRow={() => handleDeleteCategoryRow(index)}
        />
        {/* <StyledTextOutput
            placeholder={'Anotha output...'}
            value={item.text}
            onChangeText={(newText: string) => handleChangeText(newText, index)}
        /> */}
      </FlexRow>
    );

const GrowingOutputsList: FC = () => {
  return <View></View>;
  //   // REDUX
  //   const {outputs} = useSelector((state: RootState) => state.rateSidewaysSlice);
  //   const {activeSliceName, allDbOutputs} = useSelector(
  //     (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  //   );
  //   const dispatch = useDispatch();

  //   /*
  // 1. Record all in/outputs
  // 2. Allow duplicate inputs
  // 3. When adding an output, remove from allOutputs list
  // 4. When removing an output, add back to allOutputs list
  // 5. Input is trie dropdown of allInputs
  // 6. Output is trie dropdown of remainingOutputs, without text input
  //   */

  //   // HANDLER METHODS
  //   const keyExtractor = (dataPoint: RateInput) => `${dataPoint.id}`;
  //   const genNextDataPlaceholder = (id: number) => ({id, text: ''});
  //   const handleAddOutput = (id: number, newOutputOption: string) => {
  //     // 1. Do not add an output if thereare no unique outputs left
  //     if (outputs.length < allDbOutputs.length)
  //       dispatch(addOutput({id, text: newOutputOption}));
  //   };
  //   const handleUpdateOutput = (newText: string, index: number) => {
  //     outputs[index].text = newText;
  //     // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
  //     dispatch(setOutputs(outputs));
  //   };
  //   const handleRmOutput = (index: number) => dispatch(removeOutput(index));

  //   return (
  //     <GrowingIdList
  //       data={outputs}
  //       createRenderItemComponent={createOutputsRenderItemComponent(
  //         handleRmOutput,
  //       )}
  //       keyExtractor={keyExtractor}
  //       genNextDataPlaceholder={genNextDataPlaceholder}
  //       handleUpdateInput={handleUpdateOutput}
  //       handleAddInput={handleAddOutput}
  //     />
  //   );
};

export default GrowingOutputsList;

const StyledTextOutput = styled(MyTextInput)`
  border-width: 1px;
  bordercolor: ${({theme}: {theme: DefaultTheme}) => theme.colors.grayBorder};
  paddingvertical: 25px;
  paddinghorizontal: 10px;
`;
