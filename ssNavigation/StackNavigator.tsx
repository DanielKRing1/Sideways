import React from 'react';
import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';

import {
  TAB_NAV_NAME,
  PROFILE_SCREEN_NAME,
  ACTIVE_SLICE_SCREEN_NAME,
  ADD_SLICE_SCREEN_NAME,
  ADD_CATEGORY_SET_SCREEN_NAME,
  SETTINGS_SCREEN_NAME,
} from './constants';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../ssScreens/StackNav/ProfileScreen';
import SettingsScreen from '../ssScreens/StackNav/SettingsScreen';
import ActiveSliceScreen from '../ssScreens/StackNav/ActiveSliceScreen';
import AddSliceScreen from '../ssScreens/StackNav/AddSliceScreen';
import AddCategorySetScreen from 'ssScreens/StackNav/AddCategorySet';

export type StackNavigatorParamList = {
  [TAB_NAV_NAME]: undefined;
  [PROFILE_SCREEN_NAME]: undefined;
  [SETTINGS_SCREEN_NAME]: undefined;
  [ACTIVE_SLICE_SCREEN_NAME]: undefined;
  [ADD_SLICE_SCREEN_NAME]: {
    inputSliceName: string;
  };
  [ADD_CATEGORY_SET_SCREEN_NAME]: undefined;
};
export type StackNavigatorProps<
  ScreenName extends keyof StackNavigatorParamList,
> = StackScreenProps<StackNavigatorParamList, ScreenName>;
export type StackNavigatorNavigationProp = StackNavigatorProps<
  keyof StackNavigatorParamList
>['navigation'];

const Stack = createStackNavigator<StackNavigatorParamList>();

const StackNavigator = () => (
  <Stack.Navigator
    initialRouteName={TAB_NAV_NAME}
    screenOptions={{headerShown: false}}>
    <Stack.Screen name={TAB_NAV_NAME} component={TabNavigator} />
    <Stack.Screen name={PROFILE_SCREEN_NAME} component={ProfileScreen} />
    <Stack.Screen name={SETTINGS_SCREEN_NAME} component={SettingsScreen} />
    <Stack.Screen
      name={ACTIVE_SLICE_SCREEN_NAME}
      component={ActiveSliceScreen}
    />
    <Stack.Screen name={ADD_SLICE_SCREEN_NAME} component={AddSliceScreen} />
    <Stack.Screen
      name={ADD_CATEGORY_SET_SCREEN_NAME}
      component={AddCategorySetScreen}
    />
  </Stack.Navigator>
);

export default StackNavigator;
