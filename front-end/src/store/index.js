import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../reducers';
import { thunk } from 'redux-thunk';
import logger from 'redux-logger';

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: [],
};

const pReducer = persistReducer(persistConfig, rootReducer);

let middleware = [thunk];

if (process.env.NODE_ENV === 'development') {
    middleware.push(logger);
}

const store = createStore(
    pReducer,
    applyMiddleware(...middleware)
);

const persistor = persistStore(store);

export { store, persistor };
