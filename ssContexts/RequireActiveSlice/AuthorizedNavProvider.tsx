/**
 * This component will automatically navigate to
 * the 'Select Active Slice' or
 * the 'Add Active Slice' screens,
 * if an invalid activeSliceName is selected
 *
 * It also provides a stack navigator
 * that requires an activeSliceName to navigate elsewhere
 */

import React, {createContext, FC, useEffect, useState} from 'react';
import MyText from 'ssComponents/ReactNative/MyText';
import MyModal from 'ssComponents/View/Modal';

import {
  ErrorStatus,
  useAuthorizedStackNavigation,
} from 'ssContexts/RequireActiveSlice/hooks/useAuthorizedStackNavigation';
import {StackNavigatorParamList} from 'ssNavigation/StackNavigator';

// CONTEXT
type AuthorizedNavContextValueType = {
  authorizedStackNavigate: (
    screenName: keyof StackNavigatorParamList,
    params?:
      | {
          inputSliceName: string;
        }
      | undefined,
  ) => void;
  authorizedGoBack: () => void;
};
const DEFAULT_CONTEXT_VALUE: AuthorizedNavContextValueType = {
  authorizedStackNavigate: (screenName: keyof StackNavigatorParamList) => {},
  authorizedGoBack: () => {},
};
const AuthorizedNavContext: React.Context<AuthorizedNavContextValueType> =
  createContext<AuthorizedNavContextValueType>(DEFAULT_CONTEXT_VALUE);

// PROVIDER
type AuthorizedNavProviderProps = {
  children: React.ReactNode;
};
const AuthorizedNavProvider: FC<AuthorizedNavProviderProps> = props => {
  const {children} = props;

  // AUTHORIZED NAV
  const {authorizedStackNavigate, authorizedGoBack, errStatus, resetErrStatus} =
    useAuthorizedStackNavigation();

  // MODAL
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (errStatus !== ErrorStatus.NO_ERR) setIsOpen(true);
    else setIsOpen(false);
  }, [errStatus]);
  const handleClose = () => {
    resetErrStatus();
  };

  return (
    <AuthorizedNavContext.Provider
      // @ts-ignore
      style={{flex: 1}}
      value={{authorizedStackNavigate, authorizedGoBack}}>
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
    </AuthorizedNavContext.Provider>
  );
};

export {AuthorizedNavContext, AuthorizedNavProvider};
