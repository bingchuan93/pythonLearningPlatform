import React, { Component } from 'react';
import SideMenu from './sideMenu';
import Content from './content';
import { connect } from 'react-redux';

class Console extends Component {
    render() {
        return (
            <div className="body d-flex">
                <SideMenu/>
                <Content/>
            </div>
        );
    }
}

export default connect()(Console);