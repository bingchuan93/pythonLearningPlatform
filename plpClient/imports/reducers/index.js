import { persistCombineReducers } from 'redux-persist';
import { connectRouter } from 'connected-react-router';
import storage from 'redux-persist/lib/storage/session';

import userState from './userState';
import appState from './appState';
import alertState from './alertState';
import assessmentState from './assessmentState';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['userState', 'assessmentState'],
}

export default (history) => persistCombineReducers(persistConfig, {
    router: connectRouter(history),
    userState,
    appState,
    alertState,
    assessmentState
});