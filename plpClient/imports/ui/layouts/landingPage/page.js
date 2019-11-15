import React, { Component } from 'react';

import './landingPage.scss';

class Page extends Component {
    render() {
        return (
            <div id="page">
                <div className="full-screen-bg" />
                {this.props.children}
            </div>
        );
    }
}

export default Page;