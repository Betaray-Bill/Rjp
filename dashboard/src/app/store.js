import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice.js'
import trainerReducer from '../features/trainerSlice.js'
import searchTrainerReducer from '../features/searchTrainerSlice.js'
import employeeReducer from '../features/employeeSlice.js'
import projectReducer from '../features/projectSlice.js'
import currentTrainerReducer from '../features/currentTrainerSlice.js'
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
    currentTrainer: currentTrainerReducer,
    employee: employeeReducer,
    searchTrainer: searchTrainerReducer,
    project: projectReducer
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