import React, { Component } from 'react';
import { connect } from 'react-redux';
import _, { cloneDeep, clone } from 'lodash';
import BaseModal from '/imports/ui/components/modal/base';
import { FormGroup, Row, Col, Label, Button, Input, Table } from 'reactstrap';
import { ValidatorForm } from 'react-form-validator-core';
import TextValidator from '/imports/ui/components/validators/text';
import SelectValidator from '/imports/ui/components/validators/select';
import Loader from '/imports/ui/components/icons/loader';
import Switch from 'react-switch';
import { getQuestionTypeOptions } from '/imports/util';
import LoadingButton from '/imports/ui/components/loadingButton';
import constants from '/imports/constants';
import randomstring from 'randomstring';

class QuestionBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false,
            isFetching: false,
            questionTypeOptions: getQuestionTypeOptions(),
            form: {
                type: '',
                content: '',
                answers: [],
                marksPerCorrectAnswer: 1,
                marksPerCorrectTestCase: 1,
                testCases: []
            }
        }
    }

    componentDidMount() {
        console.log(this.props);
        if (this.props.id) {
            this.getQuestion(this.props.id);
        }
    }

    getQuestion = (id) => {
        this.setState({ isFetching: true });
        Meteor.call('Questions.getById', id, (error, result) => {
            this.setState({ isFetching: false });
            if (!error) {
                this.setState({
                    form: {
                        ...this.state.form,
                        type: result.type,
                        content: result.content,
                        answers: result.answers,
                        marksPerCorrectAnswer: result.marksPerCorrectAnswer,
                        marksPerCorrectTestCase: result.marksPerCorrectTestCase,
                        testCases: result.testCases
                    }
                });
            }
        })
    }

    handleSave = () => {

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
                index={this.props.index}
                size="lg"
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
                                                let clonedAnswers = _.cloneDeep(this.state.form.answers);
                                                const questionType = _.find(constants.questionTypes, { value: e.value });
                                                console.log(questionType);
                                                if (questionType && questionType.maxAnswer) {
                                                    if (clonedAnswers.length == 0) {
                                                        for (let i = 0; i < questionType.maxAnswer; i++) {
                                                            clonedAnswers.push({
                                                                id: randomstring.generate(),
                                                                content: questionType.value == 'true-or-false' ? (i == 0 ? 'True' : 'False') : '',
                                                                isCorrect: false
                                                            });
                                                        }
                                                    } else if (clonedAnswers.length > questionType.maxAnswer) {
                                                        clonedAnswers = clonedAnswers.slice(0, questionType.maxAnswer);
                                                    }
                                                }
                                                if (questionType && questionType.value != constants.questionTypes.multipleChoiceMultiAnswer.value) {
                                                    let firstCorrectAnswerId = '';
                                                    clonedAnswers.forEach((clonedAnswer) => {
                                                        if (clonedAnswer.isCorrect) {
                                                            if (firstCorrectAnswerId == '') {
                                                                firstCorrectAnswerId = clonedAnswer.id;
                                                            } else {
                                                                clonedAnswer.isCorrect = false;
                                                            }
                                                        }
                                                    });
                                                }
                                                this.setState({
                                                    form: {
                                                        ...form,
                                                        answers: clonedAnswers,
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
                            {form.type != 'coding' ? (
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
                                                validators={form.type != 'coding' ? ['required', 'isPositive'] : []}
                                                onChange={(e) => {
                                                    this.setState({
                                                        form: {
                                                            ...form,
                                                            marksPerCorrectAnswer: e.target.value
                                                        }
                                                    })
                                                }}
                                                errorMessages={form.type != 'coding' ? ['Marks Per Correct Answer is required', 'Marks must be positive'] : []}
                                                readOnly={this.props.mode == 'read'}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>
                            ) : (
                                    <FormGroup>
                                        <Row form>
                                            <Col md={4}>
                                                <Label className="control-label mb-0 font-weight-bold">Marks Per Correct Test Case</Label>
                                            </Col>
                                            <Col md={8}>
                                                <TextValidator
                                                    className="form-control"
                                                    type="number"
                                                    name="marks-per-correct-answer"
                                                    value={form.marksPerCorrectTestCase}
                                                    validators={form.type == 'coding' ? ['required', 'isPositive'] : []}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            form: {
                                                                ...form,
                                                                marksPerCorrectTestCase: e.target.value
                                                            }
                                                        })
                                                    }}
                                                    errorMessages={form.type == 'coding' ? ['Marks Per Correct Test Case is required', 'Marks must be positive'] : []}
                                                    readOnly={this.props.mode == 'read'}
                                                />
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                )}
                            <FormGroup>
                                <Row form>
                                    <Col md={4}>
                                        <Label className="control-label mb-0 font-weight-bold">Answers</Label>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row form>
                                    {form.type != 'coding' ? (
                                        <>
                                            {this.state.form.answers.length > 0 && (
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ maxWidth: 25 }}>No.</th>
                                                            <th>Answer</th>
                                                            <th style={{ maxWidth: 50 }}>Correct Answer</th>
                                                            <th style={{ maxWidth: 25 }}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.form.answers.map((answer, key) => {
                                                            return (
                                                                <tr key={key}>
                                                                    <th style={{ maxWidth: 25 }}>{key + 1}</th>
                                                                    <td>
                                                                        <TextValidator
                                                                            className="form-control"
                                                                            type="text"
                                                                            name={"answer-" + answer.id}
                                                                            value={answer.content}
                                                                            validators={['required']}
                                                                            onChange={(e) => {
                                                                                const clonedAnswers = _.cloneDeep(this.state.form.answers);
                                                                                const relatedAnswer = _.find(clonedAnswers, { id: answer.id });
                                                                                relatedAnswer.content = e.target.value
                                                                                this.setState({
                                                                                    form: {
                                                                                        ...form,
                                                                                        answers: clonedAnswers
                                                                                    }
                                                                                })
                                                                            }}
                                                                            errorMessages={['Answer content is required']}
                                                                            readOnly={this.props.mode == 'read'}
                                                                        />
                                                                    </td>
                                                                    <td style={{ maxWidth: 50 }}>
                                                                        <Switch
                                                                            checked={answer.isCorrect}
                                                                            uncheckedIcon={false}
                                                                            checkedIcon={false}
                                                                            onColor={'#3b9e57'}
                                                                            offColor={'#9e3b3b'}
                                                                            onChange={value => {
                                                                                const clonedAnswers = _.cloneDeep(this.state.form.answers);
                                                                                clonedAnswers.forEach((clonedAnswer) => {
                                                                                    if (clonedAnswer.id == answer.id) {
                                                                                        clonedAnswer.isCorrect = value;
                                                                                    } else {
                                                                                        clonedAnswer.isCorrect = this.state.form.type != constants.questionTypes.multipleChoiceMultiAnswer.value ? false : clonedAnswer.isCorrect;
                                                                                    }
                                                                                });
                                                                                this.setState({
                                                                                    form: {
                                                                                        ...this.state.form,
                                                                                        answers: clonedAnswers
                                                                                    }
                                                                                });
                                                                            }}
                                                                            disabled={this.props.mode == 'view'}
                                                                            className="react-switch"
                                                                        />
                                                                    </td>
                                                                    <td style={{ maxWidth: 25 }}>
                                                                        <Button color="danger" onClick={() => {
                                                                            const clonedAnswers = _.cloneDeep(this.state.form.answers);
                                                                            _.remove(clonedAnswers, { id: answer.id });
                                                                            this.setState({
                                                                                form: {
                                                                                    ...this.state.form,
                                                                                    answers: clonedAnswers
                                                                                }
                                                                            });
                                                                        }}>×</Button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </Table>
                                            )}
                                            {this.shouldRenderAddButton() && (
                                                <Button color="create" size="sm" onClick={() => {
                                                    const clonedForm = _.cloneDeep(this.state.form);
                                                    clonedForm.answers.push({
                                                        id: randomstring.generate(),
                                                        content: '',
                                                        isCorrect: false
                                                    });
                                                    this.setState({
                                                        form: clonedForm
                                                    });
                                                }}>Add Answers</Button>
                                            )}
                                        </>
                                    ) : (
                                            <>
                                                {this.state.form.testCases.length > 0 && (
                                                    <Table>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ maxWidth: 25 }}>No.</th>
                                                                <th>Test Case</th>
                                                                <th>Answer</th>
                                                                <th style={{ maxWidth: 25 }}>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.form.testCases.map((testCase, key) => {
                                                                return (
                                                                    <tr key={key}>
                                                                        <th style={{ maxWidth: 25 }}>{key + 1}</th>
                                                                        <td>
                                                                            <TextValidator
                                                                                className="form-control"
                                                                                type="text"
                                                                                name={"test-case-" + testCase.id}
                                                                                value={testCase.content}
                                                                                validators={['required']}
                                                                                onChange={(e) => {
                                                                                    const clonedTestCases = _.cloneDeep(this.state.form.testCases);
                                                                                    const relatedTestCase = _.find(clonedTestCases, { id: testCase.id });
                                                                                    relatedTestCase.content = e.target.value
                                                                                    this.setState({
                                                                                        form: {
                                                                                            ...form,
                                                                                            testCases: clonedTestCases
                                                                                        }
                                                                                    })
                                                                                }}
                                                                                errorMessages={['Test Case content is required']}
                                                                                readOnly={this.props.mode == 'read'}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            <TextValidator
                                                                                className="form-control"
                                                                                type="text"
                                                                                name={"test-case-" + testCase.id}
                                                                                value={testCase.answer}
                                                                                validators={['required']}
                                                                                onChange={(e) => {
                                                                                    const clonedTestCases = _.cloneDeep(this.state.form.testCases);
                                                                                    const relatedTestCase = _.find(clonedTestCases, { id: testCase.id });
                                                                                    relatedTestCase.answer = e.target.value
                                                                                    this.setState({
                                                                                        form: {
                                                                                            ...form,
                                                                                            testCases: clonedTestCases
                                                                                        }
                                                                                    })
                                                                                }}
                                                                                errorMessages={['Answer content is required']}
                                                                                readOnly={this.props.mode == 'read'}
                                                                            />
                                                                        </td>
                                                                        <td style={{ maxWidth: 25 }}>
                                                                            <Button color="danger" onClick={() => {
                                                                                const clonedTestCases = _.cloneDeep(this.state.form.testCases);
                                                                                _.remove(clonedTestCases, { id: testCase.id });
                                                                                this.setState({
                                                                                    form: {
                                                                                        ...this.state.form,
                                                                                        testCases: clonedTestCases
                                                                                    }
                                                                                });
                                                                            }}>×</Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                )}
                                                <Button color="create" size="sm" onClick={() => {
                                                    const clonedForm = _.cloneDeep(this.state.form);
                                                    clonedForm.testCases.push({
                                                        id: randomstring.generate(),
                                                        content: '',
                                                        answer: ''
                                                    });
                                                    this.setState({
                                                        form: clonedForm
                                                    });
                                                }}>Add Test Case</Button>
                                            </>
                                        )}
                                </Row>
                            </FormGroup>
                        </ValidatorForm>
                    </div>
                }
                footerClasses="justify-content-end"
                footer={
                    <React.Fragment>
                        <LoadingButton
                            color="create"
                            size="sm"
                            type="submit"
                            form="question-form"
                            onClick={() => {
                                this.handleSave();
                            }}
                            isLoading={this.state.isSubmitting}
                        >
                            Create
                    </LoadingButton>
                        {this.props.footer}
                    </React.Fragment>
                }
            />
        );
    }
}

export default connect()(QuestionBase);