import React, { Component } from 'react';
import Header from '/imports/ui/layouts/console/header';
import Body from '/imports/ui/layouts/console/body';
import Modal from '/imports/ui/layouts/console/modal';
import { connect } from 'react-redux';

class Console extends Component {
    render() {
        return (
            <React.Fragment>
                <div id="console">
                    <Header />
                    <Body />
                </div>
                <Modal />
            </React.Fragment>
        );
    }
}

export default connect(
    ({ authState }) => ({
        authState
    })
)(Console);