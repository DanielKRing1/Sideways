import {useEffect, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import dbDriver from 'ssDatabase/api/core/dbDriver';
import userJsonDriver from 'ssDatabase/api/userJson';
import {NO_ACTIVE_SLICE_NAME} from 'ssDatabase/api/userJson/category/constants';
import {AppDispatch, RootState} from 'ssRedux/index';
import {startCacheAllDbInputsOutputs} from 'ssRedux/fetched/cachedInputsOutputs';
import {startRefreshAllUserJson} from 'ssRedux/fetched/userJson';

export const useHydrateJournal = () => {
  // LOCAL STATE
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // REDUX
  const {activeSliceName} = useSelector(
    (state: RootState) => state.appState.activeJournal,
  );
  const dispatch: AppDispatch = useDispatch();

  // LOAD
  const load = async (): Promise<void> => {
    // About to load
    setIsLoaded(false);

    const loadPromises: Promise<any>[] = [];

    // Core
    loadPromises.push(dbDriver.load());

    // Decorations
    loadPromises.push(userJsonDriver.load(activeSliceName));
    // Parallel await
    await Promise.all(loadPromises);

    // Is now loaded
    setIsLoaded(true);
  };
  const closeAll = async (): Promise<void> => {
    const closePromises: Promise<any>[] = [];

    // Core
    closePromises.push(dbDriver.closeAll());

    // Decorations
    closePromises.push(userJsonDriver.closeAll());

    // Parallel await
    await Promise.all(closePromises);

    // Is now not loaded
    setIsLoaded(false);
  };

  // Reload everytime activeSliceName changes
  useEffect(() => {
    (async () => {
      await load();

      // 1. Refresh UserJsonMap after switching active slices
      if (activeSliceName === NO_ACTIVE_SLICE_NAME) {
        return;
      }

      dispatch(startRefreshAllUserJson());
      dispatch(startCacheAllDbInputsOutputs());
    })();
  }, [activeSliceName]);

  return {
    isLoaded,
    load,
    closeAll,
  };
};
