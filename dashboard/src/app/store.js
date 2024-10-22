import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice.js'
import trainerReducer from '../features/trainerSlice.js'
import searchTrainerReducer from '../features/searchTrainerSlice.js'
import employeeReducer from '../features/employeeSlice.js'

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


const rootReducer = combineReducers({ 
    auth: authReducer, 
    trainer: trainerReducer, 
    employee: employeeReducer, 
    searchTrainer: searchTrainerReducer,
});

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