import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Switch, Route, Redirect } from 'react-router-dom';
import contentRoutes from '/imports/routes/app/content';

class Body extends Component {
    render() {
        return (
            <Container>
                <Switch>
                    {contentRoutes.map(( contentRoute, key) => {
                        if (contentRoute.redirect) {
                            return (
                                <Redirect from={contentRoute.path} to={contentRoute.pathTo} exact={contentRoute.exact} key={key} />
                            );
                        }
                        else {
                            return (
                                <Route
                                    path={contentRoute.path}
                                    component={contentRoute.component}
                                    exact={contentRoute.exact}
                                    key={key}
                                />
                            );
                        }
                    })}
                </Switch>
            </Container>
        );
    }
}

export default Body;