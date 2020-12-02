import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Button, Badge } from 'reactstrap';
import QuestionViewer from '/imports/ui/components/questionViewer';
import ActivityIndicator from '/imports/ui/components/icons/activityIndicator';

class StartQuiz extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isQuizFetching: true,
            quiz: null,
            seconds: 0,
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.getQuiz(this.props.match.params.id);
        } else {
            this.setState({ isQuizFetching: false });
        }
        if (this.props.userState.assessmentEndTime) {
            if (new Date(this.props.userState.assessmentEndTime).getTime() > new Date().getTime()) {
                this.startTimer();
            } else {
                this.endQuiz();
            }
        }
    }

    getQuiz = (id) => {
        this.setState({ isQuizFetching: true });
        Meteor.call('Assessment.getStartableQuizById', id, (error, result) => {
            if (!error) {
                this.setState({ quiz: result, isQuizFetching: false });
            } else {
                this.setState({ isQuizFetching: false });
                this.props.dispatch(push('/'));
            }
        });
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    displayMessage = (message) => {
        this.props.dispatch({
            type: 'ALERT/OPEN',
            payload: {
                alertProps: {
                    body: (
                        <React.Fragment>
                            <div style={{ textAlign: 'center' }}>{message}</div>
                        </React.Fragment>
                    ),
                    closeOnBgClick: true,
                    showCloseButton: true,
                },
            },
        });
    }

    startTimer = () => {
        this.timer = setInterval(() => {
            const timeLeft = (new Date(this.props.userState.assessmentEndTime).getTime() - new Date().getTime()) / 1000;
            if (timeLeft < 0) {
                this.endQuiz();
            } else {
                this.setState({
                    seconds: timeLeft
                });
            }
            if (!this.props.userState.hasWarned && (timeLeft < (this.state.quiz.timeLeftBeforeWarning * 60))) {
                this.displayMessage(`You have less than ${this.state.quiz.timeLeftBeforeWarning} minute${this.state.quiz.timeLeftBeforeWarning > 1 ? 's' : ''} left.`);
                this.props.dispatch({ type: "ASSESSMENT_MODE/WARN" });
            }
        }, 1000);
    }

    endQuiz = () => {
        console.log(this.props.userState.assessmentSubmission);
        clearInterval(this.timer);
        const { quizId, submittedAnswers } = this.props.userState.assessmentSubmission;
        Meteor.call('Submissions.submitQuiz', quizId, submittedAnswers, (error, result) => {
            if (!error) {
                this.props.dispatch({ type: "ASSESSMENT_MODE/EXIT" });
                this.props.dispatch(push('/quizzes'));
                this.displayMessage('Quiz has ended');
            }
        })
    }

    render() {
        const { isQuizFetching, quiz } = this.state;
        console.log(this.state);
        return (
            <>
                {!isQuizFetching ? (
                    <>
                        <h3>
                            {quiz.content}
                        </h3>
                        {this.props.userState.assessmentEndTime ? (
                            <div>
                                <div className="d-flex justify-content-end align-items-center">
                                    <Badge className="font-md py-2" color="danger" style={{ minWidth: 100 }}>{Math.floor(this.state.seconds / 3600).toString().padStart(2, "0")}:{Math.floor((this.state.seconds % 3600) / 60).toString().padStart(2, "0")}:{Math.floor(this.state.seconds % 60).toString().padStart(2, "0")}</Badge>
                                    <Button color="secondary" className="ml-3" size="sm" onClick={() => this.endQuiz()}>End Quiz</Button>
                                </div>
                                {this.state.isQuizFetching ? (
                                    <div className="text-center">
                                        <ActivityIndicator />
                                    </div>
                                ) : (
                                        <QuestionViewer assessment={quiz} />
                                    )}
                            </div>
                        ) : (
                                <div className="pt-3">
                                    <div>
                                        By click the button below, you have agreed to the school's term and condition in undertaking an assessment.
                                        Any cheating will be dealt with seriously.
                                    </div>
                                    <div className="mt-3">
                                        <Button
                                            color="secondary"
                                            className="mr-2"
                                            onClick={() => this.props.dispatch(push('/quizzes'))}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            color="success"
                                            onClick={() => {
                                                this.props.dispatch({ type: "ASSESSMENT_MODE/START", payload: { duration: quiz.duration, quizId: quiz._id.valueOf() } });
                                                this.startTimer();
                                            }}
                                        >Start Quiz</Button>
                                    </div>
                                </div>
                            )
                        }
                    </>
                ) : (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
                            <ActivityIndicator />
                        </div>
                    )}
            </>
        );
    }
}

export default connect(
    ({ userState }) => ({
        userState
    })
)(StartQuiz);