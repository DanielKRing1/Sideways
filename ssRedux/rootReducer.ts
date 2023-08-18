import {combineReducers} from 'redux';

import analytics from './analytics';
import appState from './appState';
import fetched from './fetched';
import input from './input';

export default combineReducers({
  analytics,
  appState,
  fetched,
  input,
});
