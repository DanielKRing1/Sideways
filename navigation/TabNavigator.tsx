import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createMaterialBottomTabNavigator, MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';

import { GRAPHS_SCREEN_NAME, RATE_SCREEN_NAME, STACK_SCREEN_NAME } from './constants';

import StackViewScreen from '../screens/Stack/Tab/StackView';
import RateScreen from '../screens/Stack/Tab/RateSlice';
import GraphViewScreen from '../screens/Stack/Tab/GraphView';

export type TabNavigatorParamList = {
  [GRAPHS_SCREEN_NAME]: undefined;
  [STACK_SCREEN_NAME]: undefined;
  [RATE_SCREEN_NAME]: undefined;
};

export type TabNavigatorProps<ScreenName extends keyof TabNavigatorParamList> = MaterialBottomTabScreenProps<TabNavigatorParamList, ScreenName>;
export type TabNavigatorNavigationProp<ScreenName extends keyof TabNavigatorParamList> = TabNavigatorProps<ScreenName>['navigation'];

const Tab = createMaterialBottomTabNavigator<TabNavigatorParamList>();

const TabNavigator = () => (
    <Tab.Navigator initialRouteName={RATE_SCREEN_NAME}>
      <Tab.Screen name={GRAPHS_SCREEN_NAME} component={GraphViewScreen}/>
      <Tab.Screen name={RATE_SCREEN_NAME} component={RateScreen}/>
      <Tab.Screen name={STACK_SCREEN_NAME} component={StackViewScreen}/>
    </Tab.Navigator>
  );

export default TabNavigator;
