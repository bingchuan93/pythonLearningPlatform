import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import contentRoutes from '/imports/routes/app/content';
import config from '/imports/config';

class SideMenu extends Component {
    render() {
        return (
            <React.Fragment>
                <div className={'side-menu' + (this.props.appState.isSideMenuOpen ? ' open' : '') } >
                    <div className="brand text-center p-3 clickable" onClick={() => this.props.dispatch(push('/'))}>
                        {config.appName}
                    </div>
                    <div className="menu-items d-flex flex-column justify-content-center">
                        {contentRoutes.map((contentRoute, key) => {
                            if (contentRoute.showInSideMenu) {
                                return <div key={key} className="menu-item text-center p-3 clickable" onClick={() => this.props.dispatch(push(contentRoute.path))}>{contentRoute.title}</div>
                            }
                        })}
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