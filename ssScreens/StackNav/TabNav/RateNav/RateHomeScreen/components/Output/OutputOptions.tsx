import React, {FC, useMemo, useCallback} from 'react';
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {FlexRow} from 'ssComponents/Flex';
import MyBorder from 'ssComponents/ReactNative/MyBorder';
import MyText from 'ssComponents/ReactNative/MyText';

import {AppDispatch, RootState} from 'ssRedux/index';
import {setOutputs as setOutputsR} from 'ssRedux/rateSidewaysSlice';
import {setReplacementOutputs as setOutputsUR} from 'ssRedux/undorateSidewaysSlice';
import {select} from 'ssUtils/selector';
import {useTheme} from 'styled-components';
import {DefaultTheme} from 'styled-components/native';
import {RATING_TYPE} from '../RatingMenu/types';

type RatingOutputOptionsProps = {
  ratingType: RATING_TYPE;
};
const RatingOutputOptions: FC<RatingOutputOptionsProps> = props => {
  // PROPS
  const {ratingType} = props;

  // REDUX
  const {allDbOutputs} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {outputs: outputsR} = useSelector(
    (state: RootState) => state.rateSidewaysSlice,
  );
  const {outputs: outputsUR} = useSelector(
    (state: RootState) => state.undorateSidewaysSlice,
  );
  // Select reducer values
  const [, outputs] = select(
    ratingType,
    [RATING_TYPE.Rate, outputsR],
    [RATING_TYPE.UndoRate, outputsUR],
  );
  // Select reducer actions
  const [, setOutputs] = select(
    ratingType,
    [RATING_TYPE.Rate, setOutputsR],
    [RATING_TYPE.UndoRate, setOutputsUR],
  );
  const dispatch: AppDispatch = useDispatch();

  // LOCAL STATE
  const selectedOutputs: Set<string> = useMemo(
    () => new Set(outputs),
    [outputs],
  );
  const toggleSelected = useCallback(
    (output: string) => {
      // 1. Toggle selected outputs
      if (!selectedOutputs.has(output)) selectedOutputs.add(output);
      else selectedOutputs.delete(output);

      // 2. Set Redux outputs
      dispatch(setOutputs(Array.from(selectedOutputs)));
    },
    [selectedOutputs],
  );

  const renderItem = useMemo(
    () => renderItemWrapper(selectedOutputs, toggleSelected),
    [selectedOutputs, toggleSelected],
  );
  const keyExtractor = useCallback((item: string) => item, []);

  return (
    <FlatList
      data={allDbOutputs}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

// RENDER ITEM
const renderItemWrapper =
  (
    selectedOutputs: Set<string>,
    toggleSelected: (output: string) => void,
  ): ListRenderItem<string> =>
  itemInfo =>
    (
      <OutputOption
        itemInfo={itemInfo}
        selectedOutputs={selectedOutputs}
        toggleSelected={toggleSelected}
      />
    );

export default RatingOutputOptions;

type OutputOptionProps = {
  itemInfo: ListRenderItemInfo<string>;
  selectedOutputs: Set<string>;
  toggleSelected: (output: string) => void;
};
const OutputOption: FC<OutputOptionProps> = props => {
  const {itemInfo, selectedOutputs, toggleSelected} = props;
  const output = itemInfo.item;

  const isSelected: boolean = useMemo(
    () => selectedOutputs.has(output),
    [output, selectedOutputs],
  );

  // THEME
  const theme: DefaultTheme = useTheme();

  // HANDLERS
  const handleToggleSelected = useCallback(() => {
    toggleSelected(output);
  }, [toggleSelected]);

  const borderStyle: ViewStyle = useMemo(
    () =>
      isSelected
        ? {borderColor: theme.border.color.accent}
        : {borderColor: theme.border.color.main},
    [isSelected, theme],
  );

  return useMemo(
    () => (
      <TouchableOpacity onPress={handleToggleSelected}>
        <MyBorder style={borderStyle}>
          <FlexRow justifyContent="space-between">
            <MyText>{output}</MyText>
            {isSelected && <MyText>Yes</MyText>}
          </FlexRow>
        </MyBorder>
      </TouchableOpacity>
    ),
    [handleToggleSelected, borderStyle, output, isSelected],
  );
};
