import React, { Component } from 'react';
import { connect } from 'react-redux';
import StudentBase from './base';
import { Button } from 'reactstrap';
import { push } from 'connected-react-router';

class StudentRead extends Component {
    render() {
        return (
            <StudentBase
                title="View Student"
                mode="read"
                id={this.props.id}
                footer={
                    <Button color="update" size="sm" onClick={() => this.props.dispatch(push('/student/update/' + this.props.id))}>
                        Edit
                    </Button>
                }
            />
        )
    }
}

export default connect()(StudentRead);
