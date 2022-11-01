import React from 'react';
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabScreenProps,
} from '@react-navigation/material-bottom-tabs';

import {
  ANALYTICS_SCREEN_NAME,
  RATE_SCREEN_NAME,
  STACK_SCREEN_NAME,
} from './constants';

import StackViewScreen from '../ssScreens/StackNav/TabView/StackScreen';
import RateScreen from '../ssScreens/StackNav/TabView/RateScreen';
import GraphViewScreen from '../ssScreens/StackNav/TabView/AnayticsScreen';

export type TabNavigatorParamList = {
  [ANALYTICS_SCREEN_NAME]: undefined;
  [STACK_SCREEN_NAME]: undefined;
  [RATE_SCREEN_NAME]: undefined;
};

export type TabNavigatorProps<ScreenName extends keyof TabNavigatorParamList> =
  MaterialBottomTabScreenProps<TabNavigatorParamList, ScreenName>;
export type TabNavigatorNavigationProp<
  ScreenName extends keyof TabNavigatorParamList,
> = TabNavigatorProps<ScreenName>['navigation'];

const Tab = createMaterialBottomTabNavigator<TabNavigatorParamList>();

const TabNavigator = () => (
  <Tab.Navigator initialRouteName={RATE_SCREEN_NAME}>
    <Tab.Screen name={ANALYTICS_SCREEN_NAME} component={GraphViewScreen} />
    <Tab.Screen name={RATE_SCREEN_NAME} component={RateScreen} />
    <Tab.Screen name={STACK_SCREEN_NAME} component={StackViewScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
