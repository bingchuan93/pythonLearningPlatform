import React, { Component } from 'react';
import { connect } from 'react-redux';
import AssessmentBase from './base';
import LoadingButton from '/imports/ui/components/loadingButton';
// import ErrorIcon from '/imports/ui/components/icons/error';
import { push } from 'connected-react-router';

class AssessmentUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false
        }
    }

    handleUpdate = (form, image) => {
        this.setState({ isSubmitting: true });
        Meteor.call('Assessments.update', this.props.id, form, (error, result) => {
            this.setState({ isSubmitting: false });
            if (!error) {
                this.props.dispatch(push('/assessments/view/' + this.props.id));
                this.props.dispatch({ type: 'CONTENT/FETCHABLE_TABLE_FORCE_FETCH' });
            } else {
                this.props.dispatch({
                    type: 'ALERT/OPEN', payload: {
                        alertProps: {
                            body: (
                                <React.Fragment>
                                    <div className="alert-icon mb-2">
                                        {/* <ErrorIcon /> */}
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        {error.reason}
                                    </div>
                                </React.Fragment>
                            ),
                            closeOnBgClick: true,
                            showCloseButton: true,
                        }
                    }
                });
            }
        });
    }

    render() {
        return (
            <AssessmentBase
                title="Update Assessment"
                mode="update"
                id={this.props.id}
                formSubmit={this.handleUpdate}
                footer={
                    <LoadingButton color="update" size="sm" type="submit" form="assessment-form" isLoading={this.state.isSubmitting}>
                        Save
                    </LoadingButton>
                }
            />
        )
    }
}

export default connect()(AssessmentUpdate);
