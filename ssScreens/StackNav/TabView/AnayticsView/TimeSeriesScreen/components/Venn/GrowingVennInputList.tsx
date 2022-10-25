import React, {FC, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import DecorationRow from 'ssComponents/DecorationRow/DecorationRow';
import styled, {DefaultTheme} from 'styled-components/native';
import {FlexRow} from '../../../../../../../ssComponents/Flex';

// MY COMPONENTS
import GrowingIdList from '../../../../../../../ssComponents/Input/GrowingIdList';
import MyButton from '../../../../../../../ssComponents/ReactNative/MyButton';
import MyText from '../../../../../../../ssComponents/ReactNative/MyText';
import MyTextInput from '../../../../../../../ssComponents/ReactNative/MyTextInput';

// REDUX
import {AppDispatch, RootState} from '../../../../../../../ssRedux';
import {
  startSetVennInputs,
  startAddVennInput,
  startRmVennInput,
  VennInput,
} from '../../../../../../../ssRedux/analyticsSlice/timeseriesStatsSlice';

// DECORATIONS
import {DECORATION_ROW_KEY} from 'ssDatabase/api/types';
import {CGNode} from '@asianpersonn/realm-graph';
import AutoCompleteDecoration from 'ssComponents/DecorationRow/AutoCompleteDecoration';
import dbDriver from 'ssDatabase/api/core/dbDriver';

const createRenderItemComponent =
  (allInputIds: string[], deleteVennInput: (index: number) => void) =>
  (handleChangeText: (newText: string, index: number) => void) =>
  ({item, index}: {item: VennInput; index: number}) =>
    (
      <FlexRow>
        <AutoCompleteDecoration
          clickOutsideId="GrowingVennInputList"
          placeholder="Search an input..."
          allEntityIds={allInputIds}
          inputValue={item.text}
          setInputValue={(newText: string) => handleChangeText(newText, index)}
          decorationRowKey={DECORATION_ROW_KEY.INPUT}
          onSelectEntityId={(newText: string) =>
            handleChangeText(newText, index)
          }
        />
        {/* <StyledTextInput
            placeholder={'Anotha one...'}
            value={item.text}
            onChangeText={(newText: string) => handleChangeText(newText, index)}
        /> */}

        <MyButton onPress={() => deleteVennInput(index)}>
          <MyText>X</MyText>
        </MyButton>
      </FlexRow>
    );

type GrowingVennInputListProps = {};
const GrowingVennInputList: FC<GrowingVennInputListProps> = props => {
  // REDUX
  const {activeSliceName, vennNodeInputs} = useSelector((state: RootState) => ({
    ...state.readSidewaysSlice.toplevelReadReducer,
    ...state.analyticsSlice.timeseriesStatsSlice,
  }));
  const dispatch: AppDispatch = useDispatch();

  const allInputIds: string[] = useMemo(
    () =>
      dbDriver
        .getAllNodes(activeSliceName)
        .map((node: Realm.Object & CGNode) => node.id),
    [],
  );

  // PROP VARIABLES
  const keyExtractor = (dataPoint: VennInput) => `${dataPoint.id}`;
  const genNextDataPlaceholder = (id: number) => ({id, text: ''});
  const handleAddInputNode = (id: number, newPossibleOutput: string) => {
    dispatch(startAddVennInput({id, text: newPossibleOutput}));
  };
  const handleUpdateInputNode = (newText: string, index: number) => {
    vennNodeInputs[index].text = newText;
    // TODO: Dispatch a copy of the previous state: [ ...possibleInputs ]?
    dispatch(startSetVennInputs(vennNodeInputs));
  };

  return (
    <GrowingIdList
      data={vennNodeInputs}
      createRenderItemComponent={createRenderItemComponent(
        allInputIds,
        (index: number) => dispatch(startRmVennInput(index)),
      )}
      keyExtractor={keyExtractor}
      genNextDataPlaceholder={genNextDataPlaceholder}
      handleUpdateInput={handleUpdateInputNode}
      handleAddInput={handleAddInputNode}
    />
  );
};

export default GrowingVennInputList;

const StyledTextInput = styled(MyTextInput)`
  borderwidth: 1px;
  bordercolor: ${({theme}: {theme: DefaultTheme}) => theme.colors.grayBorder};
  paddingvertical: 25px;
  paddinghorizontal: 10px;
`;
