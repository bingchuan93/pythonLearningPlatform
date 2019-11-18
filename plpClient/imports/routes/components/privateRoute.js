import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from 'react-redux';
import _ from 'lodash';

class PrivateRoute extends Component {
    render() {
        const { component: RouteComponent, ...routeProps } = this.props;
        return (
            <Route
                {...routeProps}
                render={(props) => (
                    this.props.userState.user ? (
                        <RouteComponent {...props} />
                    ) : (
                            <Redirect
                                to={{
                                    pathname: "/sign-in",
                                    state: { from: props.location }
                                }}
                            />
                        )
                )}
            />
        );
    }
}

const PrivateRouteTracker = withTracker(() => {
    return {
        user: Meteor.user()
    }
})(PrivateRoute);

export default connect(
    ({ userState }) => ({
        userState
    })
)(PrivateRouteTracker);