import { combineReducers } from "@reduxjs/toolkit";

import colorSlice from './colorSlice';
import iconSlice from './iconSlice';

export default combineReducers({
    colorSlice,
    iconSlice,
});