import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BaseModal from '/imports/ui/components/modal/base';
import { FormGroup, Row, Col, Label, Button, Input } from 'reactstrap';
import { ValidatorForm } from 'react-form-validator-core';
import TextValidator from '/imports/ui/components/validators/text';
import TextAreaValidator from '/imports/ui/components/validators/textarea';
import SelectValidator from '/imports/ui/components/validators/select';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Switch from 'react-switch';
import Loader from '/imports/ui/components/icons/loader';
import Checkbox from '/imports/ui/components/checkbox';
import { getAssessmentTypeOptions, getTutorialGroupOptions } from '/imports/util';

import 'react-datepicker/dist/react-datepicker.css';

class AssessmentBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isFetching: false,
            assessmentTypeOptions: [],
            tutorialGroupOptions: [],
            isAllChecked: false,
			form: {
				type: '',
				name: '',
				description: '',
				participatingTutorialGroups: [],
				questionIds: [],
				duration: 0,
				startDate: null,
				endDate: null,
				isArchived: false
			}
		};
	}

	componentDidMount() {
		if (this.props.id) {
			this.getAssessment(this.props.id);
		}
        this.setState({ assessmentTypeOptions: getAssessmentTypeOptions() });
        getTutorialGroupOptions((options) => this.setState({ tutorialGroupOptions: options }));
	}

	getAssessment = id => {
		this.setState({ isFetching: true });
		Meteor.call('Assessment.getById', new Mongo.ObjectID(id), (error, result) => {
			this.setState({ isFetching: false });
			console.log(result);
			if (!error) {
				this.setState({
					form: {
						...this.state.form,
						type: result.type,
						name: result.name,
						description: result.description,
						participatingTutorialGroups: result.participatingTutorialGroups,
						questionIds: result.questionIds,
						duration: result.duration,
						startDate: result.startDate,
						endDate: result.endDate,
						isArchived: result.isArchived
					}
				});
			}
		});
	};

	handleArchive = _id => {
		this.props.dispatch({
			type: 'ALERT/OPEN',
			payload: {
				alertProps: {
					body: <div style={{ textAlign: 'center' }}>Are you sure want to ARCHIVE this assessment?</div>,
					closeOnBgClick: true,
					showConfirmButton: true,
					confirmButtonText: 'Yes',
					confirmButtonCallback: (e, closeAlert) => {
						e.preventDefault();
						Meteor.call('Assessments.archive', _id, (error, result) => {
							closeAlert();
							if (error) {
								this.displayError(error.reason);
							} else {
								this.getTutorialGroup(_id.valueOf());
								this.props.dispatch({ type: 'CONTENT/FETCHABLE_TABLE_FORCE_FETCH' });
							}
						});
					},
					showCloseButton: true,
					closeButtonText: 'No'
				}
			}
		});
	};

	handleRestore = _id => {
		this.props.dispatch({
			type: 'ALERT/OPEN',
			payload: {
				alertProps: {
					body: <div style={{ textAlign: 'center' }}>Are you sure want to RESTORE this assessment?</div>,
					closeOnBgClick: true,
					showConfirmButton: true,
					confirmButtonText: 'Yes',
					confirmButtonCallback: (e, closeAlert) => {
						e.preventDefault();
						Meteor.call('Assessments.restore', _id, (error, result) => {
							closeAlert();
							if (error) {
								this.displayError(error.reason);
							} else {
								this.getTutorialGroup(_id.valueOf());
								this.props.dispatch({ type: 'CONTENT/FETCHABLE_TABLE_FORCE_FETCH' });
							}
						});
					},
					showCloseButton: true,
					closeButtonText: 'No'
				}
			}
		});
	};

	displayError = errorMsg => {
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
					showCloseButton: true
				}
			}
		});
	};

	render() {
        const { form } = this.state;
        console.log(this.state);
		return (
			<BaseModal
				headerText={this.props.title}
				className={this.props.mode == 'view' ? 'read' : ''}
				body={
					<div className="assessment-modal">
						<ValidatorForm
							id="assessment-form"
							instantValidate={false}
							onSubmit={() => {
								this.props.formSubmit(form);
							}}>
							{this.props.mode != 'create' && this.state.isFetching && (
								<div className="overlay">
									<Loader />
								</div>
							)}
							<FormGroup>
								<Row form>
									<Col md={4}>
										<Label className="control-label mb-0 font-weight-bold">Type</Label>
									</Col>
									<Col md={8}>
										<SelectValidator
											placeholder="Type"
											validators={['required']}
											value={_.find(this.state.assessmentTypeOptions, { value: form.type })}
											onChange={e => {
												this.setState({
													form: {
														...form,
														type: e.value
													}
												});
											}}
											options={this.state.assessmentTypeOptions}
											errorMessages={['Type is required']}
											isDisabled={this.props.mode == 'read'}
										/>
									</Col>
								</Row>
							</FormGroup>
							<FormGroup>
								<Row form>
									<Col md={4}>
										<Label className="control-label mb-0 font-weight-bold">Name</Label>
									</Col>
									<Col md={8}>
										<Input
											className="form-control"
											type="text"
											name="name"
											value={form.name}
											onChange={e => {
												this.setState({
													form: {
														...form,
														name: e.target.value
													}
												});
											}}
											disabled={this.props.mode == 'read'}
										/>
									</Col>
								</Row>
							</FormGroup>
							<FormGroup>
								<Row form>
									<Col md={4}>
										<Label className="control-label mb-0 font-weight-bold">Description</Label>
									</Col>
									<Col md={8}>
										<TextAreaValidator
											className="form-control"
											style={{ height: 200 }}
											name="caption-text"
											value={form.description}
											onChange={e => {
												this.setState({
													form: {
														...form,
														description: e.target.value
													}
												});
											}}
											readOnly={this.props.mode == 'read'}
										/>
									</Col>
								</Row>
							</FormGroup>
							<FormGroup>
								<Row form>
									<Col md={4}>
										<Label className="control-label mb-0 font-weight-bold">Duration (mins)</Label>
									</Col>
									<Col md={8}>
										<NumberFormat
											thousandSeparator={false}
											decimalScale={0}
											fixedDecimalScale={true}
											className="form-control"
											value={form.duration}
											onValueChange={result => {
												this.setState({
													form: {
														...form,
														duration: result.floatValue
													}
												});
											}}
											readOnly={this.props.mode == 'read'}
										/>
									</Col>
								</Row>
							</FormGroup>
							<FormGroup>
								<Row form>
									<Col md={4}>
										<Label className="control-label mb-0 font-weight-bold">
											Participating Tutorial Groups
										</Label>
									</Col>
									<Col md={6}>
										<SelectValidator
											placeholder="Tutorial Groups"
											validators={['required']}
											value={_.find(this.state.tutorialGroupOptions, { value: form.type })}
											onChange={e => {
                                                console.log(e);
												this.setState({
													form: {
														...form,
														participatingTutorialGroups: e.value
													}
												});
                                            }}
                                            isMulti={true}
											options={this.state.tutorialGroupOptions}
											errorMessages={['Tutorial Groups is required']}
											isDisabled={this.props.mode == 'read' || this.state.isAllChecked}
										/>
                                    </Col>
									<Col md={2} className="d-flex justify-content-around">
										<Checkbox
											checked={this.state.isAllChecked}
                                            onChange={(e) => {
                                                console.log(e);
                                                this.setState({isAllChecked: !this.state.isAllChecked});
                                            }}
										/>
                                        <div>All</div>
									</Col>
								</Row>
							</FormGroup>
							<FormGroup>
								<Row form>
									<Col md={4}>
										<Label className="control-label mb-0 font-weight-bold">Start Date</Label>
									</Col>
									<Col md={8}>
										<DatePicker
											className="form-control"
											selected={form.startDate}
											dateFormat={'yyyy-MM-dd h:mma'}
											timeFormat="HH:mm"
											showTimeSelect
											onChange={value => {
												if (value) {
													this.setState({
														form: {
															...form,
															startDate: value,
															endDate:
																value <= form.endDate
																	? form.endDate
																	: moment(value)
																			.add(30, 'minute')
																			.toDate()
														}
													});
												}
											}}
											readOnly={this.props.mode == 'read'}
										/>
									</Col>
								</Row>
							</FormGroup>
							<FormGroup>
								<Row form>
									<Col md={4}>
										<Label className="control-label mb-0 font-weight-bold">End Date</Label>
									</Col>
									<Col md={8}>
										<DatePicker
											className="form-control"
											selected={form.endDate}
											dateFormat={'yyyy-MM-dd h:mma'}
											timeFormat="HH:mm"
											showTimeSelect
											minDate={form.startDate}
											onChange={value => {
												if (value) {
													this.setState({
														form: {
															...form,
															endDate: value
														}
													});
												}
											}}
											readOnly={this.props.mode == 'read'}
										/>
									</Col>
								</Row>
							</FormGroup>
							<FormGroup>
								<Row form>
									<Col md={4}>
										<Label className="control-label mb-0 font-weight-bold">Is Archived</Label>
									</Col>
									<Col md={8}>
										<Switch
											checked={!form.isArchived}
											uncheckedIcon={false}
											checkedIcon={false}
											onColor={'#3b9e57'}
											offColor={'#9e3b3b'}
											onChange={value => {
												this.setState({
													form: {
														...form,
														isArchived: !value
													}
												});
											}}
											disabled={this.props.mode == 'read'}
											className="react-switch"
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
						{this.props.mode == 'read' && !this.state.isFetching && (
							<React.Fragment>
								{form.isArchived ? (
									<Button
										color="success"
										size="sm"
										onClick={() => {
											this.handleRestore(new Mongo.ObjectID(this.props.id));
										}}>
										Restore
									</Button>
								) : (
									<Button
										color="secondary"
										size="sm"
										onClick={() => {
											this.handleArchive(new Mongo.ObjectID(this.props.id));
										}}>
										Archive
									</Button>
								)}
							</React.Fragment>
						)}
						{this.props.footer}
					</React.Fragment>
				}
			/>
		);
	}
}

export default connect()(AssessmentBase);
