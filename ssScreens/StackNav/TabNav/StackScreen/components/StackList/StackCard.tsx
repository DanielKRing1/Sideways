import React, {FC} from 'react';
import {ListRenderItemInfo} from 'react-native';
import {useDispatch} from 'react-redux';
import {DefaultTheme, useTheme} from 'styled-components';

import {DISPLAY_SIZE} from '../../../../../../global';
import DbCategoryRow from 'ssComponents/CategoryRow/DbCategoryRow';
import {FlexCol, FlexRow} from 'ssComponents/Flex';
import MyBorder from 'ssComponents/ReactNative/MyBorder';
import MyButton from 'ssComponents/ReactNative/MyButton';
import MyText from 'ssComponents/ReactNative/MyText';
import {SidewaysSnapshotRowPrimitive} from 'ssDatabase/api/core/types';
import {AppDispatch} from 'ssRedux/index';
import {abbrDateMs} from 'ssUtils/date';
import {startDeleteRate} from 'ssRedux/undorateSidewaysSlice';

type StackCardProps = {
  itemInfo: ListRenderItemInfo<SidewaysSnapshotRowPrimitive>;
  openUpdateRatingModal: () => void;
};

const StackCard: FC<StackCardProps> = props => {
  const {itemInfo, openUpdateRatingModal} = props;
  const {item, index} = itemInfo;

  // REDUX
  const dispatch: AppDispatch = useDispatch();

  // THEME
  const theme: DefaultTheme = useTheme();

  // LOCAL STATE

  // HANDLERS
  const handleCommitInputName = () => {};
  const handleDeleteCategoryRow = () => {};
  const handleDeleteSnapshot = () => {
    dispatch(
      startDeleteRate({
        indexToRm: index,
      }),
    );
  };

  return (
    <MyBorder
      shadow
      paddingTop={DISPLAY_SIZE.sm}
      paddingBottom={DISPLAY_SIZE.sm}
      marginTop={DISPLAY_SIZE.sm}
      marginBottom={DISPLAY_SIZE.sm}
      style={{
        backgroundColor: theme.backgroundColors.main,
      }}>
      <FlexCol>
        <MyButton onPress={handleDeleteSnapshot}>
          <MyText>Delete Stack Snapshot X</MyText>
        </MyButton>

        <MyText>{JSON.stringify(abbrDateMs(item.timestamp))}</MyText>
        <MyText>{item.rating}</MyText>

        <MyText>Inputs:</MyText>
        {item.inputs.map((input: string, i: number) => (
          <FlexRow key={`${input}-${i}`}>
            <DbCategoryRow
              editable={false}
              deletable={false}
              inputName={input}
              categoryId={item.categories[i]}
              onCommitInputName={handleCommitInputName}
              onDeleteCategoryRow={handleDeleteCategoryRow}
            />
          </FlexRow>
        ))}

        <MyText>Outputs:</MyText>
        {item.outputs.map((output: string) => (
          <MyBorder key={output}>
            <FlexRow justifyContent="space-between">
              <MyText>{output}</MyText>
            </FlexRow>
          </MyBorder>
        ))}

        <MyButton onPress={openUpdateRatingModal}>
          <MyText>Update Stack Snapshot</MyText>
        </MyButton>
      </FlexCol>
    </MyBorder>
  );
};

export default StackCard;
