/**
 * For use exclusively in RequireActiveSlice component
 */

import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {ActiveSliceState} from 'ssContexts/constants';
import {
  StackNavigatorNavigationProp,
  StackNavigatorParamList,
} from 'ssNavigation/StackNavigator';
import {useActiveSliceState} from './useActiveSliceState';
import {
  ACTIVE_SLICE_SCREEN_NAME,
  ADD_SLICE_SCREEN_NAME,
} from 'ssNavigation/constants';
import {useTimeout} from 'ssHooks/useTimeout';

export enum ErrorStatus {
  NO_ERR,
  INVALID_ACTIVE_SLICE = 'Please select a valid active slice first',
  NO_AVAILABLE_SLICES = 'Please create an active slice first',
}

export function useAuthorizedStackNavigation() {
  // LOCAL STATE
  const [errStatus, setErrStatus] = useState<ErrorStatus>(ErrorStatus.NO_ERR);

  // TIMEOUT
  const {createTO} = useTimeout();

  // RAW NAV
  const navigation =
    useNavigation<
      StackNavigatorNavigationProp<keyof StackNavigatorParamList>
    >();

  const {activeSliceName, activeSliceState} = useActiveSliceState();

  // NAV WRAPPER
  // Authorizes navigation.navigate requests
  const authorizedStackNavigate = (
    screenName: keyof StackNavigatorParamList,
    params?: StackNavigatorParamList[keyof StackNavigatorParamList],
  ) => {
    authorizeNavAction(() => navigation.navigate(screenName, params));
  };

  // Authorizes navigation.goBack requests
  const authorizedGoBack = () => {
    authorizeNavAction(() => navigation.goBack());
  };

  const resetErrStatus = () => setErrStatus(ErrorStatus.NO_ERR);

  // AUTOMATIC EFFECTS
  // Nav to Select Active Slice screen or
  // Add Slice screen on invalid activeSliceName
  useEffect(() => {
    authorizeNavAction();
  }, [activeSliceState]);

  const authorizeNavAction = (actionCb?: () => void) => {
    if (!actionCb) actionCb = () => {};

    switch (activeSliceState) {
      // 1. INVALID
      // Nav to Select Active Slice screen
      case ActiveSliceState.INVALID_ACTIVE_SLICE:
        navigation.navigate(ACTIVE_SLICE_SCREEN_NAME);

        setErrStatus(ErrorStatus.INVALID_ACTIVE_SLICE);
        createTO(resetErrStatus, 2000);
        break;
      // Or nav to Add Slice screen
      case ActiveSliceState.NO_AVAILABLE_SLICES:
        navigation.navigate(
          ADD_SLICE_SCREEN_NAME as keyof StackNavigatorParamList,
          {inputSliceName: activeSliceName},
        );

        setErrStatus(ErrorStatus.NO_AVAILABLE_SLICES);
        createTO(resetErrStatus, 2000);
        break;

      // 2. VALID
      default:
        actionCb();
        resetErrStatus();
        break;
    }
  };

  return {
    authorizedStackNavigate,
    authorizedGoBack,
    resetErrStatus,
    activeSliceName,
    activeSliceState,
    errStatus,
  };
}
