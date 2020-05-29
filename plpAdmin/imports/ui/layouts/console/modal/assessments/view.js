import React, { Component } from 'react';
import { connect } from 'react-redux';
import AssessmentBase from './base';
import { Button } from 'reactstrap';
import { push } from 'connected-react-router';

class AssessmentView extends Component {
    render() {
        return (
            <AssessmentBase
                title="View Assessment"
                mode="view"
                id={this.props.id}
                footer={
                    <Button color="update" size="sm" onClick={() => this.props.dispatch(push('/assessments/update/' + this.props.id))}>
                        Edit
                    </Button>
                }
            />
        )
    }
}

export default connect()(AssessmentView);
