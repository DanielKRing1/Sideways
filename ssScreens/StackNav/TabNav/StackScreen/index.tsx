import React, {FC} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {TabNavHeader} from '../../../../ssComponents/Navigation/NavHeader';

import {RootState} from '../../../../ssRedux';
import StackDatePicker from './components/StackDatePicker';
import StackList from './components/StackList';

// Possible outputs

type StackViewScreenProps = {};
const StackViewScreen: FC<StackViewScreenProps> = props => {
  const {} = props;

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
