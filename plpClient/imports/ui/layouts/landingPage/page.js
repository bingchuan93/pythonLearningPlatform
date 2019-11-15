import React, { Component } from 'react';

import './landingPage.scss';

class Page extends Component {
    render() {
        return (
            <div id="page">
                <div className="full-screen-bg" />
                <div className="content">
                    <div className="header d-flex justify-content-end w-100">
                        {this.props.headerContents}
                    </div>
                    <h1>{this.props.title}</h1>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Page;