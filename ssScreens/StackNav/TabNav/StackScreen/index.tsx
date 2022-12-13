import React, {FC} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SidewaysSnapshotRowPrimitive} from 'ssDatabase/api/core/types';
import {TabNavHeader} from '../../../../ssComponents/Navigation/NavHeader';

import {AppDispatch, RootState} from '../../../../ssRedux';
import {
  startDeleteSnapshot,
  startUpdateSnapshot,
} from '../../../../ssRedux/snapshotCrudSlice';
import StackDatePicker from './components/StackDatePicker';
import StackList from './components/StackList';

// Possible outputs

type StackViewScreenProps = {};
const StackViewScreen: FC<StackViewScreenProps> = props => {
  const {} = props;

  // REDUX
  const {readSSSignature, activeSliceName} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const dispatch: AppDispatch = useDispatch();

  const _updateSnapshot = async (
    oldSnapshot: SidewaysSnapshotRowPrimitive,
    index: number,
    newInputs: string[],
    newOutputs: string[],
    newRating: number,
  ) => {
    dispatch(
      startUpdateSnapshot({
        sliceName: activeSliceName,
        oldSnapshot,
        index,
        newInputs,
        newOutputs,
        newRating,
      }),
    );
  };
  const _deleteSnapshot = async (
    snapshot: SidewaysSnapshotRowPrimitive,
    index: number,
  ) => {
    dispatch(
      startDeleteSnapshot({sliceName: activeSliceName, snapshot, index}),
    );
  };

  return (
    <View
      style={{
        height: '100%',
      }}>
      <TabNavHeader />

      <StackDatePicker />

      <StackList
        updateSnapshot={_updateSnapshot}
        deleteSnapshot={_deleteSnapshot}
      />
    </View>
  );
};

export default StackViewScreen;
