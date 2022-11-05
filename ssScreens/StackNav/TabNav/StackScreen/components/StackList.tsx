import React, {FC, useContext, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
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
import DecorationRow from 'ssComponents/DecorationRow/DecorationRow';
import {ViewStyle} from 'react-native';
import {SidewaysSnapshotRow} from 'ssDatabase/api/core/types';
import {DECORATION_ROW_TYPE} from 'ssDatabase/api/userJson/category/types';
import {deserializeDate} from 'ssUtils/date';

type StackCardProps = {
  item: Realm.Object & SidewaysSnapshotRow;
  index: number;
};
const createStackCard =
  (
    updateSnapshot: (
      oldSnapshot: Realm.Object & SidewaysSnapshotRow,
      newInputs: string[],
      newOutputs: string[],
      newRating: number,
    ) => Promise<void>,
    deleteSnapshot: (
      snapshot: Realm.Object & SidewaysSnapshotRow,
      index: number,
    ) => void,
  ): FC<StackCardProps> =>
  props => {
    const {item, index} = props;

    const [inputsToRm, setInputsToRm] = useState<Set<string>>(new Set());
    const [outputsToRm, setOutputsToRm] = useState<Set<string>>(new Set());

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

      await updateSnapshot(item, inputsToKeep, outputsToKeep, item.rating);
    };

    // STYLES
    const genInputStyle = (input: string): ViewStyle => ({
      borderColor: !inputsToRm.has(input) ? 'green' : 'red',
    });
    const genOutputStyle = (output: string): ViewStyle => ({
      borderColor: !outputsToRm.has(output) ? 'green' : 'red',
    });

    return (
      <TouchableOpacity onPress={() => {}}>
        <FlexCol>
          <MyButton onPress={() => deleteSnapshot(item, index)}>
            <MyText>Delete Stack Snapshot X</MyText>
          </MyButton>

          <MyText>{item.timestamp.toDateString()}</MyText>
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
            <FlexRow>
              <DecorationRow
                style={genInputStyle(input)}
                editable={true}
                dRowType={DECORATION_ROW_TYPE.INPUT}
                entityId={input}
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
            <FlexRow>
              <DecorationRow
                style={genOutputStyle(output)}
                editable={true}
                dRowType={DECORATION_ROW_TYPE.OUTPUT}
                entityId={output}
              />
              <MyButton onPress={() => toggleOutputToRm(output)}>
                <MyText>X</MyText>
              </MyButton>
            </FlexRow>
          ))}

          <MyButton onPress={_updateSnapshot}>
            <MyText>Update Stack Snapshot</MyText>
          </MyButton>
        </FlexCol>
      </TouchableOpacity>
    );
  };

type StackListProps = {
  updateSnapshot: (
    oldSnapshot: Realm.Object & SidewaysSnapshotRow,
    newInputs: string[],
    newOutputs: string[],
    newRating: number,
  ) => Promise<void> | never;
  deleteSnapshot: (
    snapshot: Realm.Object & SidewaysSnapshotRow,
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
    (state: RootState) => ({...state.readSidewaysSlice.toplevelReadReducer}),
  );
  const {stackStartDate, readStackSignature} = useSelector(
    (state: RootState) => ({
      ...state.readSidewaysSlice.internalReadReducer.readStackReducer,
    }),
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
  const StackCard = createStackCard(updateSnapshot, deleteSnapshot);

  console.log(searchIndex);
  console.log('searchIndex');

  return (
    <SearchableFlatList
      searchIndex={searchIndex}
      // @ts-ignore
      // TODO: See if this works
      data={stack}
      renderItem={StackCard}
      keyExtractor={(item: SidewaysSnapshotRow): string =>
        item.timestamp.toISOString()
      }
    />
  );
};

export default StackList;