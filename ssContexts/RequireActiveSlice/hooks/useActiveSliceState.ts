/**
 * For use exclusively in useAuthorizedStackNavigation
 */

import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {ActiveSliceState} from 'ssContexts/constants';
import dbDriver from 'ssDatabase/api/core/dbDriver';
import {RootState} from 'ssRedux/index';

export function useActiveSliceState() {
  // LOCAL STATE
  const [activeSliceState, setActiveSliceState] = useState<ActiveSliceState>(
    ActiveSliceState.INVALID_ACTIVE_SLICE,
  );

  // REDUX
  const {activeSliceName} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );

  // CONTROL NAV ON 'activeSliceName' CHANGE
  useEffect(() => {
    // If no active slice selected or
    // not a valid slice name
    if (
      activeSliceName === '' ||
      !dbDriver.getSliceNames().includes(activeSliceName)
    ) {
      // 1. Invalid
      if (dbDriver.getSliceNames().length > 0)
        setActiveSliceState(ActiveSliceState.INVALID_ACTIVE_SLICE);
      // 2. No available
      else setActiveSliceState(ActiveSliceState.NO_AVAILABLE_SLICES);
    }
    // 3. Valid
    else setActiveSliceState(ActiveSliceState.VALID_ACTIVE_SLICE);
  }, [activeSliceName]);

  return {
    activeSliceState,
    activeSliceName,
  };
}
