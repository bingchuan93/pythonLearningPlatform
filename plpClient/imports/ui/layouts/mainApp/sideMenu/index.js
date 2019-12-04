import React, { Component } from 'react';
import { connect } from 'react-redux';
import config from '/imports/config';

class SideMenu extends Component {
    render() {
        return (
            <React.Fragment>
                <div className={'side-menu' + (this.props.appState.isSideMenuOpen ? ' open' : '') } >
                    <div className="brand text-center p-3">
                        {config.appName}
                    </div>
                </div>
                <div className={'side-menu-overlay' + (this.props.appState.isSideMenuOpen ? ' open' : '')} onClick={() => this.props.dispatch({ type: 'SIDE_MENU/CLOSE' })} />
            </React.Fragment>
        );
    }
}

export default connect(
    ({ appState }) => ({
        appState
    })
)(SideMenu);