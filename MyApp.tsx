/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useContext } from 'react';
import { SafeAreaView, Text, TextInput, View } from 'react-native';
import styled from 'styled-components/native';

import store from './redux';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import StackNavigator from './navigation/StackNavigator';

import { DbLoaderContext, DbLoaderProvider } from './contexts/DbLoader';
import MyThemeProvider from './theme/ThemeProvider';
import MyTextInput from './components/ReactNative/MyTextInput';
import MyText from './components/ReactNative/MyText';
import RequireActiveSlice from './components/TopLevel/RequireActiveSlice';
import { resetRealm } from './realm/reset';

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
  const { isLoaded } = useContext(DbLoaderContext);

  return (
    <DbLoaderProvider>
      <RequireActiveSlice>

        <StackNavigator />

      </RequireActiveSlice>
    </DbLoaderProvider>
  );
};
