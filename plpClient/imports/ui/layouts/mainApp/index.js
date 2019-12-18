import React, { Component } from 'react';
import Header from '/imports/ui/layouts/mainApp/header';
import Body from '/imports/ui/layouts/mainApp/body';
import SideMenu from '/imports/ui/layouts/mainApp/sideMenu';
import { connect } from 'react-redux';

class MainApp extends Component {
    render() {
        return (
            <div id="app">
                <Header />
                <Body />
                <SideMenu />
            </div>
        );
    }
}

export default connect(
    ({ authState }) => ({
        authState
    })
)(MainApp);