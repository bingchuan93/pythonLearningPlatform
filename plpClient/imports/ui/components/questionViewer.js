import React, { Component } from 'react';
import { Input, FormGroup, Label, Button } from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

class QuestionViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentQuestion: 1,
        }
    }

    renderQuestion = (question) => {
        const submittedAnswers = this.props.userState.assessmentSubmission?.submittedAnswers;
        return (
            <div>
                {submittedAnswers && (
                    <>
                        <div className="mb-2">{question.content}</div>
                        {question.type != 'coding' ? (
                            <div>
                                {question.answers.map((answer, key) => {
                                    return (
                                        <div key={key} className="d-flex justify-content-start align-items-center">
                                            <input
                                                className="mr-2"
                                                checked={submittedAnswers[question._id.valueOf()] ? submittedAnswers[question._id.valueOf()].includes(answer.id) : false}
                                                type={question.type == 'multiple-choice-multi-answer' ? "checkbox" : "radio"}
                                                name={this.state.currentQuestion}
                                                onChange={() => this.selectAnswer(question, answer)}
                                            />
                                            <div>{answer.content}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                                <div>
                                    <AceEditor
                                        mode="python"
                                        theme="github"
                                        onChange={(e) => {
                                            this.selectAnswer(question, e);
                                        }}
                                        fontSize={14}
                                        showGutter={true}
                                        highlightActiveLine={true}
                                        editorProps={{ $blockScrolling: true }}
                                        value={submittedAnswers[question._id.valueOf()] ? submittedAnswers[question._id.valueOf()] : ''}
                                        setOptions={{
                                            showLineNumbers: true,
                                            tabSize: 2,
                                        }}
                                        />
                                </div>
                            )}
                    </>
                )}
            </div>
        )
    }

    selectAnswer = (question, selectedAnswer) => {
        switch (question.type) {
            case 'multiple-choice-single-answer':
            case 'true-or-false':
                this.props.dispatch({
                    type: "ASSESSMENT/ANSWER", payload: {
                        questionId: question._id.valueOf(),
                        answers: [selectedAnswer.id]
                    }
                });
                break;
            case 'multiple-choice-multi-answer':
                let clonedAnswers = this.props.userState.assessmentSubmission.submittedAnswers[question._id.valueOf()];
                if (clonedAnswers) {
                    if (clonedAnswers.includes(selectedAnswer.id)) {
                        _.remove(clonedAnswers, (o) => o == selectedAnswer.id);
                    } else {
                        clonedAnswers.push(selectedAnswer.id);
                    }
                } else {
                    clonedAnswers = [selectedAnswer.id];
                }
                this.props.dispatch({
                    type: "ASSESSMENT/ANSWER", payload: {
                        questionId: question._id.valueOf(),
                        answers: clonedAnswers
                    }
                });
                break;
            case 'coding':
                this.props.dispatch({
                    type: "ASSESSMENT/ANSWER", payload: {
                        questionId: question._id.valueOf(),
                        answers: selectedAnswer
                    }
                });
                break;
        }
    }

    render() {
        return (
            <div className="mt-3">
                <div className="mb-3">
                    Question {this.state.currentQuestion} / {this.props.assessment.questions.length}
                </div>
                {this.renderQuestion(this.props.assessment.questions[this.state.currentQuestion - 1])}
                <div className="d-flex justify-content-end">
                    <Button
                        color="default"
                        disabled={this.state.currentQuestion <= 1}
                        onClick={() => {
                            if (this.props.quizEnded) {
                                this.props.endQuiz();
                            } else {
                                this.setState({ currentQuestion: this.state.currentQuestion - 1 })
                            }
                        }}
                    >
                        Previous
                        </Button>
                    <Button
                        color="default"
                        disabled={this.state.currentQuestion >= this.props.assessment.questions.length}
                        onClick={() => {
                            if (this.props.quizEnded) {
                                this.props.endQuiz();
                            } else {
                                this.setState({ currentQuestion: this.state.currentQuestion + 1 });
                            }
                        }}
                    >
                        Next
                    </Button>
                </div>
            </div>
        )
    }
}

export default connect(
    ({ userState }) => ({
        userState
    })
)(QuestionViewer);