import { persistCombineReducers, createTransform } from 'redux-persist';
import { connectRouter } from 'connected-react-router';
import storage from 'redux-persist/lib/storage/session';

import userState from './userState';
import appState from './appState';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['userState'],
}

export default (history) => persistCombineReducers(persistConfig, {
    router: connectRouter(history),
    userState,
    appState,
});