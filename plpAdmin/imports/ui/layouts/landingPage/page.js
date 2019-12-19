import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

class Page extends Component {
    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.user, this.props.user)) {
            this.props.dispatch({ type: 'USER/SET', payload: { user: this.props.user } });
        }
    }

    render() {
        return (
            <div id="page">
                <div className="full-screen-bg" />
                <div className="content">
                    <div className={'header w-100 ' + (this.props.headerClass ? this.props.headerClass : '')}>
                        {this.props.headerContents}
                    </div>
                    {this.props.title}
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

export default connect(
    ({ userState }) => ({
        userState
    })
)(pageTracker)