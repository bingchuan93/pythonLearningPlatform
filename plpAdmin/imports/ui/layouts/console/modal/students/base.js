import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BaseModal from '/imports/ui/components/modal/base';
import { FormGroup, Row, Col, Label, Button, Input } from 'reactstrap';
import { ValidatorForm } from 'react-form-validator-core';
import TextValidator from '/imports/ui/components/validators/text';
import SelectValidator from '/imports/ui/components/validators/select';
import Loader from '/imports/ui/components/icons/loader';
import { getSemesterTypeOptions } from '/imports/util';

class StudentBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            semesterOptions: [],
            form: {
                firstName: '',
                lastName: '',
                fullName: '',
                nationality: '',
                studentType: '',
                tutorialGroup: '',
                isArchived: false,
            }
        }
    }

    componentDidMount() {
        if (this.props.id) {
            this.getStudent(this.props.id);
        }
        this.setState({ semesterOptions: getSemesterTypeOptions() });
    }

    getStudent = (id) => {
        this.setState({ isFetching: true });
        Meteor.call('Students.getById', id, (error, result) => {
            this.setState({ isFetching: false });
            console.log(result);
            if (!error) {
                this.setState({
                    form: {
                        ...this.state.form,
                        firstName: result.profile.firstName ? result.profile.firstName : '',
                        lastName: result.profile.lastName ? result.profile.lastName : '',
                        fullName: result.profile.fullName ? result.profile.fullName : '',
                        nationality: result.profile.nationality ? result.profile.nationality : '',
                        studentType: result.profile.studentType ? result.profile.studentType : '',
                        tutorialGroup: result.profile.tutorialGroup ? result.profile.tutorialGroup: '',
                        isArchived: result.isArchived
                    }
                });
            }
        })
    }

    handleArchive = (_id) => {
        this.props.dispatch({
            type: 'ALERT/OPEN', payload: {
                alertProps: {
                    body: (
                        <div style={{ textAlign: "center" }}>
                            Are you sure want to ARCHIVE this student?
                        </div>
                    ),
                    closeOnBgClick: true,
                    showConfirmButton: true,
                    confirmButtonText: 'Yes',
                    confirmButtonCallback: (e, closeAlert) => {
                        e.preventDefault();
                        Meteor.call('TutorialGroups.archive', _id, (error, result) => {
                            closeAlert();
                            if (error) {
                                this.displayError(error.reason);
                            }
                            else {
                                this.getTutorialGroup(_id.valueOf());
                                this.props.dispatch({ type: 'CONTENT/FETCHABLE_TABLE_FORCE_FETCH' });
                            }
                        })
                    },
                    showCloseButton: true,
                    closeButtonText: 'No',
                }
            }
        });
    }

    handleRestore = (_id) => {
        this.props.dispatch({
            type: 'ALERT/OPEN', payload: {
                alertProps: {
                    body: (
                        <div style={{ textAlign: "center" }}>
                            Are you sure want to RESTORE this student?
                        </div>
                    ),
                    closeOnBgClick: true,
                    showConfirmButton: true,
                    confirmButtonText: 'Yes',
                    confirmButtonCallback: (e, closeAlert) => {
                        e.preventDefault();
                        Meteor.call('TutorialGroups.restore', _id, (error, result) => {
                            closeAlert();
                            if (error) {
                                this.displayError(error.reason);
                            }
                            else {
                                this.getTutorialGroup(_id.valueOf());
                                this.props.dispatch({ type: 'CONTENT/FETCHABLE_TABLE_FORCE_FETCH' });
                            }
                        })
                    },
                    showCloseButton: true,
                    closeButtonText: 'No',
                }
            }
        });
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
        const { form } = this.state;
        return (
            <BaseModal
                headerText={this.props.title}
                className={this.props.mode == 'view' ? 'read' : ''}
                body={
                    <div className="student-modal">
                        <ValidatorForm
                            id="student-form"
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
                                        <Label className="control-label mb-0 font-weight-bold">Name</Label>
                                    </Col>
                                    <Col md={4}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            name="name"
                                            value={form.firstName}
                                            onChange={(e) => {
                                                this.setState({
                                                    form: {
                                                        ...form,
                                                        firstName: e.target.value
                                                    }
                                                })
                                            }}
                                            disabled={this.props.mode == 'read'}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            name="name"
                                            value={form.lastName}
                                            onChange={(e) => {
                                                this.setState({
                                                    form: {
                                                        ...form,
                                                        lastName: e.target.value
                                                    }
                                                })
                                            }}
                                            disabled={this.props.mode == 'read'}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row form>
                                    <Col md={4}>
                                        <Label className="control-label mb-0 font-weight-bold">Full Name</Label>
                                    </Col>
                                    <Col md={8}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            name="full-name"
                                            value={form.fullName}
                                            onChange={(e) => {
                                                this.setState({
                                                    form: {
                                                        ...form,
                                                        fullName: e.target.value
                                                    }
                                                })
                                            }}
                                            disabled={this.props.mode == 'read'}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row form>
                                    <Col md={4}>
                                        <Label className="control-label mb-0 font-weight-bold">Gender</Label>
                                    </Col>
                                    <Col md={8}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            name="gender"
                                            value={form.gender}
                                            onChange={(e) => {
                                                this.setState({
                                                    form: {
                                                        ...form,
                                                        gender: e.target.value
                                                    }
                                                })
                                            }}
                                            disabled={this.props.mode == 'read'}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row form>
                                    <Col md={4}>
                                        <Label className="control-label mb-0 font-weight-bold">Nationality</Label>
                                    </Col>
                                    <Col md={8}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            name="nationality"
                                            value={form.nationality}
                                            onChange={(e) => {
                                                this.setState({
                                                    form: {
                                                        ...form,
                                                        nationality: e.target.value
                                                    }
                                                })
                                            }}
                                            disabled={this.props.mode == 'read'}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row form>
                                    <Col md={4}>
                                        <Label className="control-label mb-0 font-weight-bold">Student Type</Label>
                                    </Col>
                                    <Col md={8}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            name="student-type"
                                            value={form.studentType}
                                            onChange={(e) => {
                                                this.setState({
                                                    form: {
                                                        ...form,
                                                        studentType: e.target.value
                                                    }
                                                })
                                            }}
                                            disabled={this.props.mode == 'read'}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row form>
                                    <Col md={4}>
                                        <Label className="control-label mb-0 font-weight-bold">Tutorial Group</Label>
                                    </Col>
                                    <Col md={8}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            name="tutorial-group"
                                            value={form.tutorialGroup.name}
                                            onChange={(e) => {
                                                // this.setState({
                                                //     form: {
                                                //         ...form,
                                                //         profile.name: e.target.value
                                                //     }
                                                // })
                                            }}
                                            disabled={this.props.mode == 'read' || true} //To allow for future to change tutorial groups
                                        />
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

export default connect()(StudentBase);