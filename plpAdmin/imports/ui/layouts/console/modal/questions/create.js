import React, { Component } from 'react';
import { connect } from 'react-redux';
import QuestionBase from './base';
import LoadingButton from '/imports/ui/components/loadingButton';
// import ErrorIcon from '/imports/ui/components/icons/error';
import { push } from 'connected-react-router';

class QuestionCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false,
        };
    }

    handleCreate = (formValues) => {
        this.setState({ isSubmitting: true });
        Meteor.call('Questions.create', formValues, this.props.questionsSyncToken, (error, result) => {
            this.setState({ isSubmitting: false });
            this.props.dispatch({ type: 'MODAL/CLOSE' });
            if (!error && !result.error) {
                this.props.dispatch({ type: 'ASSESSMENT/ADD_QUESTION', payload: { questionId: result } });
            } else if (error || result.error) {
                this.props.dispatch({
                    type: 'ALERT/OPEN',
                    payload: {
                        alertProps: {
                            body: (
                                <React.Fragment>
                                    <div className="alert-icon mb-2">{/* <ErrorIcon /> */}</div>
                                    <div style={{ textAlign: "center" }}>
                                        {error.reason}
                                    </div>
                                </React.Fragment>
                            ),
                            closeOnBgClick: true,
                            showCloseButton: true,
                        },
                    },
                });
            }
        });
    };

    render() {
        return (
            <QuestionBase
                index={this.props.index}
                title="Create Question"
                mode="create"
                formSubmit={this.handleCreate}
            />
        );
    }
}

export default connect()(QuestionCreate);
