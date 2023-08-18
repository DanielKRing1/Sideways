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
    (state: RootState) => state.appState.activeJournal,
  );

  return (
    <View
      style={{
        height: '100%',
      }}>
      <TabNavHeader />

      <StackDatePicker />

      <StackList />
    </View>
  );
};

export default StackViewScreen;
