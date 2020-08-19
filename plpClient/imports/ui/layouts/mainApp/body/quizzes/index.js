import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardBody, Button, Row, Col } from 'reactstrap';
import moment from 'moment';

class Quizzes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ongoingAssessments: [],
            upcomingAssessments: []
        }
    }

    componentDidMount() {
        this.getRelatedAssessments();
    }

    getRelatedAssessments = () => {
        Meteor.call('Assessments.getRelatedQuizzes', (error, result) => {
            if (!error) {
                this.setState({
                    ongoingAssessments: result.ongoingAssessments,
                    upcomingAssessments: result.upcomingAssessments
                })
            }
        })
    }

    isQuizValid = (assessment) => {
        console.log(assessment.startDate > new Date());
        return assessment.startDate < new Date() || assessment.endDate < new Date();
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

    render() {
        return (
            <div className="quizzes">
                <div className="content-header">
                    Quiz
                </div>
                <div className="content-body">
                    <div>
                        <div>Ongoing</div>
                        <Row className="my-3">
                            {this.state.ongoingAssessments.map((ongoingAssessment, key) => {
                                return (
                                    <Col md={4} key={key}>
                                        <Card>
                                            <CardHeader>{ongoingAssessment.name}</CardHeader>
                                            <CardBody className="d-flex flex-column justify-content-center">
                                                <div>
                                                    <div>{ongoingAssessment.description}</div>
                                                    <div className="mt-3">Start Date: {moment(ongoingAssessment.startDate).format('D MMM YYYY HH:mmA')}</div>
                                                    <div>End Date: {moment(ongoingAssessment.endDate).format('D MMM YYYY HH:mmA')}</div>
                                                    <div className="mt-3">Full marks: {ongoingAssessment.fullMarks}</div>
                                                </div>
                                                <Button
                                                    color="success"
                                                    style={{ margin: '1rem -1.25rem -1.25rem' }} 
                                                    onClick={() => {
                                                        if (this.isQuizValid(ongoingAssessment)) {
                                                            this.props.dispatch({ type: 'ASSESSMENT_MODE/ENTER', payload: { duration: ongoingAssessment.duration } });
                                                            this.props.dispatch(push('/quizzes/' + ongoingAssessment._id.valueOf()));
                                                        } else {
                                                            this.displayError('Quiz is not available');
                                                        }
                                                    }}
                                                    disabled={!this.isQuizValid(ongoingAssessment)}
                                                >
                                                    Select Quiz
                                                </Button>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                )
                            })}
                        </Row>
                    </div>
                    <div>
                        <div>Upcoming</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Quizzes);