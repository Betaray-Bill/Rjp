import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice.js'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({ auth: authReducer });

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
    reducer: persistedReducer
})

export const persistor = persistStore(store);
// export default store