import {combineReducers} from 'redux';

import createCategorySet from './createCategorySet';
import createJournal from './createJournal';
import deleteJournal from './deleteJournal';
import rateJournal from './rateJournal';
import undoRateJournal from './undoRateJournal';
import readGraph from './readGraph';
import readStack from './readStack';

export default combineReducers({
  createCategorySet,
  createJournal,
  deleteJournal,
  rateJournal,
  readGraph,
  readStack,
  undoRateJournal,
});
