import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '/imports/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Route, Switch, Redirect } from 'react-router-dom';
import RedirectWhenAuthedRoute from '/imports/routes/components/redirectWhenAuthedRoute';
import PrivateRoute from '/imports/routes/components/privateRoute';
import { ConnectedRouter } from 'connected-react-router';
import history from '/imports/history';
import rootRoutes from '/imports/routes/root';

const Root = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
                <Switch>
                    {rootRoutes.map((route, key) => {
                        if (route.redirectTo) {
                            return <Redirect from={route.path} exact={route.exact} to={route.redirectTo} key={key} />
                        }
                        else if (route.redirectIfAuthed){
                            return <RedirectWhenAuthedRoute path={route.path} exact={route.exact} component={route.component} key={key} />
                        }
                        else if (route.private) {
							return <PrivateRoute path={route.path} exact={route.exact} component={route.component} key={key} />;
                        }
                        else {
                            return <Route path={route.path} exact={route.exact} component={route.component} key={key} />
                        }
                    })}
                </Switch>
            </ConnectedRouter>
        </PersistGate>
    </Provider>
)

export default Root;