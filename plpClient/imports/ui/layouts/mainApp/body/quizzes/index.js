import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, CardHeader, CardBody, Button, Row, Col } from 'reactstrap';
import ActivityIndicator from '/imports/ui/components/icons/activityIndicator';
import moment from 'moment';

class Quizzes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            ongoingQuizzes: [],
            upcomingQuizzes: [],
        };
    }

    componentDidMount() {
        this.getRelatedAssessments();
    }

    getRelatedAssessments = () => {
        this.setState({ isFetching: true });
        Meteor.call('Assessments.getRelatedQuizzes', (error, result) => {
            this.setState({ isFetching: false });
            if (!error) {
                this.setState({
                    ongoingQuizzes: result.ongoingQuizzes,
                    upcomingQuizzes: result.upcomingQuizzes,
                });
            }
        });
    };

    isQuizValid = (quiz) => {
        return quiz.startDate < new Date() || quiz.endDate < new Date();
    };

    displayError = (errorMsg) => {
        this.props.dispatch({
            type: 'ALERT/OPEN',
            payload: {
                alertProps: {
                    // icon: ErrorIcon,
                    body: (
                        <React.Fragment>
                            <div className="alert-icon mb-2">{/* <ErrorIcon /> */}</div>
                            <div style={{ textAlign: 'center' }}>{errorMsg}</div>
                        </React.Fragment>
                    ),
                    closeOnBgClick: true,
                    showCloseButton: true,
                },
            },
        });
    };

    render() {
        return (
            <div className="quizzes">
                <div className="content-header">Quiz</div>
                <div className="content-body">
                    <div>
                        <div>Ongoing</div>
                        {this.state.isFetching ? (
                            <div className="text-center">
                                <ActivityIndicator />
                            </div>
                        ) : (
                                <Row className="my-3">
                                    {this.state.ongoingQuizzes.length > 0 ? (
                                        <>
                                            {this.state.ongoingQuizzes.map((ongoingQuiz, key) => {
                                                return (
                                                    <Col md={4} key={key}>
                                                        <Card>
                                                            <CardHeader>{ongoingQuiz.name}</CardHeader>
                                                            <CardBody className="d-flex flex-column justify-content-center">
                                                                <div>
                                                                    <div>{ongoingQuiz.description}</div>
                                                                    <div className="mt-3 text-muted font-sm">
                                                                        Start Date
                                                                </div>
                                                                    <div>
                                                                        {moment(ongoingQuiz.startDate).format(
                                                                            'D MMM YYYY HH:mmA'
                                                                        )}
                                                                    </div>
                                                                    <div className="mt-2 text-muted font-sm">End Date</div>
                                                                    <div>
                                                                        {moment(ongoingQuiz.endDate).format(
                                                                            'D MMM YYYY HH:mmA'
                                                                        )}
                                                                    </div>
                                                                    <div className="mt-3 text-muted font-sm">
                                                                        Full marks
                                                                    </div>
                                                                    <div>{ongoingQuiz.fullMarks}</div>
                                                                    <div className="mt-3 text-muted font-sm">
                                                                        Time Limit
                                                                    </div>
                                                                    <div>{ongoingQuiz.duration} min{ongoingQuiz.duration > 1 ? 's' : ''}</div>
                                                                    <div className="mt-3 text-muted font-sm">
                                                                        Number of Attempts
                                                                </div>
                                                                    <div>
                                                                        {ongoingQuiz.attempts > 0
                                                                            ? ongoingQuiz.attempts
                                                                            : 'No Limit'}
                                                                    </div>
                                                                    <div className="mt-3 text-muted font-sm">
                                                                        Attempts Taken
                                                                </div>
                                                                    {ongoingQuiz.prevAttempts.length > 0 ? (
                                                                        <>
                                                                            {ongoingQuiz.prevAttempts.map((prevAttempt, key) => {
                                                                                return (
                                                                                    <div key={key} className={"d-flex justify-content-between py-1 px-2" + (key == 0 ? '' : ' border-top')} style={{ borderColor: '#00000020' }}>
                                                                                        <div>{key + 1}</div>
                                                                                        <div>{prevAttempt.marks} / {ongoingQuiz.fullMarks}</div>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </>
                                                                    ) : (
                                                                            <div>Not attempted</div>
                                                                        )}
                                                                </div>
                                                                <Button
                                                                    color="success"
                                                                    style={{ margin: '1rem -1.25rem -1.25rem' }}
                                                                    onClick={() => {
                                                                        if (this.isQuizValid(ongoingQuiz)) {
                                                                            this.props.dispatch(
                                                                                push(
                                                                                    '/quizzes/' + ongoingQuiz._id.valueOf()
                                                                                )
                                                                            );
                                                                        } else {
                                                                            this.displayError('Quiz is not available');
                                                                        }
                                                                    }}
                                                                    disabled={!this.isQuizValid(ongoingQuiz)}
                                                                >
                                                                    Select Quiz
                                                            </Button>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                );
                                            })}
                                        </>
                                    ) : (
                                            <div className="text-secondary">You have no ongoing quizzes :)</div>
                                        )}
                                </Row>
                            )}
                    </div>
                    <div>
                        <div>Upcoming</div>
                        {this.state.isFetching ? (
                            <div className="text-center">
                                <ActivityIndicator />
                            </div>
                        ) : (
                                <Row className="my-3">
                                    {this.state.upcomingQuizzes.length > 0 ? (
                                        <>
                                            {this.state.upcomingQuizzes.map((upcomingQuiz, key) => {
                                                return (
                                                    <Col md={4} key={key}>
                                                        <Card>
                                                            <CardHeader>{upcomingQuiz.name}</CardHeader>
                                                            <CardBody className="d-flex flex-column justify-content-center">
                                                                <div>
                                                                    <div>{upcomingQuiz.description}</div>
                                                                    <div className="mt-3 text-muted font-sm">
                                                                        Start Date
                                                                </div>
                                                                    <div>
                                                                        {moment(upcomingQuiz.startDate).format(
                                                                            'D MMM YYYY HH:mmA'
                                                                        )}
                                                                    </div>
                                                                    <div className="mt-2 text-muted font-sm">End Date</div>
                                                                    <div>
                                                                        {moment(upcomingQuiz.endDate).format(
                                                                            'D MMM YYYY HH:mmA'
                                                                        )}
                                                                    </div>
                                                                    <div className="mt-3 text-muted font-sm">
                                                                        Full marks
                                                                </div>
                                                                    <div>{upcomingQuiz.fullMarks}</div>
                                                                    <div className="mt-3 text-muted font-sm">
                                                                        Number of Attempts
                                                                </div>
                                                                    <div>
                                                                        {upcomingQuiz.attempts > 0
                                                                            ? upcomingQuiz.attempts
                                                                            : 'No Limit'}
                                                                    </div>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                );
                                            })}
                                        </>
                                    ) : (
                                            <div className="text-secondary">You have no upcoming quizzes :)</div>
                                        )}
                                </Row>
                            )}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Quizzes);
