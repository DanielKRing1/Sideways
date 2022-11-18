import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import dbDriver from 'ssDatabase/api/core/dbDriver';
import userJsonDriver from 'ssDatabase/api/userJson';
import {AppDispatch, RootState} from 'ssRedux/index';
import {startRefreshAllUserJson} from 'ssRedux/userJson';

export const useDbDriverLoader = () => {
  // LOCAL STATE
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // REDUX
  const {activeSliceName} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const dispatch: AppDispatch = useDispatch();

  // LOAD
  const load = async (): Promise<void> => {
    console.log('load 0');

    const loadPromises: Promise<any>[] = [];

    console.log('load 1');

    // Core
    if (!dbDriver.isLoaded) loadPromises.push(dbDriver.load());

    console.log('load 2');

    // Decorations
    if (!userJsonDriver.isLoaded) console.log('load 2.1.');

    loadPromises.push(userJsonDriver.load(activeSliceName));

    console.log('load 3');
    // Parallel await
    await Promise.all(loadPromises);

    console.log('load 4');

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
    const asyncEffect = async () => {
      await load();

      // Refresh UserJsonMap
      dispatch(startRefreshAllUserJson());
    };

    asyncEffect();
  }, [activeSliceName]);

  return {
    isLoaded,
    load,
    closeAll,
  };
};
