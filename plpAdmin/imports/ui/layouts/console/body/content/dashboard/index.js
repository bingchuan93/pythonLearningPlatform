import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Card, CardBody } from 'reactstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '/imports/ui/components/fontAwesomeIcon';

class Dashboard extends Component {
    render() {
        return (
            <div className="content-wrapper">
                <div className="dashboard">
                    <div className="content-title">Dashboard</div>
                    <div className="content-body">
                        <Row>
                            <Col xs={12} md={4} lg={4}>
                                <Link to="/students" style={{ color: '#333' }}>
                                    <Card>
                                        <CardBody className="d-flex justify-content-between align-items-center">
                                            <FontAwesomeIcon name='user-graduate' size="2x"/>
											<div className="d-flex flex-column justify-content-around">
												<h3>Students</h3>
												<div>{this.props.studentCount}</div>
											</div>
                                        </CardBody>
                                    </Card>
                                </Link>
                            </Col>
                            <Col xs={12} md={4} lg={4}>
                                <Link to="/tutorial-groups" style={{ color: '#333' }}>
                                    <Card>
                                        <CardBody className="d-flex justify-content-between align-items-center">
                                            <FontAwesomeIcon name='chalkboard' size="2x"/>
											<div className="d-flex flex-column justify-content-around">
												<h3>Tutorial Groups</h3>
												<div>{this.props.tutorialGroupCount}</div>
											</div>
                                        </CardBody>
                                    </Card>
                                </Link>
                            </Col>
                            <Col xs={12} md={4} lg={4}>
                                <Link to="/assessments" style={{ color: '#333' }}>
                                    <Card>
                                        <CardBody className="d-flex justify-content-between align-items-center">
                                            <FontAwesomeIcon name='file-alt' size="2x"/>
											<div className="d-flex flex-column justify-content-around">
												<h3>Assessments</h3>
												<div>{this.props.assessmentCount}</div>
											</div>
                                        </CardBody>
                                    </Card>
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

const DashboardWithTracker = withTracker(() => {
	const studentCountSubscriptionHandler = Meteor.subscribe('students.count');
	const tutorialGroupCountSubscriptionHandler = Meteor.subscribe('tutorialGroups.count');
	const questionCountSubscriptionHandler = Meteor.subscribe('questions.count');
	const assessmentCountSubscriptionHandler = Meteor.subscribe('assessments.count');

	return {
		studentCount: studentCountSubscriptionHandler?.handle.ready() ? Counter.get('student-count') : '-',
		tutorialGroupCount: tutorialGroupCountSubscriptionHandler?.handle.ready() ? Counter.get('tutorial-group-count') : '-',
		questionCount: questionCountSubscriptionHandler?.handle.ready() ? Counter.get('question-count') : '-',
		assessmentCount: assessmentCountSubscriptionHandler?.handle.ready() ? Counter.get('assessment-count') : '-',
	}
})(Dashboard);

export default connect()(DashboardWithTracker);
