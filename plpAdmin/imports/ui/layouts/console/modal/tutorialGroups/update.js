import React, { Component } from 'react';
import { connect } from 'react-redux';
import TutorialGroupBase from './base';
import LoadingButton from '/imports/ui/components/loadingButton';
// import ErrorIcon from '/imports/ui/components/icons/error';
import { push } from 'connected-react-router';

class TutorialGroupUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false
        }
    }

    handleUpdate = (form, image) => {
        this.setState({ isSubmitting: true });
        Meteor.call('TutorialGroups.update', this.props.id, form, (error, result) => {
            this.setState({ isSubmitting: false });
            if (!error) {
                this.props.dispatch(push('/tutorial-groups/view/' + this.props.id));
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
            <TutorialGroupBase
                title="Update Tutorial Group"
                mode="update"
                id={this.props.id}
                formSubmit={this.handleUpdate}
                footer={
                    <LoadingButton color="update" size="sm" type="submit" form="tutorial-group-form" isLoading={this.state.isSubmitting}>
                        Save
                    </LoadingButton>
                }
            />
        )
    }
}

export default connect()(TutorialGroupUpdate);
