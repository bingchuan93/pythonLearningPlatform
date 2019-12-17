import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

import './landingPage.scss';

class Page extends Component {
    componentDidUpdate(prevProps, prevState) {
        if (_.isEqual(prevProps.user && this.props.user)) {
            this.props.dispatch({ type: 'USER/SET', payload: { user: this.props.user } });
        }
    }

    render() {
        console.log('page.js');
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

const pageTracker = withTracker(() => {
    return {
        user: Meteor.user()
    }
})(Page);

export default connect()(pageTracker)