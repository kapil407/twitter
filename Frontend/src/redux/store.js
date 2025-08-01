import {configureStore,combineReducers} from "@reduxjs/toolkit";

import userSlice from './userSlice.js'
import tweetSlice from './tweetSlice.js'
import messageSlice from './messageSlice.js'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  import storage from 'redux-persist/lib/storage'
  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }

const rootReducer = combineReducers({
    user:userSlice,
    tweet:tweetSlice,
    message:messageSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store=configureStore({   // main bhandar 
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),

});
export default store