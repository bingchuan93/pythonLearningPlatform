import { persistCombineReducers, createTransform } from 'redux-persist';
import { connectRouter } from 'connected-react-router';
import storage from 'redux-persist/lib/storage/session';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: [],
}

export default (history) => persistCombineReducers(persistConfig, {
    router: connectRouter(history),
});