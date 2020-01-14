import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BaseModal from '/imports/ui/components/modal/base';
import { FormGroup, Row, Col, Label, Button } from 'reactstrap';
import { ValidatorForm } from 'react-form-validator-core';
import TextValidator from '/imports/ui/components/validators/text';
import SelectValidator from '/imports/ui/components/validators/select';
import Loader from '/imports/ui/components/icons/loader';
import { getSemesterTypeOptions } from '/imports/util';

class TutorialGroupBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            semesterOptions: [],
            form: {
                names: [''],
                name: '',
                academicYear: new Date().getFullYear(),
                semester: 0,
                isArchived: false,
            }
        }
    }

    componentDidMount() {
        if (this.props.id) {
            this.getTutorialGroup(this.props.id);
        }
        this.setState({ semesterOptions: getSemesterTypeOptions() });
    }

    getTutorialGroup = (id) => {
        this.setState({ isFetching: true });
        Meteor.call('TutorialGroups.getById', id, (error, result) => {
            this.setState({ isFetching: false });
            if (!error) {
                this.setState({
                    form: {
                        ...this.state.form,
                        name: result.name,
                        academicYear: result.academicYear,
                        semester: result.semester,
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
                            Are you sure want to ARCHIVE this tutorial group?
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
                            Are you sure want to RESTORE this tutorial group?
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
                    <div className="tutorial-group-modal">
                        <ValidatorForm
                            id="tutorial-group-form"
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
                                    <Col md={8}>
                                        {this.props.mode == 'create' ? (
                                            <React.Fragment>
                                                {form.names.map((name, key) => {
                                                    return (
                                                        <FormGroup key={key}>
                                                            <TextValidator
                                                                className="form-control"
                                                                type="text"
                                                                name="name"
                                                                value={name}
                                                                validators={['required']}
                                                                onChange={(e) => {
                                                                    const newNames = [...form.names];
                                                                    newNames[key] = e.target.value.toUpperCase()
                                                                    this.setState({
                                                                        form: {
                                                                            ...form,
                                                                            names: newNames
                                                                        }
                                                                    })
                                                                }}
                                                                errorMessages={['Name is required']}
                                                                readOnly={this.props.mode == 'read'}
                                                            />
                                                        </FormGroup>
                                                    );
                                                })}
                                            </React.Fragment>
                                        ) : (
                                                <TextValidator
                                                    className="form-control"
                                                    type="text"
                                                    name="name"
                                                    value={form.name}
                                                    validators={['required']}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            form: {
                                                                ...form,
                                                                name: e.target.value.toUpperCase()
                                                            }
                                                        })
                                                    }}
                                                    errorMessages={['Name is required']}
                                                    readOnly={this.props.mode == 'read'}
                                                />
                                            )}
                                        {this.props.mode == 'create' &&
                                            <Button className="mt-2" block color="create" onClick={() => {
                                                const newNames = [...form.names];
                                                newNames.push('');
                                                this.setState({
                                                    form: {
                                                        ...form,
                                                        names: newNames
                                                    }
                                                });
                                            }}>Add Names</Button>
                                        }
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row form>
                                    <Col md={4}>
                                        <Label className="control-label mb-0 font-weight-bold">Academic Year</Label>
                                    </Col>
                                    <Col md={8}>
                                        <TextValidator
                                            className="form-control"
                                            type="text"
                                            name="name"
                                            value={form.academicYear}
                                            validators={['required']}
                                            onChange={(e) => {
                                                this.setState({
                                                    form: {
                                                        ...form,
                                                        academicYear: e.target.value
                                                    }
                                                })
                                            }}
                                            errorMessages={['Academic year is required']}
                                            readOnly={this.props.mode == 'read'}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row form>
                                    <Col md={4}>
                                        <Label className="control-label mb-0 font-weight-bold">Semester</Label>
                                    </Col>
                                    <Col md={8}>
                                        <SelectValidator
                                            placeholder="Semester"
                                            validators={['required']}
                                            value={_.find(this.state.semesterOptions, { value: form.semester })}
                                            onChange={(e) => {
                                                this.setState({
                                                    form: {
                                                        ...form,
                                                        semester: e.value
                                                    }
                                                })
                                            }}
                                            options={this.state.semesterOptions}
                                            errorMessages={['Semester is required']}
                                            isDisabled={this.props.mode == 'read'}
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

export default connect()(TutorialGroupBase);