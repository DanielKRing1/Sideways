import React, {FC, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled, {DefaultTheme} from 'styled-components/native';

// REDUX
import {AppDispatch, RootState} from '../../../../ssRedux';
import {
  setNewSliceName,
  addPossibleOutput,
  removePossibleOutput,
  editPossibleOutput,
  CreateSliceOutput,
} from '../../../../ssRedux/createSidewaysSlice';

// COMPONENTS
import GrowingIdList from '../../../../ssComponents/Input/GrowingIdList';

// NAV
import MyTextInput from '../../../../ssComponents/ReactNative/MyTextInput';
import MyButton from '../../../../ssComponents/ReactNative/MyButton';
import MyText from '../../../../ssComponents/ReactNative/MyText';
import {FlexRow} from '../../../../ssComponents/Flex';
import {RenderItemProps} from 'ssComponents/Input/GrowingInputList';
import {useCounterId} from 'ssHooks/useCounterId';
import {getStartingId} from 'ssUtils/id';

// Possible outputs

const StyledTextInput = styled(MyTextInput)`
  border-width: 1px;
  bordercolor: ${({theme}: {theme: DefaultTheme}) => theme.colors.grayBorder};
  paddingvertical: 25px;
  paddinghorizontal: 10px;
`;

type GrowingPossibleOutputsProps = {};
const GrowingPossibleOutputs: FC<GrowingPossibleOutputsProps> = () => {
  // REDUX
  const {searchedSliceName} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {possibleOutputs, createdSignature} = useSelector(
    (state: RootState) => state.createSidewaysSlice,
  );
  const dispatch = useDispatch();

  // UPDATE REDUX STATE
  useEffect(() => {
    dispatch(setNewSliceName(searchedSliceName));
  }, []);

  // HANDLER METHODS
  const keyExtractor = (dataPoint: CreateSliceOutput) => `${dataPoint.id}`;
  const genNextDataPlaceholder = (id: number) => ({id, text: ''});
  const handleAddOutput = (id: number, newPossibleOutput: string) => {
    dispatch(
      addPossibleOutput({
        id,
        item: newPossibleOutput,
      }),
    );
  };
  const handleUpdateOutput = (newText: string, index: number) => {
    // TODO: Dispatch a copy of the previous state: [ ...possibleOutputs ]?
    dispatch(editPossibleOutput({index, newText}));
  };

  return (
    <GrowingIdList
      data={possibleOutputs}
      idGenerator={useCounterId(getStartingId(possibleOutputs, po => po.id))}
      handleAddInput={handleAddOutput}
      handleUpdateInput={handleUpdateOutput}
      RenderItem={RI}
      keyExtractor={keyExtractor}
      genNextDataPlaceholder={genNextDataPlaceholder}
    />
  );
};

const RI: FC<RenderItemProps> = ({item, index, handleChangeText}: any) => {
  const dispatch: AppDispatch = useDispatch();

  const handleDeleteOutput = (index: number) =>
    dispatch(removePossibleOutput(index));

  return (
    <FlexRow>
      <StyledTextInput
        placeholder={'Anotha one...'}
        value={item.text}
        onChangeText={(newText: string) => handleChangeText(newText, index)}
      />

      <MyText>{item.id}</MyText>

      <MyButton onPress={() => handleDeleteOutput(index)}>
        <MyText>X</MyText>
      </MyButton>
    </FlexRow>
  );
};

export default GrowingPossibleOutputs;
