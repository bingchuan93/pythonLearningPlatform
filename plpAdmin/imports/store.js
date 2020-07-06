import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '/imports/reducers';
import rootSaga from '/imports/sagas';
import history from '/imports/history';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware, routerMiddleware(history)];

const enhancers = applyMiddleware(...middlewares);

export const store = createStore(
    rootReducer(history),
    enhancers
);

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);