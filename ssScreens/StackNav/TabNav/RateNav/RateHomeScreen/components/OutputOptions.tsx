import React, {FC, useMemo} from 'react';
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  ViewStyle,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {FlexRow} from 'ssComponents/Flex';
import MyBorder from 'ssComponents/ReactNative/MyBorder';
import MyText from 'ssComponents/ReactNative/MyText';

import {AppDispatch, RootState} from 'ssRedux/index';
import {setOutputs} from 'ssRedux/rateSidewaysSlice';
import {useTheme} from 'styled-components';
import {DefaultTheme} from 'styled-components/native';

type RatingOutputOptionsProps = {};
const RatingOutputOptions: FC<RatingOutputOptionsProps> = props => {
  // REDUX
  const {allDbOutputs} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {outputs} = useSelector((state: RootState) => state.rateSidewaysSlice);
  const dispatch: AppDispatch = useDispatch();

  // LOCAL STATE
  const selectedOutputs: Set<string> = new Set(outputs);
  const toggleSelected = (output: string) => {
    // 1. Toggle selected outputs
    if (!selectedOutputs.has(output)) selectedOutputs.add(output);
    else selectedOutputs.delete(output);

    // 2. Set Redux outputs
    dispatch(setOutputs(Array.from(selectedOutputs)));
  };

  // RENDER ITEM
  const renderItem: ListRenderItem<string> = itemInfo => (
    <OutputOption
      itemInfo={itemInfo}
      selectedOutputs={selectedOutputs}
      toggleSelected={toggleSelected}
    />
  );

  return (
    <FlatList
      data={allDbOutputs}
      renderItem={renderItem}
      keyExtractor={item => item}
    />
  );
};

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
  const handleToggleSelected = () => {
    toggleSelected(output);
  };

  const borderStyle: ViewStyle = useMemo(
    () =>
      isSelected
        ? {borderColor: theme.border.color.accent}
        : {borderColor: theme.border.color.main},
    [isSelected],
  );

  return (
    <TouchableOpacity onPress={handleToggleSelected}>
      <MyBorder style={borderStyle}>
        <FlexRow justifyContent="space-between">
          <MyText>{output}</MyText>
          {isSelected && <MyText>Yes</MyText>}
        </FlexRow>
      </MyBorder>
    </TouchableOpacity>
  );
};
