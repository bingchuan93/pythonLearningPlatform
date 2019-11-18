import React, { Component } from 'react';
import Header from '/imports/ui/layouts/mainApp/header';
import Body from '/imports/ui/layouts/mainApp/body';

class MainApp extends Component {
    render() {
        console.log('MainApp loaded');
        return (
            <div>
                <Header />
                <Body />
                {/* <SideMenu /> */}
            </div>
        );
    }
}

export default MainApp;