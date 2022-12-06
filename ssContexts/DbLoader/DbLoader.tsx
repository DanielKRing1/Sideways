import React, {createContext, FC, useEffect} from 'react';

import {useDbDriverLoader} from '../../ssHooks/useDbDriverLoader';
import {LoadingComponent} from './components/LoadingComponent';

// CONTEXT
type DbLoaderContextValueType = {
  isLoaded: boolean;
  load: () => Promise<void>;
  closeAll: () => Promise<void>;
};
const DEFAULT_CONTEXT_VALUE: DbLoaderContextValueType = {
  isLoaded: false,
  load: async () => {},
  closeAll: async () => {},
};
const DbLoaderContext: React.Context<DbLoaderContextValueType> =
  createContext<DbLoaderContextValueType>(DEFAULT_CONTEXT_VALUE);

// PROVIDER
type DbLoaderProviderType = {
  children: React.ReactNode;
};
const DbLoaderProvider: FC<DbLoaderProviderType> = props => {
  const {children} = props;

  // TODO Add useMemo?
  const {isLoaded, load, closeAll} = useDbDriverLoader();

  useEffect(() => {
    console.log(`DbLoader.isLoaded: ${isLoaded}`);
  }, [isLoaded]);

  console.log('DBLOADER RERENDERING');

  return (
    <DbLoaderContext.Provider
      // @ts-ignore
      style={{flex: 1}}
      value={{isLoaded, load, closeAll}}>
      {!isLoaded ? <LoadingComponent /> : children}
    </DbLoaderContext.Provider>
  );
};

export {DbLoaderContext, DbLoaderProvider};
