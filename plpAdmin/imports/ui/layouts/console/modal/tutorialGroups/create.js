import React, { Component } from 'react';
import { connect } from 'react-redux';
import TutorialGroupBase from './base';
import LoadingButton from '/imports/ui/components/loadingButton';
// import ErrorIcon from '/imports/ui/components/icons/error';
import { push } from 'connected-react-router';

class TutorialGroupCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false
        }
    }

    handleCreate = (form, image) => {
        this.setState({ isSubmitting: true });
        Meteor.call('TutorialGroups.create', form, (error, result) => {
            this.setState({ isSubmitting: false });
            this.props.dispatch(push('/tutorial-groups'));
            this.props.dispatch({ type: 'MODAL/RESET' });
            if (!error && !result.error) {
                this.props.dispatch({
                    type: 'ALERT/OPEN', payload: {
                        alertProps: {
                            body: (
                                <div style={{ textAlign: "center" }}>
                                    Tutorial Groups successfully created
                                </div>
                            ),
                            closeOnBgClick: true,
                            showConfirmButton: true,
                            confirmButtonText: 'Done',
                            confirmButtonCallback: (e, closeAlert) => {
                                e.preventDefault();
                                closeAlert();
                            },
                            showCloseButton: false
                        }
                    }
                });
                this.props.dispatch({ type: 'CONTENT/FETCHABLE_TABLE_FORCE_FETCH' });
            } else if (error || result.error) {
                this.props.dispatch({
                    type: 'ALERT/OPEN', payload: {
                        alertProps: {
                            body: (
                                <React.Fragment>
                                    <div className="alert-icon mb-2">
                                        {/* <ErrorIcon /> */}
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        {error ? (
                                            error.reason
                                        ) : (
                                                <React.Fragment>
                                                    {result.data.map((data, key) => {
                                                        return (
                                                            <div key={key}>
                                                                {data.name}: {data.error}
                                                            </div>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            )}
                                    </div>
                                </React.Fragment>
                            ),
                            closeOnBgClick: true,
                            showCloseButton: true,
                        }
                    }
                });
                this.props.dispatch({ type: 'CONTENT/FETCHABLE_TABLE_FORCE_FETCH' });
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

export default connect()(TutorialGroupCreate);
