import { combineReducers } from 'redux';
import createSidewaysSlice from './createSidewaysSlice';
import readSidewaysSlice from './readSidewaysSlice';
import rateSidewaysSlice from './rateSidewaysSlice';
import deleteSidewaysSlice from './deleteSidewaysSlice';
import identityStatsSlice from './identityStatsSlice';
import recommendationsSlice from './recommendationsSlice';
import snapshotCrudSlice from './snapshotCrudSlice';

export default combineReducers({
    createSidewaysSlice,
    readSidewaysSlice,
    rateSidewaysSlice,
    deleteSidewaysSlice,
    identityStatsSlice,
    recommendationsSlice,
    snapshotCrudSlice,
});