import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {RootState, AppDispatch} from 'ssRedux/index';

export const useHydrateJournal = () => {
  // REDUX
  const {activeSliceName} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    console.log('Hydrate Journal');
  }, [activeSliceName]);
};
