import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BaseModal from '/imports/ui/components/modal/base';
import { FormGroup, Row, Col, Label, Button, Input } from 'reactstrap';
import { ValidatorForm } from 'react-form-validator-core';
import TextValidator from '/imports/ui/components/validators/text';
import SelectValidator from '/imports/ui/components/validators/select';
import Loader from '/imports/ui/components/icons/loader';
import { getQuestionTypeOptions } from '/imports/util';

class QuestionBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            questionTypeOptions: getQuestionTypeOptions(),
            form: {
                type: '',
                content: '',
                answers: [],
                marksPerCorrectAnswer: 1,
                // isArchived: false,
            }
        }
    }

    componentDidMount() {
        if (this.props.id) {
            this.getQuestion(this.props.id);
        }
    }

    getQuestion = (id) => {
        this.setState({ isFetching: true });
        Meteor.call('Questions.getById', id, (error, result) => {
            this.setState({ isFetching: false });
            console.log(result);
            if (!error) {
                this.setState({
                    form: {
                        ...this.state.form,
                        type: result.type,
                        content: result.content,
                        answers: result.answers,
                        marksPerCorrectAnswer: result.marksPerCorrectAnswer,
                        // isArchived: result.isArchived
                    }
                });
            }
        })
    }

    displayError = (errorMsg) => {
        this.props.dispatch({
            type: 'ALERT/OPEN', payload: {
                alertProps: {
                    // icon: ErrorIcon,
                    body: (
                        <React.Fragment>
                            <div className="alert-icon mb-2">
                                {/* <ErrorIcon /> */}
                            </div>
                            <div style={{ textAlign: "center" }}>
                                {errorMsg}
                            </div>
                        </React.Fragment>
                    ),
                    closeOnBgClick: true,
                    showCloseButton: true,
                }
            }
        });
    }

    shouldRenderAddButton = () => {
        const selectedQuestionType = _.find(constants.questionTypes, (questionType) => questionType.value == this.state.form.type);
        if (selectedQuestionType) {
            if (selectedQuestionType.maxAnswer && this.state.form.answers.length >= selectedQuestionType.maxAnswer) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    render() {
        const { form } = this.state;
        return (
            <BaseModal
                headerText={this.props.title}
                className={this.props.mode == 'view' ? 'read' : ''}
                body={
                    <div className="question-modal">
                        <ValidatorForm
                            id="question-form"
                            instantValidate={false}
                            onSubmit={() => {
                                this.props.formSubmit(form);
                            }}
                        >
                            {this.props.mode != 'create' && this.state.isFetching &&
                                <div className="overlay">
                                    <Loader />
                                </div>
                            }
                            <FormGroup>
                                <Row form>
                                    <Col md={4}>
                                        <Label className="control-label mb-0 font-weight-bold">Type</Label>
                                    </Col>
                                    <Col md={8}>
                                        <SelectValidator
                                            placeholder="Type"
                                            validators={['required']}
                                            value={_.find(this.state.questionTypeOptions, { value: form.type })}
                                            onChange={e => {
                                                this.setState({
                                                    form: {
                                                        ...form,
                                                        type: e.value
                                                    }
                                                });
                                            }}
                                            options={this.state.questionTypeOptions}
                                            errorMessages={['Type is required']}
                                            isDisabled={this.props.mode == 'view'}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row form>
                                    <Col md={4}>
                                        <Label className="control-label mb-0 font-weight-bold">Content</Label>
                                    </Col>
                                    <Col md={8}>
                                        <TextValidator
                                            className="form-control"
                                            type="text"
                                            name="content"
                                            value={form.content}
                                            validators={['required']}
                                            onChange={(e) => {
                                                this.setState({
                                                    form: {
                                                        ...form,
                                                        content: e.target.value
                                                    }
                                                })
                                            }}
                                            errorMessages={['Name is required']}
                                            readOnly={this.props.mode == 'read'}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row form>
                                    <Col md={4}>
                                        <Label className="control-label mb-0 font-weight-bold">Marks Per Correct Answer</Label>
                                    </Col>
                                    <Col md={8}>
                                        <TextValidator
                                            className="form-control"
                                            type="number"
                                            name="marks-per-correct-answer"
                                            value={form.marksPerCorrectAnswer}
                                            validators={['required', 'isPositive']}
                                            onChange={(e) => {
                                                this.setState({
                                                    form: {
                                                        ...form,
                                                        marksPerCorrectAnswer: e.target.value
                                                    }
                                                })
                                            }}
                                            errorMessages={['Name is required', 'Marks must be positive']}
                                            readOnly={this.props.mode == 'read'}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row form>
                                    <Col md={4}>
                                        <Label className="control-label mb-0 font-weight-bold">Answers</Label>
                                    </Col>
                                    <Col md={8}>
                                        {this.shouldRenderAddButton() && (
                                            <Button color="create">Add Answers</Button>
                                        )}
                                    </Col>
                                </Row>
                            </FormGroup>
                        </ValidatorForm>
                    </div>
                }
                footerClasses="justify-content-end"
                footer={
                    <React.Fragment>
                        {this.props.mode == 'read' && !this.state.isFetching &&
                            <React.Fragment>
                                {form.isArchived ? (
                                    <Button color="success" size="sm" onClick={() => {
                                        this.handleRestore(new Mongo.ObjectID(this.props.id))
                                    }}>Restore</Button>
                                ) : (
                                        <Button color="secondary" size="sm" onClick={() => {
                                            this.handleArchive(new Mongo.ObjectID(this.props.id))
                                        }}>Archive</Button>
                                    )}
                            </React.Fragment>
                        }
                        {this.props.footer}
                    </React.Fragment>
                }
            />
        );
    }
}

export default connect()(QuestionBase);