import React, {FC} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';

// REDUX
import {AppDispatch} from '../../../ssRedux';
import {startSetActiveSliceName} from '../../../ssRedux/appState/activeJournal';

// NAVIGATION
import {StackNavigatorProps} from '../../../ssNavigation/StackNavigator';
import {
  ACTIVE_SLICE_SCREEN_NAME,
  TAB_NAV_NAME,
} from '../../../ssNavigation/constants';

// COMPONENTS
import ExistingSliceList from './components/ExistingSliceList';

// NAV
import {ActiveSliceNavHeader} from '../../../ssComponents/Navigation/NavHeader';
import {startDeleteSlice} from '../../../ssRedux/input/deleteJournal';

const ActiveSliceScreen: FC<
  StackNavigatorProps<typeof ACTIVE_SLICE_SCREEN_NAME>
> = props => {
  const {navigation} = props;

  // REDUX HOOKS
  const dispatch: AppDispatch = useDispatch();

  // SLICE HANDLER METHODS
  const handleSelectActiveSlice = (sliceName: string) => {
    dispatch(startSetActiveSliceName(sliceName));

    navigation.navigate(TAB_NAV_NAME);
  };

  const handleDeleteSlice = (sliceName: string) => {
    dispatch(startDeleteSlice(sliceName));
  };

  return (
    <View>
      <ActiveSliceNavHeader />

      <ExistingSliceList
        onSelectSlice={handleSelectActiveSlice}
        onDeleteSlice={handleDeleteSlice}
      />
    </View>
  );
};

export default ActiveSliceScreen;
