import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import { routerMiddleware } from 'connected-react-router';
import rootReducer from '/imports/reducers';
import history from '/imports/history';

const middlewares = [routerMiddleware(history)];

const enhancers = applyMiddleware(...middlewares);

export const store = createStore(
    rootReducer(history),
    enhancers
);

export const persistor = persistStore(store);