/**
 * This component will automatically navigate to
 * the 'Select Active Slice' or
 * the 'Add Active Slice' screens,
 * if an invalid activeSliceName is selected
 *
 * It also provides a stack navigator
 * that requires an activeSliceName to navigate elsewhere
 */

import {useNavigation} from '@react-navigation/native';
import React, {createContext, FC, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import MyText from 'ssComponents/ReactNative/MyText';
import MyModal from 'ssComponents/View/Modal';
import {ActiveSliceState} from 'ssContexts/constants';
import {
  ACTIVE_SLICE_SCREEN_NAME,
  ADD_SLICE_SCREEN_NAME,
} from 'ssNavigation/constants';

import {StackNavigatorNavigationProp} from 'ssNavigation/StackNavigator';
import {AppDispatch, RootState} from 'ssRedux/index';
import {startRefreshAllUserJson} from 'ssRedux/userJson';
import {useActiveSliceState} from './hooks/useActiveSliceState';

// CONTEXT
type RequireActiveSliceContextValueType = {};
const DEFAULT_CONTEXT_VALUE: RequireActiveSliceContextValueType = {};
const RequireActiveSliceContext: React.Context<RequireActiveSliceContextValueType> =
  createContext<RequireActiveSliceContextValueType>(DEFAULT_CONTEXT_VALUE);

// PROVIDER
type RequireActiveSliceProviderProps = {
  children: React.ReactNode;
};
const RequireActiveSliceProvider: FC<
  RequireActiveSliceProviderProps
> = props => {
  const {children} = props;

  // REDUX
  const {activeSliceName} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const dispatch: AppDispatch = useDispatch();

  // NAVIGATION
  const navigation: StackNavigatorNavigationProp = useNavigation();

  // ACTIVESLICE STATUS
  const {activeSliceState} = useActiveSliceState();

  // EFFECTS
  // activeSliceName is no longer valid
  useEffect(() => {
    switch (activeSliceState) {
      case ActiveSliceState.INVALID_ACTIVE_SLICE:
        navigation.navigate(ACTIVE_SLICE_SCREEN_NAME);
        break;
      case ActiveSliceState.NO_AVAILABLE_SLICES:
        navigation.navigate(ADD_SLICE_SCREEN_NAME, {inputSliceName: ''});
        break;
      case ActiveSliceState.VALID_ACTIVE_SLICE:
      default:
        break;
    }
  }, [activeSliceState]);

  // Refresh UserJsonMap
  useEffect(() => {
    dispatch(startRefreshAllUserJson());
  }, [activeSliceName]);

  // MODAL
  // TODO: Add Modal to explain navigation limitations
  const [isOpen, setIsOpen] = useState(false);
  const [errStatus, setErrStatus] = useState('');

  // HANDLERS
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <RequireActiveSliceContext.Provider
      // @ts-ignore
      style={{flex: 1}}
      value={{}}>
      <>
        {/* CONTENT */}
        {children}

        {/* ERROR MODAL */}
        <MyModal
          backgroundStyle={{
            backgroundColor: 'transparent',
          }}
          contentContainerStyle={{
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          isOpen={isOpen}
          close={handleClose}>
          <MyText style={{fontWeight: 'bold', color: 'white'}}>
            {errStatus}
          </MyText>
        </MyModal>
      </>
    </RequireActiveSliceContext.Provider>
  );
};

export {RequireActiveSliceContext, RequireActiveSliceProvider};
