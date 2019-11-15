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
                        <RouteComponent {...props} />
                    )}
                />
            </React.Fragment>
        );
    }
}

export default connect(
    ({ router }) => ({
        router
    })
)(RedirectWhenAuthedRoute);