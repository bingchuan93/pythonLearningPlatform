import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BaseModal from '/imports/ui/components/modal/base';
import { FormGroup, Row, Col, Label } from 'reactstrap';
import { ValidatorForm } from 'react-form-validator-core';
import TextValidator from '/imports/ui/components/validators/text';
import Loader from '/imports/ui/components/icons/loader';

class TutorialGroupBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            form: {
                name: '',
                academicYear: new Date().getFullYear(),
                semester: 0
            }
        }
    }

    componentDidMount() {
        if (this.props.id) {
            this.getTutorialGroup(this.props.id);
        }
    }
    
    getTutorialGroup = (id) => {
        this.setState({ isFetching: true });
        Meteor.call('TutorialGroups.getById', id, (error, result) => {
            this.setState({ isFetching: false });
            if (!error) {
                this.setState({
                    form : {
                        ...this.state.form,
                        name: result.name,
                        academicYear: result.academicYear,
                        semester: result.semester
                    }
                });
            }
        })
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
                                        <TextValidator
                                            className="form-control"
                                            type="text"
                                            name="name"
                                            value={form.semester}
                                            validators={['required']}
                                            onChange={(e) => {
                                                this.setState({
                                                    form: {
                                                        ...form,
                                                        semester: e.target.value
                                                    }
                                                })
                                            }}
                                            errorMessages={['Semester is required']}
                                            readOnly={this.props.mode == 'read'}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                        </ValidatorForm>
                    </div>
                }
                footerClasses="justify-content-end"
                footer={this.props.footer}
            />
        );
    }
}

export default connect()(TutorialGroupBase);