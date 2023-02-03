import React from 'react';
import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';

import {
  RATE_HOME_SCREEN_NAME,
  RATE_INPUT_SCREEN_NAME,
  ASSIGN_CATEGORY_SCREEN_NAME,
} from './constants';
import RateHomeScreen from 'ssScreens/StackNav/TabNav/RateNav/RateHomeScreen';
import RateInputScreen from 'ssScreens/StackNav/TabNav/RateNav/RateHomeScreen';
import AssignCategoryScreen from 'ssScreens/StackNav/TabNav/RateNav/AssignCategoryScreen';

export type RateNavigatorParamList = {
  [RATE_HOME_SCREEN_NAME]: undefined;
  [RATE_INPUT_SCREEN_NAME]: {
    input: string;
  };
  [ASSIGN_CATEGORY_SCREEN_NAME]: {
    input: string;
  };
};
export type RateNavigatorProps<
  ScreenName extends keyof RateNavigatorParamList,
> = StackScreenProps<RateNavigatorParamList, ScreenName>;
export type RateNavigatorNavigationProp = RateNavigatorProps<
  keyof RateNavigatorParamList
>['navigation'];

const Stack = createStackNavigator<RateNavigatorParamList>();

const RateNavigator = () => (
  <Stack.Navigator
    initialRouteName={RATE_HOME_SCREEN_NAME}
    screenOptions={{headerShown: false}}>
    <Stack.Screen name={RATE_HOME_SCREEN_NAME} component={RateHomeScreen} />
    <Stack.Screen name={RATE_INPUT_SCREEN_NAME} component={RateInputScreen} />
    <Stack.Screen
      name={ASSIGN_CATEGORY_SCREEN_NAME}
      component={AssignCategoryScreen}
    />
  </Stack.Navigator>
);

export default RateNavigator;
