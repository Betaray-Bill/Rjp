import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice.js'
import trainerReducer from '../features/trainerSlice.js'

import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import { getDefaultMiddleware } from '@reduxjs/toolkit';

const rootReducer = combineReducers({ auth: authReducer, trainer: trainerReducer });

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        }
    }),
})

export const persistor = persistStore(store);