import { combineReducers } from 'redux';
import createSidewaysSlice from './createSidewaysSlice';
import readSidewaysSlice from './readSidewaysSlice';
import rateSidewaysSlice from './rateSidewaysSlice';
import deleteSidewaysSlice from './deleteSidewaysSlice';

import snapshotCrudSlice from './snapshotCrudSlice';

import identityStatsSlice from './identityStatsSlice';
import recommendationStatsSlice from './recommendationStatsSlice';
import timeSeriesStatsSlice from './timeSeriesStatsSlice';

export default combineReducers({
    createSidewaysSlice,
    readSidewaysSlice,
    rateSidewaysSlice,
    deleteSidewaysSlice,
    
    snapshotCrudSlice,

    identityStatsSlice,
    recommendationStatsSlice,
    timeSeriesStatsSlice,
});