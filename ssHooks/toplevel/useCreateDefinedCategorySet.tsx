import React, {FC, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {
  DAILY_JOURNAL_CATEGORY_SET,
  NO_ACTIVE_SLICE_NAME,
} from 'ssDatabase/api/userJson/category/constants';

import GlobalDriver from 'ssDatabase/api/userJson/globalDriver';
import {RootState, AppDispatch} from 'ssRedux/index';
import {startRefreshAllUserJson} from 'ssRedux/userJson';

const useCreateDefinedCategorySet = () => {
  // REDUX
  const {activeSliceName} = useSelector(
    (state: RootState) => state.readSidewaysSlice.toplevelReadReducer,
  );
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    // 1. Create predefined Category Sets
    GlobalDriver.addPredefinedCS(
      DAILY_JOURNAL_CATEGORY_SET.name,
      DAILY_JOURNAL_CATEGORY_SET.cs,
    );

    // 2. Refresh UserJsonMap after creating default Category Sets, so
    //    Category Set name -> id is available for ui
    dispatch(startRefreshAllUserJson());

    console.log('went through');
  }, []);
};

export const UseCreateDefinedCategorySet: FC<{}> = () => {
  useCreateDefinedCategorySet();

  return <></>;
};
