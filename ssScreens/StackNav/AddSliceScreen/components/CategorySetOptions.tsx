import React, {FC, useEffect, useMemo} from 'react';
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from 'styled-components';
import {DefaultTheme} from 'styled-components/native';

import {FlexRow} from 'ssComponents/Flex';
import MyBorder from 'ssComponents/ReactNative/MyBorder';
import MyText from 'ssComponents/ReactNative/MyText';
import {GJ_CategorySetNameMapping} from 'ssDatabase/api/userJson/category/types';
import {GJ_COLLECTION_ROW_KEY} from 'ssDatabase/api/userJson/globalDriver/types';
import {setCSId} from 'ssRedux/createSidewaysSlice';
import {AppDispatch, RootState} from 'ssRedux/index';

type CategorySetOptionsProps = {};
const CategorySetOptions: FC<CategorySetOptionsProps> = props => {
  // REDUX
  const {csId: selectedCSId} = useSelector(
    (state: RootState) => state.createSidewaysSlice,
  );
  const {fullUserJsonMap} = useSelector(
    (state: RootState) => state.userJsonSlice,
  );
  const dispatch: AppDispatch = useDispatch();

  // LOCAL STATE
  const selectCSId = (newCSId: string) => {
    dispatch(setCSId(newCSId));
  };

  console.log(fullUserJsonMap);

  const csNameMapping: GJ_CategorySetNameMapping =
    fullUserJsonMap[GJ_COLLECTION_ROW_KEY.CATEGORY_SET_NAME_MAPPING];

  console.log('AYYYYYYYYYYYYYYYYYYYE');
  console.log(fullUserJsonMap);
  console.log(csNameMapping);
  const allCSIds: string[] = Object.keys(csNameMapping);
  console.log('ALL CS IDS');
  console.log(allCSIds);

  // RENDER ITEM
  const renderItem: ListRenderItem<string> = itemInfo => (
    <CSOption
      itemInfo={itemInfo}
      csNameMapping={csNameMapping}
      selectedCSId={selectedCSId}
      selectCSId={selectCSId}
    />
  );

  return (
    <FlatList
      data={allCSIds}
      renderItem={renderItem}
      keyExtractor={item => item}
    />
  );
};

export default CategorySetOptions;

type CSOptionProps = {
  itemInfo: ListRenderItemInfo<string>;
  csNameMapping: GJ_CategorySetNameMapping;
  selectedCSId: string;
  selectCSId: (newCSId: string) => void;
};
const CSOption: FC<CSOptionProps> = props => {
  const {itemInfo, csNameMapping, selectedCSId, selectCSId} = props;
  const csId: string = itemInfo.item;
  const csName: string = csNameMapping[csId];

  const isSelected: boolean = useMemo(
    () => csId === selectedCSId,
    [csId, selectedCSId],
  );

  // THEME
  const theme: DefaultTheme = useTheme();

  // HANDLERS
  const handleSelectCSId = () => {
    selectCSId(csId);
  };

  const borderStyle: ViewStyle = useMemo(
    () =>
      isSelected
        ? {borderColor: theme.border.color.accent}
        : {borderColor: theme.border.color.main},
    [isSelected],
  );

  return (
    <TouchableOpacity onPress={handleSelectCSId}>
      <MyBorder style={borderStyle}>
        <FlexRow justifyContent="space-between">
          <MyText>{csName}</MyText>
          {isSelected && <MyText>Yes</MyText>}
        </FlexRow>
      </MyBorder>
    </TouchableOpacity>
  );
};
