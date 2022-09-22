import { combineReducers } from 'redux';
import createSidewaysSlice from './createSidewaysSlice';
import readSidewaysSlice from './readSidewaysSlice';
import rateSidewaysSlice from './rateSidewaysSlice';
import deleteSidewaysSlice from './deleteSidewaysSlice';
import recommendationsSlice from './recommendationsSlice';
import statsSlice from './statsSlice';
import snapshotCrudSlice from './snapshotCrudSlice';

export default combineReducers({
    createSidewaysSlice,
    readSidewaysSlice,
    rateSidewaysSlice,
    deleteSidewaysSlice,
    recommendationsSlice,
    statsSlice,
    snapshotCrudSlice,
});