import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import contentRoutes from '/imports/routes/console/content';

class Content extends Component {
    render() {
        return (
            <div className="content flex-fill">
                <Switch>
                    {contentRoutes.map((contentRoute, key) => {
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
                                    key={key}
                                />
                            );
                        }
                    })}
                </Switch>
            </div>
        );
    }
}

export default connect()(Content);