import React, { Component } from 'react';
import Header from '/imports/ui/layouts/mainApp/header';
import Body from '/imports/ui/layouts/mainApp/body';
import SideMenu from '/imports/ui/layouts/mainApp/sideMenu';
import Alert from '/imports/ui/components/alert';
import { replace } from 'connected-react-router';
import { connect } from 'react-redux';

class MainApp extends Component {
    componentDidMount() {
        this.checkForOngoingQuizAndReroute();
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.router.location.pathname != this.props.router.location.pathname) {
            this.checkForOngoingQuizAndReroute();
        }
    }

    checkForOngoingQuizAndReroute = () => {
        if (this.props.userState.assessmentEndTime) {
            if (this.props.router.location.pathname != `/quizzes/${this.props.userState.assessmentSubmission.quizId}`) {
                this.props.dispatch(replace(`/quizzes/${this.props.userState.assessmentSubmission.quizId}`));
            }
        }
    }

    render() {
        return (
            <div id="app">
                {!this.props.userState.assessmentEndTime && (
                    <Header />
                )}
                <Body />
                {!this.props.userState.assessmentEndTime && (
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
    ({ authState, appState, router, alertState, userState }) => ({
        authState,
        appState,
        router,
        alertState,
        userState
    })
)(MainApp);