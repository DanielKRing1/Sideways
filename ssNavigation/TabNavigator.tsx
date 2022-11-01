import React from 'react';
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabScreenProps,
} from '@react-navigation/material-bottom-tabs';

import {
  ANALYTICS_SCREEN_NAME,
  RATE_NAVIGATOR_NAME,
  STACK_SCREEN_NAME,
} from './constants';

import StackViewScreen from '../ssScreens/StackNav/TabNav/StackScreen';
import RateNavigator from '../ssScreens/StackNav/TabNav/RateNav';
import GraphViewScreen from '../ssScreens/StackNav/TabNav/AnayticsScreen';

export type TabNavigatorParamList = {
  [ANALYTICS_SCREEN_NAME]: undefined;
  [STACK_SCREEN_NAME]: undefined;
  [RATE_NAVIGATOR_NAME]: undefined;
};

export type TabNavigatorProps<ScreenName extends keyof TabNavigatorParamList> =
  MaterialBottomTabScreenProps<TabNavigatorParamList, ScreenName>;
export type TabNavigatorNavigationProp<
  ScreenName extends keyof TabNavigatorParamList,
> = TabNavigatorProps<ScreenName>['navigation'];

const Tab = createMaterialBottomTabNavigator<TabNavigatorParamList>();

const TabNavigator = () => (
  <Tab.Navigator initialRouteName={RATE_NAVIGATOR_NAME}>
    <Tab.Screen name={ANALYTICS_SCREEN_NAME} component={GraphViewScreen} />
    <Tab.Screen name={RATE_NAVIGATOR_NAME} component={RateNavigator} />
    <Tab.Screen name={STACK_SCREEN_NAME} component={StackViewScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
