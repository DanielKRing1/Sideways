import React, {FC} from 'react';
import {FlatList, View, ListRenderItem, ListRenderItemInfo} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {RootState, AppDispatch} from 'ssRedux/index';

type RatingOutputOptionsProps = {};
const RatingOutputOptions: FC<RatingOutputOptionsProps> = props => {
  // REDUX
  const {allDbOutputs} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {inputs, outputs, rating, ratedSignature} = useSelector(
    (state: RootState) => state.rateSidewaysSlice,
  );
  const dispatch: AppDispatch = useDispatch();

  // LOCAL STATE
  const outputsSet: Set<string> = new Set(outputs.map(({text}) => text));

  // RENDER ITEM
  const renderItem: ListRenderItem<string> = itemInfo => (
    <OutputOption itemInfo={itemInfo} outputsSet={outputsSet} />
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
  outputsSet: Set<string>;
};
const OutputOption: FC<OutputOptionProps> = props => {
  const {itemInfo, outputsSet} = props;

  return <View></View>;
};
