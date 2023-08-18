import React, {FC} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import AutoCompleteDisplay, {
  AutoCompleteListProps,
} from 'ssComponents/CategoryRow/AutoComplete/AutoCompleteDisplay';
import DbCategoryRow from 'ssComponents/CategoryRow/DbCategoryRow';
import MyPadding from 'ssComponents/ReactNative/MyPadding';
import StickyScrollView from 'ssComponents/View/StickyScrollView';
import {GOOD_POSTFIX, toggleNodePostfix} from 'ssDatabase/api/types';
import {useCounterId} from 'ssHooks/useCounterId';
import NoInputsDisplay from 'ssScreens/StackNav/TabNav/RateNav/RateHomeScreen/components/Input/List/NoInputsDisplay';
import {getStartingId} from 'ssUtils/id';
import {DISPLAY_SIZE} from '../../../../../../global';

// REDUX
import {AppDispatch, RootState} from '../../../../../../ssRedux';
import {
  addRecommendationInput,
  RecoInput,
  editRecommendationInput,
  removeRecommendationInput,
  editSearchInput,
} from '../../../../../../ssRedux/analyticsSlice/recoStatsSlice';

type GrowingRecoInputsProps = {};
const GrowingRecoInputs: FC<GrowingRecoInputsProps> = () => {
  const dispatch = useDispatch();
  const {readSSSignature} = useSelector(
    (state: RootState) => state.appState.activeJournal,
  );
  const {searchInput, recommendationInputs, recommendationsSignature} =
    useSelector((state: RootState) => state.analyticsSlice.recoStatsSlice);

  // ID
  const {popId} = useCounterId(getStartingId(recommendationInputs, d => d.id));

  // HANDLER METHODS
  const handleAddInput = (newInputOption: string) => {
    const id: number = popId();
    dispatch(
      addRecommendationInput({
        id,
        item: {id: newInputOption, postfix: GOOD_POSTFIX},
      }),
    );
  };

  return (
    <AutoCompleteDisplay
      listFirst={true}
      placeholder={'Choose a past input...'}
      value={searchInput}
      onChangeText={(newText: string) => dispatch(editSearchInput(newText))}
      onSubmitEditing={() => handleAddInput(searchInput)}
      // Do not suggest already-selected ids
      filterSuggestions={(all: string[]) => {
        const exisiting = new Set(
          recommendationInputs.map((ri: RecoInput) => ri.item.id),
        );
        return all.filter((suggestion: string) => !exisiting.has(suggestion));
      }}
      data={recommendationInputs}
      onSelectEntityId={(selectedText: string) => handleAddInput(selectedText)}
      ListRenderItem={({item, index}) => (
        <RecoInputRI item={item} index={index} />
      )}
      NoInputsDisplay={NoInputsDisplay}
    />
  );
};

export default GrowingRecoInputs;

type RecoInputRIProps = AutoCompleteListProps<RecoInput>;
const RecoInputRI: FC<RecoInputRIProps> = props => {
  // PROPS
  const {item, index} = props;

  // REDUX
  const dispatch: AppDispatch = useDispatch();

  const handleCommitInputName = (newText: string) => {};
  const handleToggleInputPostfix = () => {
    dispatch(
      editRecommendationInput({
        index,
        input: {
          ...item,
          item: {...item.item, postfix: toggleNodePostfix(item.item.postfix)},
        },
      }),
    );
  };
  const handleDeleteInput = (): void => {
    dispatch(removeRecommendationInput(index));
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
