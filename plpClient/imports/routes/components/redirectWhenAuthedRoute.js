import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class RedirectWhenAuthedRoute extends Component {
    render() {
        const { component: RouteComponent, ...routeProps } = this.props;
        const { location } = this.props.router;
        return (
            <React.Fragment>
                <Route
                    {...routeProps}
                    render={(props) => (
                        this.props.userState.user ? (
                            <Redirect to={{ pathname: (location.state && location.state.from) ? location.state.from.pathname : '/main' }} />
                        ) : (
                            <RouteComponent {...props} />
                        )
                    )}
                />
            </React.Fragment>
        );
    }
}

export default connect(
    ({ router, userState }) => ({
        router,
        userState
    })
)(RedirectWhenAuthedRoute);