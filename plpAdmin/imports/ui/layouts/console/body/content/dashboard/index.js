import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from '/imports/ui/components/icons/spinner';

class Dashboard extends Component {
    render() {
        console.log('dashboard');
        return (
            <div className="dashboard">
                <h1>Dashboard</h1>
                <Spinner />
            </div>
        );
    }
}

export default connect()(Dashboard);