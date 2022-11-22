/**
 * For use exclusively in RequireActiveSlice
 */

import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {ActiveSliceState} from 'ssContexts/constants';
import dbDriver from 'ssDatabase/api/core/dbDriver';
import {AppDispatch, RootState} from 'ssRedux/index';
import {startCacheAllDbInputsOutputs} from 'ssRedux/readSidewaysSlice';

export function useActiveSliceState() {
  // LOCAL STATE
  const [activeSliceState, setActiveSliceState] = useState<ActiveSliceState>(
    ActiveSliceState.INVALID_ACTIVE_SLICE,
  );

  // REDUX
  const {activeSliceName} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const dispatch: AppDispatch = useDispatch();

  // CONTROL NAV ON 'activeSliceName' CHANGE
  useEffect(() => {
    // 1. UPDATE SLICE (IN/VALID) STATE
    // If no active slice selected or
    // not a valid slice name
    if (
      activeSliceName === '' ||
      !dbDriver.getSliceNames().includes(activeSliceName)
    ) {
      // 1.1. Invalid
      if (dbDriver.getSliceNames().length > 0)
        setActiveSliceState(ActiveSliceState.INVALID_ACTIVE_SLICE);
      // 1.2. No available
      else setActiveSliceState(ActiveSliceState.NO_AVAILABLE_SLICES);
    }
    // 1.3. Valid
    else setActiveSliceState(ActiveSliceState.VALID_ACTIVE_SLICE);

    // 2. UPDATE IN/OUTPUT CACHE
    dispatch(startCacheAllDbInputsOutputs());
  }, [activeSliceName]);

  return {
    activeSliceState,
    activeSliceName,
  };
}
