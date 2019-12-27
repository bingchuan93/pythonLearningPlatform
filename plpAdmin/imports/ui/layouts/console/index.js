import React, { Component } from 'react';
import Header from '/imports/ui/layouts/console/header';
import Body from '/imports/ui/layouts/console/body';
import Modal from '/imports/ui/layouts/console/modal';
import Alert from '/imports/ui/components/alert';
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
                {this.props.alertState.alertProps &&
                    <Alert {...this.props.alertState.alertProps} />
                }
            </React.Fragment>
        );
    }
}

export default connect(
    ({ authState, alertState }) => ({
        authState, 
        alertState
    })
)(Console);