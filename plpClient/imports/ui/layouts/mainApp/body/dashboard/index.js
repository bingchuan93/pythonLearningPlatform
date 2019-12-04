import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import SVGIcon from '/imports/ui/components/icons/svgIcon';

class Dashboard extends Component {
    render() {
        return (
            <div className="dashboard">
                <Row className="pt-5">
                    <Col className="mb-3">
                        <div className="menu-button lesson clickable p-3" onClick={() => { this.props.dispatch(push('/lessons')) }} >
                            <SVGIcon icon="lesson" marginLeft="auto" marginRight="auto" />
                            <div className="mt-3 text-center font-lg">Lessons</div>
                        </div>
                    </Col>
                    <Col className="mb-3">
                        <div className="menu-button quiz clickable p-3" onClick={() => { }} >
                            <SVGIcon icon="quiz" marginLeft="auto" marginRight="auto" />
                            <div className="mt-3 text-center font-lg">Quizzes</div>
                        </div>
                    </Col>
                    <Col className="mb-3">
                        <div className="menu-button test clickable p-3" onClick={() => { }} >
                            <SVGIcon icon="test" marginLeft="auto" marginRight="auto" />
                            <div className="mt-3 text-center font-lg">Tests</div>
                        </div>
                    </Col>
                </Row>
                <Row className="pt-3">
                    <Col>
                        <div className="menu-button resume d-flex flex-row justify-content-center align-contents-center clickable p-3">
                            <SVGIcon icon="start" height={125} width={125} />
                            <div className="d-flex flex-column justify-content-center ml-3 font-xl">Resume Lesson</div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect()(Dashboard);