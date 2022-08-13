import { configureStore } from '@reduxjs/toolkit';
import devToolsEnhancer from 'remote-redux-devtools';

import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  devTools: false,
  enhancers: [devToolsEnhancer({ realtime: true })]
});
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
