import React, {FC, useContext, useEffect, useState} from 'react';
import {ListRenderItemInfo, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

// DB DRIVER
import dbDriver from 'ssDatabase/api/core/dbDriver';
import {DbLoaderContext} from 'ssContexts/DbLoader/DbLoader';

// REDUX
import {RootState} from 'ssRedux/index';

// COMPONENTS
import {FlexCol, FlexRow} from 'ssComponents/Flex';
import {SearchableFlatList} from 'ssComponents/Search/SearchableFlatList';
import MyText from 'ssComponents/ReactNative/MyText';
import MyButton from 'ssComponents/ReactNative/MyButton';
import DbCategoryRow from 'ssComponents/CategoryRow/DbCategoryRow';
import {ViewStyle} from 'react-native';
import {
  SidewaysSnapshotRow,
  SidewaysSnapshotRowPrimitive,
} from 'ssDatabase/api/core/types';
import {deserializeDate} from 'ssUtils/date';
import MyBorder from 'ssComponents/ReactNative/MyBorder';
import {useTabBarHeight} from 'ssHooks/useTabBarHeight';
import {DISPLAY_SIZE} from '../../../../../global';
import {DefaultTheme, useTheme} from 'styled-components/native';

type StackCardProps = {
  itemInfo: ListRenderItemInfo<SidewaysSnapshotRowPrimitive>;
  updateSnapshot: (
    oldSnapshot: SidewaysSnapshotRowPrimitive,
    index: number,
    newInputs: string[],
    newOutputs: string[],
    newRating: number,
  ) => Promise<void>;
  deleteSnapshot: (
    snapshot: SidewaysSnapshotRowPrimitive,
    index: number,
  ) => void;
};
const StackCard: FC<StackCardProps> = props => {
  const {itemInfo, updateSnapshot, deleteSnapshot} = props;
  const {item, index} = itemInfo;

  // THEME
  const theme: DefaultTheme = useTheme();

  // LOCAL STATE

  const [inputsToRm, setInputsToRm] = useState<Set<string>>(new Set());
  const [outputsToRm, setOutputsToRm] = useState<Set<string>>(new Set());

  // HANDLERS

  const toggleInputToRm = (input: string) => {
    if (inputsToRm.has(input)) inputsToRm.delete(input);
    else inputsToRm.add(input);

    setInputsToRm(new Set([...inputsToRm]));
  };

  const toggleOutputToRm = (output: string) => {
    if (outputsToRm.has(output)) inputsToRm.delete(output);
    else outputsToRm.add(output);

    setOutputsToRm(new Set([...outputsToRm]));
  };

  const _updateSnapshot = async () => {
    const inputsToKeep: string[] = item.inputs.filter(
      input => !inputsToRm.has(input),
    );
    const outputsToKeep: string[] = item.outputs.filter(
      output => !outputsToRm.has(output),
    );

    await updateSnapshot(item, index, inputsToKeep, outputsToKeep, item.rating);
  };

  // STYLES
  const genInputStyle = (input: string): ViewStyle => ({
    borderColor: !inputsToRm.has(input) ? 'green' : 'red',
  });
  const genOutputStyle = (output: string): ViewStyle => ({
    borderColor: !outputsToRm.has(output) ? 'green' : 'red',
  });

  return (
    // <TouchableOpacity onPress={() => {}}>
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
        <MyButton onPress={() => deleteSnapshot(item, index)}>
          <MyText>Delete Stack Snapshot X</MyText>
        </MyButton>

        <MyText>{deserializeDate(item.timestamp).toDateString()}</MyText>
        <MyText>{item.rating}</MyText>

        <MyText>Inputs:</MyText>
        {/* TODO Remove */}
        {/* {item.inputs.map((input: string) => (
            <FlexRow>
              <MyText style={genStyle(input)}>
                {input}
              </MyText>
              <MyButton onPress={() => toggleInputToRm(input)}>
                <MyText>X</MyText>
              </MyButton>
            </FlexRow>
          ))} */}
        {item.inputs.map((input: string) => (
          <FlexRow key={input}>
            <DbCategoryRow
              inputName={input}
              onCommitInputName={() => {}}
              onDeleteCategoryRow={() => {}}
            />
            <MyButton onPress={() => toggleInputToRm(input)}>
              <MyText>X</MyText>
            </MyButton>
          </FlexRow>
        ))}

        <MyText>Outputs:</MyText>
        {/* TODO Remove */}
        {/* {item.outputs.map((output: string) => (
            <FlexRow>
              <MyText
                style={{color: !outputsToRm.has(output) ? 'green' : 'red'}}>
                {output}
              </MyText>
              <MyButton onPress={() => toggleOutputToRm(output)}>
                <MyText>X</MyText>
              </MyButton>
            </FlexRow>
          ))} */}
        {item.outputs.map((output: string) => (
          <TouchableOpacity
            key={output}
            onPress={() => toggleOutputToRm(output)}>
            <MyBorder>
              <FlexRow justifyContent="space-between">
                <MyText>{output}</MyText>
                {outputsToRm.has(output) && <MyText>Yes</MyText>}
              </FlexRow>
            </MyBorder>
          </TouchableOpacity>
        ))}

        <MyButton onPress={_updateSnapshot}>
          <MyText>Update Stack Snapshot</MyText>
        </MyButton>
      </FlexCol>
    </MyBorder>
    // {/* </TouchableOpacity> */}
  );
};

const createRenderItem =
  (
    updateSnapshot: (
      oldSnapshot: SidewaysSnapshotRowPrimitive,
      index: number,
      newInputs: string[],
      newOutputs: string[],
      newRating: number,
    ) => Promise<void>,
    deleteSnapshot: (
      snapshot: SidewaysSnapshotRowPrimitive,
      index: number,
    ) => void,
  ) =>
  (itemInfo: ListRenderItemInfo<SidewaysSnapshotRowPrimitive>) =>
    (
      <StackCard
        itemInfo={itemInfo}
        updateSnapshot={updateSnapshot}
        deleteSnapshot={deleteSnapshot}
      />
    );

type StackListProps = {
  updateSnapshot: (
    oldSnapshot: SidewaysSnapshotRowPrimitive,
    index: number,
    newInputs: string[],
    newOutputs: string[],
    newRating: number,
  ) => Promise<void> | never;
  deleteSnapshot: (
    snapshot: SidewaysSnapshotRowPrimitive,
    index: number,
  ) => Promise<void> | never;
};
const StackList: FC<StackListProps> = props => {
  const {updateSnapshot, deleteSnapshot} = props;

  // LOCAL STATE
  const [searchIndex, setSearchIndex] = useState<number>(-1);
  const [stack, setStack] = useState<Realm.List<SidewaysSnapshotRow> | []>([]);

  // REDUX
  const {activeSliceName, readSSSignature} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const {stackStartDate, readStackSignature} = useSelector(
    (state: RootState) =>
      state.readSidewaysSlice.internalReadReducer.readStackReducer,
  );

  // DB DRIVER
  const {isLoaded} = useContext(DbLoaderContext);

  // 1. Get fresh stack list
  useEffect(() => {
    // if(!activeSliceName) return setStack([]);

    (async () => {
      const freshStack: Realm.List<SidewaysSnapshotRow> | [] =
        await dbDriver.getStack(activeSliceName);
      setStack(freshStack);
    })();
  }, [isLoaded, activeSliceName]);

  // 2. Get stack search index
  useEffect(() => {
    // if(!activeSliceName) return setSearchIndex(-1);

    (async () => {
      let index: number = await dbDriver.searchStack(
        activeSliceName,
        deserializeDate(stackStartDate),
      );
      setSearchIndex(index);
    })();
  }, [stackStartDate, stack]);

  // LIST COMPONENT
  const renderItem = createRenderItem(updateSnapshot, deleteSnapshot);

  console.log(searchIndex);
  console.log('searchIndex');

  // TODO
  // 1. Make StackView scrollable
  // 2. Prevent submitting rating missing at least 1 output, a non-zero rating, and at least 1 input

  const {remainingHeight} = useTabBarHeight();

  return (
    <SearchableFlatList
      searchIndex={searchIndex}
      // @ts-ignore
      // TODO: See if this works
      data={stack}
      renderItem={renderItem}
      keyExtractor={(item: SidewaysSnapshotRow): string =>
        item.timestamp.toISOString()
      }
    />
  );
};

export default StackList;
