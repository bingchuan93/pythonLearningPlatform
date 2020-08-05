import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BaseModal from '/imports/ui/components/modal/base';
import { FormGroup, Row, Col, Label, Button, Input, Table } from 'reactstrap';
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
import TutorialGroupPicker from '/imports/ui/layouts/console/modal/common/tutorialGroupPicker';
import QuestionCreate from '/imports/ui/layouts/console/modal/questions/create';
import { getAssessmentTypeOptions, getTutorialGroupOptions } from '/imports/util';
import randomstring from 'randomstring';

import 'react-datepicker/dist/react-datepicker.css';

class AssessmentBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isFetching: false,
			isFetchingQuestions: false,
			assessmentTypeOptions: [],
			tutorialGroupOptions: [],
			form: {
				questionsSyncToken: '',
				type: '',
				name: '',
				description: '',
				participatingTutorialGroups: [],
				questions: [],
				duration: 0,
				noOfAttempts: 0,
				startDate: null,
				endDate: null,
				isArchived: false
			}
		};
	}

	componentDidMount() {
		if (this.props.id) {
			this.getAssessment(this.props.id);
		} else {
			this.setState({
				form: {
					...this.state.form,
					questionsSyncToken: randomstring.generate()
				}
			})
		}
		this.setState({ assessmentTypeOptions: getAssessmentTypeOptions() });
		getTutorialGroupOptions((options) => this.setState({ tutorialGroupOptions: options }));
	}

	componentDidUpdate(prevState, prevProps) {
		if (prevProps.assessmentState.questionIds.length != this.props.assessmentState.questionIds.length) {
			this.getQuestions();
		}
	}

	getAssessment = id => {
		this.setState({ isFetching: true });
		Meteor.call('Assessments.getById', new Mongo.ObjectID(id), (error, result) => {
			this.setState({ isFetching: false });
			if (!error) {
				this.setState({
					form: {
						...this.state.form,
						type: result.type,
						name: result.name,
						description: result.description,
						participatingTutorialGroups: result.participatingTutorialGroups,
						questions: result.questions,
						duration: result.duration,
						noOfAttempts: result.noOfAttempts,
						startDate: result.startDate,
						endDate: result.endDate,
						isArchived: result.isArchived
					}
				});
			}
		});
	};

	getQuestions = () => {
		this.setState({ isFetchingQuestions: true });
		Meteor.call('Questions.getByIds', this.props.assessmentState.questionIds, (error, result) => {
			this.setState({ isFetchingQuestions: false });
			if (!error) {
				this.setState({
					form: {
						...this.state.form,
						questions: result
					}
				})
			}
		})
	}

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

	saveSelectedTutorialGroups = (selectedTutorialGroups) => {
		this.setState({
			form: {
				...this.state.form,
				participatingTutorialGroups: selectedTutorialGroups
			}
		});
	}

	render() {
		const { form } = this.state;
		return (
			<BaseModal
				headerText={this.props.title}
				className={this.props.mode == 'view' ? 'view' : ''}
				body={
					<div className="assessment-modal d-flex justify-content-between">
						<ValidatorForm
							id="assessment-form"
							className="mr-3"
							style={{ flex: '1 0 0' }}
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
											isDisabled={this.props.mode == 'view'}
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
											disabled={this.props.mode == 'view'}
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
											readOnly={this.props.mode == 'view'}
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
											readOnly={this.props.mode == 'view'}
										/>
									</Col>
								</Row>
							</FormGroup>
							<FormGroup>
								<Row form>
									<Col md={4}>
										<Label className="control-label mb-0 font-weight-bold">No of Attempts</Label>
									</Col>
									<Col md={8}>
										<NumberFormat
											thousandSeparator={false}
											decimalScale={0}
											fixedDecimalScale={true}
											className="form-control"
											value={form.noOfAttempts}
											onValueChange={result => {
												this.setState({
													form: {
														...form,
														noOfAttempts: result.floatValue
													}
												});
											}}
											readOnly={this.props.mode == 'view'}
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
									<Col md={8}>
										{form.participatingTutorialGroups.length > 0 && (
											<Table borderless>
												<thead>
													<tr>
														<th>Name</th>
														<th>Academic Year</th>
														<th>Semester</th>
													</tr>
												</thead>
												<tbody>
													{form.participatingTutorialGroups.map((participatingTutorialGroup, key) => {
														return (
															<tr key={key}>
																<td>{participatingTutorialGroup.name}</td>
																<td>{participatingTutorialGroup.academicYear}</td>
																<td>{participatingTutorialGroup.semester}</td>
															</tr>
														);
													})}
												</tbody>
											</Table>
										)}
										<Button
											className="w-100"
											color="create"
											onClick={() => {
												this.props.dispatch({
													type: 'MODAL/OPEN', payload: {
														modal: TutorialGroupPicker,
														modalProps: {
															saveSelectedTutorialGroups: this.saveSelectedTutorialGroups,
															selectedTutorialGroups: form.participatingTutorialGroups,
															filterParams: {
																isArchived: false
															}
														},
														// prevLocation: { ...this.props.router.location },
													}
												});
											}}
										>Select Tutorial Groups</Button>
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
											readOnly={this.props.mode == 'view'}
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
											readOnly={this.props.mode == 'view'}
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
											checked={form.isArchived}
											uncheckedIcon={false}
											checkedIcon={false}
											onColor={'#3b9e57'}
											offColor={'#9e3b3b'}
											onChange={value => {
												this.setState({
													form: {
														...form,
														isArchived: value
													}
												});
											}}
											disabled={this.props.mode == 'view'}
											className="react-switch"
										/>
									</Col>
								</Row>
							</FormGroup>
						</ValidatorForm>
						<div className="pl-3 border-left border-light-grey" style={{ flex: '1 0 0' }}>
							<div className="d-flex">
								<Button color="create" className="mr-3" onClick={() => {
									this.props.dispatch({
										type: 'MODAL/OPEN', payload: {
											modal: QuestionCreate,
											modalProps: {
												afterCloseModal: () => {
													console.log('custom close');
												},
												questionsSyncToken: this.state.form.questionsSyncToken,
											},
											// prevLocation: { ...this.props.router.location },
										}
									})
								}} block>Add New Question</Button>
								<Button color="create" className="mt-0" onClick={() => {
									this.props.dispatch({
										type: 'MODAL/OPEN', payload: {
											modal: QuestionCreate,
											modalProps: {
												afterCloseModal: () => {
													console.log('custom close');
												},
												questionsSyncToken: this.state.form.questionsSyncToken,
											},
											// prevLocation: { ...this.props.router.location },
										}
									})
								}} block>Copy from existing Question</Button>
							</div>
							{this.state.isFetchingQuestions ? (
								<div className="text-center">
									<Loader />
								</div>
							) : (
								<>
									{form.questions.map((question) => {
										return (
											<div>
												{question.content}
											</div>
										)
									})}
								</>
							)}
						</div>
					</ div>
				}
				footerClasses="justify-content-end"
				footer={
					<React.Fragment>
						{this.props.mode == 'view' && !this.state.isFetching && (
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

export default connect(
	({ router, assessmentState }) => ({
		router,
		assessmentState
	})
)(AssessmentBase);
