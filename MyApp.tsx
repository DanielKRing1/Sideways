/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

// import './wdyr'; // <--- first import

if (Platform.OS === 'android') {
  // only android needs polyfill
  require('intl'); // import intl object
  require('intl/locale-data/jsonp/en-IN'); // load the required locale details
}

import React from 'react';
import {Platform, SafeAreaView} from 'react-native';

import store from './ssRedux';
import {Provider as ReduxProvider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import StackNavigator from './ssNavigation/StackNavigator';

import {
  DbLoaderContext,
  DbLoaderProvider,
} from './ssContexts/DbLoader/DbLoader';
import {
  RequireActiveSliceContext,
  RequireActiveSliceProvider,
} from './ssContexts/RequireActiveSlice/RequireActiveSlice';
import MyThemeProvider from './ssTheme/ThemeProvider';
import {resetRealm} from './ssRealm/reset';
import {UseStartCacheAllDbInputsOutputs} from 'ssHooks/toplevel/useStartCacheAllDbInputsOutputs';
import {UseCreateDefinedCategorySet} from 'ssHooks/toplevel/useCreateDefinedCategorySet';

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
  return (
    <DbLoaderProvider>
      <RequireActiveSliceProvider>
        <UseStartCacheAllDbInputsOutputs />
        <UseCreateDefinedCategorySet />

        <StackNavigator />
      </RequireActiveSliceProvider>
    </DbLoaderProvider>
  );
};
