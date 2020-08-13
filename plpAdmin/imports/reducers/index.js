import { persistCombineReducers, createTransform } from 'redux-persist';
import { connectRouter } from 'connected-react-router';
import storage from 'redux-persist/lib/storage/session';

import userState from './userState';
import appState from './appState';
import contentState from './contentState';
import modalState from './modalState';
import alertState from './alertState';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['userState'],
}

export default (history) => persistCombineReducers(persistConfig, {
    router: connectRouter(history),
    userState,
    appState,
    contentState,
    modalState,
    alertState,
});