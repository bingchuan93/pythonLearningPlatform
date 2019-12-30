import React, { Component } from 'react';
import { connect } from 'react-redux';
import TutorialGroupBase from './base';
import { Button } from 'reactstrap';
import { push } from 'connected-react-router';

class TutorialGroupRead extends Component {
    render() {
        return (
            <TutorialGroupBase
                title="View Tutorial Group"
                mode="read"
                id={this.props.id}
                footer={
                    <Button color="update" size="sm" onClick={() => this.props.dispatch(push('/tutorial-groups/update/' + this.props.id))}>
                        Edit
                    </Button>
                }
            />
        )
    }
}

export default connect()(TutorialGroupRead);
