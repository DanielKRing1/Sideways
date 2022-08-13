import React from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';

import { TABS_SCREEN_NAME, PROFILE_SCREEN_NAME, ACTIVE_SLICE_SCREEN_NAME, ADD_SLICE_SCREEN_NAME, SETTINGS_SCREEN_NAME } from './constants';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/Stack/ProfileScreen';
import SettingsScreen from '../screens/Stack/SettingsScreen';
import ActiveSliceScreen from '../screens/Stack/ActiveSliceScreen';
import AddSliceScreen from '../screens/Stack/AddSliceScreen';

export type StackNavigatorParamList = {
    [TABS_SCREEN_NAME]: undefined;
    [PROFILE_SCREEN_NAME]: undefined;
    [SETTINGS_SCREEN_NAME]: undefined;
    [ACTIVE_SLICE_SCREEN_NAME]: undefined;
    [ADD_SLICE_SCREEN_NAME]: {
        inputSliceName: string;
    };
};
export type StackNavigatorProps<ScreenName extends keyof StackNavigatorParamList> = StackScreenProps<StackNavigatorParamList, ScreenName>;
export type StackNavigatorNavigationProp<ScreenName extends keyof StackNavigatorParamList> = StackNavigatorProps<ScreenName>['navigation'];

const Stack = createStackNavigator<StackNavigatorParamList>();

const StackNavigator = () => (
    <Stack.Navigator initialRouteName={TABS_SCREEN_NAME} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={TABS_SCREEN_NAME} component={TabNavigator}/>
        <Stack.Screen name={PROFILE_SCREEN_NAME} component={ProfileScreen}/>
        <Stack.Screen name={SETTINGS_SCREEN_NAME} component={SettingsScreen}/>
        <Stack.Screen name={ACTIVE_SLICE_SCREEN_NAME} component={ActiveSliceScreen}/>
        <Stack.Screen name={ADD_SLICE_SCREEN_NAME} component={AddSliceScreen}/>
    </Stack.Navigator>
);

export default StackNavigator;
