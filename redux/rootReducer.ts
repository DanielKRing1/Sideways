import { combineReducers } from 'redux';
import createSidewaysSlice from './createSidewaysSlice';
import readSidewaysSlice from './readSidewaysSlice';
import rateSidewaysSlice from './rateSidewaysSlice';
import deleteSidewaysSlice from './deleteSidewaysSlice';
import recommendationsSlice from './recommendationsSlice';

export default combineReducers({
    createSidewaysSlice,
    readSidewaysSlice,
    rateSidewaysSlice,
    deleteSidewaysSlice,
    recommendationsSlice,
});