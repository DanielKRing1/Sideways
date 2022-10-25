import React, {FC} from 'react';
import {View} from 'react-native';

// NAVIGATION
import {SETTINGS_SCREEN_NAME} from '../../../ssNavigation/constants';
import {StackNavigatorProps} from '../../../ssNavigation/StackNavigator';

// COMPONENTS
import Todo from '../../../ssComponents/Dev/Todo';
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
