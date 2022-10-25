/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useContext} from 'react';
import {SafeAreaView} from 'react-native';

import store from './ssRedux';
import {Provider as ReduxProvider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import StackNavigator from './ssNavigation/StackNavigator';

import {
  DbLoaderContext,
  DbLoaderProvider,
} from './ssContexts/DbLoader/DbLoader';
import MyThemeProvider from './ssTheme/ThemeProvider';
import RequireActiveSlice from './ssComponents/TopLevel/RequireActiveSlice';
import {resetRealm} from './ssRealm/reset';

const NewApp = () => {
  // resetRealm();

  return (
    <SafeAreaView style={{flex: 1}}>
      <ReduxProvider store={store}>
        <GestureHandlerRootView style={{flex: 1}}>
          <MyThemeProvider>
            <NavigationContainer>
              <AppContent />
            </NavigationContainer>
          </MyThemeProvider>
        </GestureHandlerRootView>
      </ReduxProvider>
    </SafeAreaView>
  );
};

export default NewApp;

const AppContent = () => {
  const {isLoaded} = useContext(DbLoaderContext);

  return (
    <DbLoaderProvider>
      <RequireActiveSlice>
        <StackNavigator />
      </RequireActiveSlice>
    </DbLoaderProvider>
  );
};
