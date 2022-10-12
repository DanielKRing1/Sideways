import { combineReducers } from "@reduxjs/toolkit";

import identityStatsSlice from './identityStatsSlice';
import recoStatsSlice from './recoStatsSlice';
import timeseriesStatsSlice from './timeseriesStatsSlice';

export default combineReducers({
    identityStatsSlice,
    recoStatsSlice,
    timeseriesStatsSlice,
});