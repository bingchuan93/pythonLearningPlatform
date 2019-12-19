import React, { Component } from 'react';
import Header from '/imports/ui/layouts/console/header';
import Body from '/imports/ui/layouts/console/body';
import { connect } from 'react-redux';

class Console extends Component {
    render() {
        return (
            <div id="console">
                <Header />
                <Body />
            </div>
        );
    }
}

export default connect(
    ({ authState }) => ({
        authState
    })
)(Console);