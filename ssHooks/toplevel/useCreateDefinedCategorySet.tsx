import React, {FC, useEffect} from 'react';

import {DAILY_JOURNAL_CATEGORY_SET} from 'ssDatabase/api/userJson/category/constants';

import GlobalDriver from 'ssDatabase/api/userJson/globalDriver';

const useCreateDefinedCategorySet = () => {
  // Update in/output cache when 'activeSliceName' changes
  useEffect(() => {
    GlobalDriver.addCS(
      DAILY_JOURNAL_CATEGORY_SET.name,
      DAILY_JOURNAL_CATEGORY_SET.cs,
    );

    console.log('went through');
  }, []);
};

export const UseCreateDefinedCategorySet: FC<{}> = () => {
  useCreateDefinedCategorySet();

  return <></>;
};
