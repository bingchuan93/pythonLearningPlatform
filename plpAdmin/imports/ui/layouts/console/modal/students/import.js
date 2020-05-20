import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BaseModal from '/imports/ui/components/modal/base';
import { FormGroup, Row, Col, Label, Button, Input, Badge } from 'reactstrap';
import { ValidatorForm } from 'react-form-validator-core';
import LoadingButton from '/imports/ui/components/loadingButton';
import TextValidator from '/imports/ui/components/validators/text';
import SelectValidator from '/imports/ui/components/validators/select';
import Loader from '/imports/ui/components/icons/loader';
import { getSemesterTypeOptions, getFileExtension, getStudentArrFromXLSXData } from '/imports/util';

class StudentsImport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			file: '',
			isImporting: false,
			isProcessing: false,
			semesterOptions: [],
			form: {
				students: [],
				academicYear: new Date().getFullYear(),
				semester: '',
				tutorialGroups: [],
			},
		};
	}

	componentDidMount() {
		this.setState({ semesterOptions: getSemesterTypeOptions() });
	}

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

	processFile = (file) => {
		this.setState({ isProcessing: true, file: '', form: { ...this.state.form, students: [], tutorialGroups: [] } });
		if (file && getFileExtension(file.name).toLowerCase() == 'xls') {
			var reader = new FileReader();
			reader.onload = (e) => {
				var data = e.target.result;
				var workbook = XLSX.read(data, {
					type: 'binary',
				});
				const studentData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { range: 9 });
				const students = getStudentArrFromXLSXData(studentData);
				this.setState({
					file: file,
					isProcessing: false,
					form: {
						...this.state.form,
						students,
						tutorialGroups: students.reduce((accumulator, current) => {
							if (!accumulator.includes(current.class)) {
								accumulator.push(current.class);
							}
							return accumulator;
						}, []),
					},
				});
			};
			reader.onerror = (e) => {
				this.setState({ isProcessing: false });
				this.displayError('Error reading file');
			};
			reader.readAsBinaryString(file);
		} else {
			this.setState({ isProcessing: false });
			console.log('test');
			this.displayError('Please select an excel file');
		}
	};

	handleImport = (file) => {
		if (file == '') {
			this.displayError('Please upload a file');
		} else {
			this.setState({ isImporting: true, errorMsg: '' });
			Meteor.call('Students.import', this.state.form, (error, result) => {
				this.setState({ isImporting: false });
				console.log(result);
				console.log(error);
				if (!error) {
					this.props.dispatch({ type: 'MODAL/RESET' });
					this.props.dispatch({ type: 'CONTENT/FETCHABLE_TABLE_FORCE_FETCH' });

					this.props.dispatch({
						type: 'ALERT/OPEN',
						payload: {
							alertProps: {
								body: (
									<>
										<div style={{ textAlign: 'center' }}>Good job, students are imported successfully!</div>
									</>
								),
								closeOnBgClick: true,
								showCloseButton: true,
							},
						},
					});
				} else {
					this.displayError(error.reason);
				}
			});
		}
	};

	render() {
		const { form } = this.state;
		console.log(this.state);
		return (
			<BaseModal
				headerText="Import Students"
				body={
					<div className="student-import-modal">
						<ValidatorForm
							id="student-import-form"
							instantValidate={false}
							onSubmit={() => {
								this.handleImport(this.state.file);
							}}>
							<FormGroup>
								<Row form>
									<Col md={4}>
										<Label className="control-label mb-0 font-weight-bold">File (.xls)</Label>
									</Col>
									<Col md={8}>
										<Input
											type="file"
											name="file"
											accept=".xls"
											onChange={(e) => {
												this.processFile(e.target.files[0]);
											}}
											className="mt-1"
										/>
									</Col>
								</Row>
							</FormGroup>
							{this.state.file != '' && (
								<>
									{this.state.isProcessing ? (
										<div className="text-center">
											<Loader />
										</div>
									) : (
										<>
											<FormGroup>
												<Row form>
													<Col md={4}>
														<Label className="control-label mb-0 font-weight-bold">Tutorial Groups</Label>
													</Col>
													<Col md={8}>
														<div className="form-control d-flex flex-wrap h-auto" style={{ maxHeight: 200, minHeight: 38, overflowY: 'auto' }}>
															{form.tutorialGroups.map((tutorialGroup, key) => {
																return (
																	<Badge className="mr-1 mb-1" key={key} color="secondary" size="md">
																		{tutorialGroup}
																	</Badge>
																);
															})}
														</div>
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
																		academicYear: e.target.value,
																	},
																});
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
																		semester: e.value,
																	},
																});
															}}
															options={this.state.semesterOptions}
															errorMessages={['Semester is required']}
														/>
													</Col>
												</Row>
											</FormGroup>
										</>
									)}
								</>
							)}
						</ValidatorForm>
					</div>
				}
				footerClasses="justify-content-end"
				footer={
					<>
						{!this.state.isImporting && (
							<a href="/sample/address.csv" download>
								<Button color="read" size="md">
									Download Sample
								</Button>
							</a>
						)}
						<LoadingButton color="create" size="md" type="submit" form="student-import-form" isLoading={this.state.isImporting}>
							Import
						</LoadingButton>
					</>
				}
			/>
		);
	}
}

export default connect()(StudentsImport);
