import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';

// REDUX
import {AppDispatch, RootState} from '../../../../../../../ssRedux';
import {
  setSearchInput,
  startAddVennInput,
  startRmVennInput,
  VennInput,
  startEditVennInput,
} from '../../../../../../../ssRedux/analytics/timeseriesStats';

// DECORATIONS
import AutoCompleteDisplay from 'ssComponents/CategoryRow/AutoComplete/AutoCompleteDisplay';
import {useCounterId} from 'ssHooks/useCounterId';
import {getStartingId} from 'ssUtils/id';
import {GOOD_POSTFIX, toggleNodePostfix} from 'ssDatabase/api/types';
import {AutoCompleteListProps} from 'ssComponents/CategoryRow/AutoComplete/AutoCompleteDisplay';
import {DISPLAY_SIZE} from '../../../../../../../global';
import DbCategoryRow from 'ssComponents/CategoryRow/DbCategoryRow';
import MyPadding from 'ssComponents/ReactNative/MyPadding';
import NoInputsDisplay from 'ssScreens/StackNav/TabNav/RateNav/RateHomeScreen/components/Input/List/NoInputsDisplay';

type GrowingVennInputDisplayProps = {};
const GrowingVennInputDisplay: FC<GrowingVennInputDisplayProps> = () => {
  // REDUX
  const {searchInput, vennNodeInputs} = useSelector(
    (state: RootState) => state.analytics.timeseriesStats,
  );
  const dispatch: AppDispatch = useDispatch();

  // ID
  const {popId} = useCounterId(getStartingId(vennNodeInputs, d => d.id));

  // PROP VARIABLES
  const handleAddInput = (newPossibleOutput: string) => {
    const id: number = popId();
    dispatch(
      startAddVennInput({
        id,
        item: {id: newPossibleOutput, postfix: GOOD_POSTFIX},
      }),
    );
  };

  return (
    <AutoCompleteDisplay
      listFirst={true}
      placeholder={'Choose a past input...'}
      value={searchInput}
      onChangeText={(newText: string) => dispatch(setSearchInput(newText))}
      onSubmitEditing={() => handleAddInput(searchInput)}
      // Do not suggest already-selected ids
      filterSuggestions={(all: string[]) => {
        const exisiting = new Set(
          vennNodeInputs.map((ri: VennInput) => ri.item.id),
        );
        return all.filter((suggestion: string) => !exisiting.has(suggestion));
      }}
      data={vennNodeInputs}
      onSelectEntityId={(selectedText: string) => handleAddInput(selectedText)}
      ListRenderItem={({item, index}) => (
        <VennInputRI item={item} index={index} />
      )}
      NoInputsDisplay={NoInputsDisplay}
    />
  );
};

export default GrowingVennInputDisplay;

type VennInputRIProps = AutoCompleteListProps<VennInput>;
const VennInputRI: FC<VennInputRIProps> = props => {
  const {item, index} = props;

  // REDUX
  const dispatch: AppDispatch = useDispatch();

  const handleCommitInputName = (newText: string) => {};
  const handleToggleInputPostfix = () => {
    dispatch(
      startEditVennInput({
        index,
        input: {
          ...item,
          item: {...item.item, postfix: toggleNodePostfix(item.item.postfix)},
        },
      }),
    );
  };
  const handleDeleteInput = (): void => {
    dispatch(startRmVennInput(index));
  };

  return (
    <MyPadding
      baseSize={DISPLAY_SIZE.xs}
      rightSize={DISPLAY_SIZE.sm}
      leftSize={DISPLAY_SIZE.sm}>
      <DbCategoryRow
        editable={false}
        key={item.item.id}
        inputName={item.item.id}
        goodOrBad={item.item.postfix}
        onToggleGoodOrBad={handleToggleInputPostfix}
        onCommitInputName={handleCommitInputName}
        onDeleteCategoryRow={handleDeleteInput}
      />
    </MyPadding>
  );
};
