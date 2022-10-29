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
  const {createTimeout} = useTimeout();

  // RAW NAV
  const navigation =
    useNavigation<
      StackNavigatorNavigationProp<keyof StackNavigatorParamList>
    >();

  const {activeSliceName, activeSliceState} = useActiveSliceState();

  // NAV WRAPPER
  // Authorizes navigation requests
  const authorizedStackNavigate = (
    screenName: keyof StackNavigatorParamList,
    params?: StackNavigatorParamList[keyof StackNavigatorParamList],
  ) => {
    switch (activeSliceState) {
      // Valid, can nav
      case ActiveSliceState.VALID_ACTIVE_SLICE:
        navigation.navigate(screenName, params);
        break;

      // Invalid, cannot nav
      case ActiveSliceState.INVALID_ACTIVE_SLICE:
        setErrStatus(ErrorStatus.INVALID_ACTIVE_SLICE);
        break;

      case ActiveSliceState.NO_AVAILABLE_SLICES:
        setErrStatus(ErrorStatus.NO_AVAILABLE_SLICES);
        break;
      default:
        break;
    }
  };

  // EFFECTS
  // Nav to Select Active Slice screen or
  // Add Slice screen on invalid activeSliceName
  useEffect(() => {
    authorizeActiveSlice();
  }, [activeSliceState]);

  const authorizeActiveSlice = () => {
    const resetErrStatus = () => setErrStatus(ErrorStatus.NO_ERR);

    switch (activeSliceState) {
      // 1. INVALID
      // Nav to Select Active Slice screen
      case ActiveSliceState.INVALID_ACTIVE_SLICE:
        navigation.navigate(ACTIVE_SLICE_SCREEN_NAME);

        createTimeout(resetErrStatus, 2000);
        break;
      // Or nav to Add Slice screen
      case ActiveSliceState.NO_AVAILABLE_SLICES:
        navigation.navigate(
          ADD_SLICE_SCREEN_NAME as keyof StackNavigatorParamList,
          {inputSliceName: activeSliceName},
        );

        createTimeout(resetErrStatus, 2000);
        break;

      // 2. VALID
      default:
        // Do nothing
        break;
    }
  };

  return {
    authorizedStackNavigate,
    activeSliceName,
    activeSliceState,
    errStatus,
  };
}
