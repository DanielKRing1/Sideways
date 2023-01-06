import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FlexRow} from '../../../../../../../ssComponents/Flex';

// MY COMPONENTS
import GrowingIdList from '../../../../../../../ssComponents/Input/GrowingIdList';
import MyButton from '../../../../../../../ssComponents/ReactNative/MyButton';
import MyText from '../../../../../../../ssComponents/ReactNative/MyText';

// REDUX
import {AppDispatch, RootState} from '../../../../../../../ssRedux';
import {
  startSetVennInputs,
  startAddVennInput,
  startRmVennInput,
  VennInput,
} from '../../../../../../../ssRedux/analyticsSlice/timeseriesStatsSlice';

// DECORATIONS
import AutoCompleteCategory from 'ssComponents/CategoryRow/AutoCompleteCategory';
import {RenderItemProps} from 'ssComponents/Input/GrowingInputList';

const createRenderItem =
  (deleteVennInput: (index: number) => void) =>
  ({item, index, handleChangeText}: RenderItemProps) =>
    (
      <FlexRow>
        <AutoCompleteCategory
          clickOutsideId={`GrowingVennInputList-${item.id}`}
          placeholder="Search an input..."
          inputValue={item.text}
          setInputValue={(newText: string) => handleChangeText(newText, index)}
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
const GrowingVennInputList: FC<GrowingVennInputListProps> = () => {
  // REDUX
  const {vennNodeInputs} = useSelector(
    (state: RootState) => state.analyticsSlice.timeseriesStatsSlice,
  );
  const dispatch: AppDispatch = useDispatch();

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
      RenderItem={createRenderItem((index: number) =>
        dispatch(startRmVennInput(index)),
      )}
      keyExtractor={keyExtractor}
      genNextDataPlaceholder={genNextDataPlaceholder}
      handleUpdateInput={handleUpdateInputNode}
      handleAddInput={handleAddInputNode}
    />
  );
};

export default GrowingVennInputList;
