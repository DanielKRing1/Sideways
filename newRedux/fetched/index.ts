import {combineReducers} from 'redux';

import cachedInputsOutputs from './cachedInputsOutputs';
import userJson from './userJson';

export default combineReducers({
  cachedInputsOutputs,
  userJson,
});
