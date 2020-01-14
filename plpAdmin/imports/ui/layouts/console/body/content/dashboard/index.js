import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import Loader from '/imports/ui/components/icons/loader';
import TestBase from '/imports/ui/layouts/console/modal/testBase';
import { getSemOneDate } from '/imports/util';

class Dashboard extends Component {
    componentDidMount() {
        console.log(getSemOneDate('one'));
    }

    render() {
        return (
            <div className="dashboard">
                <h1>Dashboard</h1>
                <Loader />
                <Button
                    color="primary"
                    onClick={() => this.props.dispatch({
                        type: 'MODAL/OPEN',
                        payload: {
                            modal: TestBase,
                            modalProps: {
                                id: 123
                            },
                            prevLocation: { pathname: '/students' }
                        }
                    })}>Test modal</Button>
            </div >
        );
    }
}

export default connect()(Dashboard);