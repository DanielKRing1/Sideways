import React, {FC} from 'react';
import {View, Text, Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

// NAVIGATION
import {
  TABS_SCREEN_NAME,
  SETTINGS_SCREEN_NAME,
} from '../../../ssNavigation/constants';
import {StackNavigatorProps} from '../../../ssNavigation/StackNavigator';

// COMPONENTS
import Todo from '../../../ssComponents/Dev/Todo';
import BackButton from '../../../ssNavigation/components/Buttons/BackButton';
import {SettingsHeader} from '../../../ssComponents/Navigation/NavHeader';

const SettingsScreen: FC<StackNavigatorProps<typeof SETTINGS_SCREEN_NAME>> = ({
  navigation,
}) => (
  <View>
    <SettingsHeader />

    <Todo name="?" />
  </View>
);

export default SettingsScreen;
