import {combineReducers} from 'redux';

import identityStats from './identityStats';
import recommendationsStats from './recommendationsStats';
import timeseriesStats from './timeseriesStats';

export default combineReducers({
  identityStats,
  recommendationsStats,
  timeseriesStats,
});
