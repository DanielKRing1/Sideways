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
  startEditVennInput,
} from '../../../../../../../ssRedux/analyticsSlice/timeseriesStatsSlice';

// DECORATIONS
import AutoCompleteCategory from 'ssComponents/CategoryRow/AutoCompleteCategory';
import {RenderItemProps} from 'ssComponents/Input/GrowingInputList';
import {useCounterId} from 'ssHooks/useCounterId';
import {getStartingId} from 'ssUtils/id';
import {GOOD_POSTFIX} from 'ssDatabase/api/types';

const createRenderItem =
  (deleteVennInput: (index: number) => void) =>
  ({item, index, handleChangeText}: RenderItemProps) =>
    (
      <FlexRow>
        <AutoCompleteCategory
          placeholder="Search an input..."
          value={item.text}
          onChangeText={(newText: string) => handleChangeText(newText, index)}
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
    dispatch(
      startAddVennInput({
        id,
        item: {id: newPossibleOutput, postfix: GOOD_POSTFIX},
      }),
    );
  };
  const handleUpdateInputNode = (newText: string, index: number) => {
    // TODO: Dispatch a copy of the previous state: [ ...possibleInputs ]?
    dispatch(
      startEditVennInput({
        index,
        vennInput: {
          ...vennNodeInputs[index],
          item: {
            ...vennNodeInputs[index].item,
            id: newText,
          },
        },
      }),
    );
  };

  return (
    <GrowingIdList
      data={vennNodeInputs}
      idGenerator={useCounterId(getStartingId(vennNodeInputs, vni => vni.id))}
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
