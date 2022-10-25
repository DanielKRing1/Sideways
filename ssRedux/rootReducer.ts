import {combineReducers} from 'redux';
import createSidewaysSlice from './createSidewaysSlice';
import readSidewaysSlice from './readSidewaysSlice';
import rateSidewaysSlice from './rateSidewaysSlice';
import deleteSidewaysSlice from './deleteSidewaysSlice';

import snapshotCrudSlice from './snapshotCrudSlice';

import analyticsSlice from './analyticsSlice';

import userJsonSlice from './userJson';

export default combineReducers({
  createSidewaysSlice,
  readSidewaysSlice,
  rateSidewaysSlice,
  deleteSidewaysSlice,

  snapshotCrudSlice,

  analyticsSlice,

  userJsonSlice,
});
