import React, { Component } from 'react';
import Header from '/imports/ui/layouts/mainApp/header';
import Body from '/imports/ui/layouts/mainApp/body';
import SideMenu from '/imports/ui/layouts/mainApp/sideMenu';
import Alert from '/imports/ui/components/alert';
import { connect } from 'react-redux';

class MainApp extends Component {
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.router.location.pathname != this.props.router.location.pathname) {
            if (this.props.appState.assessmentMode) {
                console.log('to code push to quiz route');
                // bcwee: push back to prev loc
            }
        }
    }

    render() {
        return (
            <div id="app">
                {!this.props.assessmentState.endTime && (
                    <Header />
                )}
                <Body />
                {!this.props.assessmentState.endTime && (
                    <SideMenu />
                )}
                {this.props.alertState.alertProps &&
                    <Alert {...this.props.alertState.alertProps} />
                }
            </div>
        );
    }
}

export default connect(
    ({ authState, appState, router, alertState, assessmentState }) => ({
        authState,
        appState,
        router,
        alertState,
        assessmentState
    })
)(MainApp);