import React, { Component } from 'react';
import Header from '/imports/ui/layouts/mainApp/header';
import Body from '/imports/ui/layouts/mainApp/body';
import { connect } from 'react-redux';

class MainApp extends Component {
    render() {
        console.log('MainApp loaded');
        console.log(Meteor.user());
        return (
            <div id="app">
                <Header />
                <Body />
                {/* <SideMenu /> */}
            </div>
        );
    }
}

export default connect(
    ({ authState }) => ({
        authState
    })
)(MainApp);