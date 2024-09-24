import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authApi } from './services/authService';

const rootReducer = combineReducers({
    auth: authReducer,
    // [authApi.reducerPath]: authApi.reducer
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(authApi.middleware),
});

export const persistor = persistStore(store);