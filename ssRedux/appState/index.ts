import {combineReducers} from 'redux';

import activeJournal from './activeJournal';
import selectedAnalytics from './selectedAnalytics';

export default combineReducers({
  activeJournal,
  selectedAnalytics,
});
