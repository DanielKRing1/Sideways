import {combineReducers} from 'redux';
import createSidewaysSlice from './createSidewaysSlice';
import createCategorySetSlice from './createCategorySetSlice';
import readSidewaysSlice from './readSidewaysSlice';
import rateSidewaysSlice from './rateSidewaysSlice';
import undorateSidewaysSlice from './undorateSidewaysSlice';
import deleteSidewaysSlice from './deleteSidewaysSlice';

import snapshotCrudSlice from './snapshotCrudSlice';

import analyticsSlice from './analyticsSlice';

import userJsonSlice from './userJson';

export default combineReducers({
  createSidewaysSlice,
  createCategorySetSlice,
  readSidewaysSlice,
  rateSidewaysSlice,
  undorateSidewaysSlice,
  deleteSidewaysSlice,

  snapshotCrudSlice,

  analyticsSlice,

  userJsonSlice,
});
