import {combineReducers} from 'redux';

import analyticsReducers from 'newRedux/analytics';
import appStateReducers from 'newRedux/appState';
import fetchedReducers from 'newRedux/fetched';
import inputReducers from 'newRedux/input';

export default combineReducers({
  analyticsReducers,
  appStateReducers,
  fetchedReducers,
  inputReducers,
});
