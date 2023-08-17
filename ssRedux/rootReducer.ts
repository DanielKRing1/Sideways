import {combineReducers} from 'redux';

import analytics from 'newRedux/analytics';
import appState from 'newRedux/appState';
import fetched from 'newRedux/fetched';
import input from 'newRedux/input';

export default combineReducers({
  analytics,
  appState,
  fetched,
  input,
});
