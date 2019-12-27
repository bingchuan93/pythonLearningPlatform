import React, { Component } from 'react';
import { connect } from 'react-redux';
import TutorialGroupBase from './base';
import LoadingButton from '/imports/ui/components/loadingButton';
// import ErrorIcon from '/imports/ui/components/icons/error';
import { push } from 'connected-react-router';

class TutorialGroupsCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: true
        }
    }

    handleCreate = (form, image) => {
        this.setState({ isSubmitting: true });
        Meteor.call('TutorialGroups.insert', form, image, (error, result) => {
            this.setState({ isSubmitting: false });
            if (!error) {
                this.props.dispatch(push('/tutorial-groups/view/' + result.valueOf()));
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
                title="Create Tutorial Group"
                mode="create"
                formSubmit={this.handleCreate}
                footer={
                    <LoadingButton color="create" size="sm" type="submit" form="tutorial-group-form" isLoading={this.state.isSubmitting}>
                        Create
                    </LoadingButton>
                }
            />
        )
    }
}

export default connect()(TutorialGroupsCreate);
