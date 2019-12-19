import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import contentRoutes from '/imports/routes/console/content';

class SideMenu extends Component {
    render() {
        return (
            <div className="side-menu d-flex flex-column justify-content-start align-contents-start">
                {contentRoutes.map((route, key) => {
                    if (route.showInSideMenu) {
                        return (
                            <div className="menu-item clickable" key={key} onClick={() => this.props.dispatch(push(route.path))}>{route.title}</div>
                        )
                    }
                })}
            </div>
        );
    }
}

export default connect()(SideMenu);