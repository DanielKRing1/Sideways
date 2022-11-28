import React, {FC, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {RootState, AppDispatch} from 'ssRedux/index';
import {startCacheAllDbInputsOutputs} from 'ssRedux/readSidewaysSlice';

const useStartCacheAllDbInputsOutputs = () => {
  // REDUX
  const {activeSliceName} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const dispatch: AppDispatch = useDispatch();

  // Update in/output cache when 'activeSliceName' changes
  useEffect(() => {
    dispatch(startCacheAllDbInputsOutputs());
  }, [activeSliceName]);
};

export const UseStartCacheAllDbInputsOutputs: FC<{}> = () => {
  useStartCacheAllDbInputsOutputs();

  return <></>;
};
