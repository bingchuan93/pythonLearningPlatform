import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Header from '/imports/ui/layouts/console/header';
import Body from '/imports/ui/layouts/console/body';
import Modal from '/imports/ui/layouts/console/modal';
import Alert from '/imports/ui/components/alert';
import { connect } from 'react-redux';
import _ from 'lodash';

class Console extends Component {
	componentDidUpdate(prevProps, prevState) {
		if (!_.isEqual(prevProps.meteorUser, this.props.meteorUser)) {
			this.props.dispatch({ type: 'USER/SET', payload: { user: this.props.meteorUser } });
		}
    }

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

const consoleWithState = connect(
    ({ authState, alertState }) => ({
        authState, 
        alertState
    })
)(Console);


export default withTracker(() => {
	let meteorUser = Meteor.user();
	return {
		meteorUser: meteorUser,
	};
})(consoleWithState);