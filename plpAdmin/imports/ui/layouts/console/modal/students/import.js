import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BaseModal from '/imports/ui/components/modal/base';
import { FormGroup, Row, Col, Label, Button, Input } from 'reactstrap';
import { ValidatorForm } from 'react-form-validator-core';
import LoadingButton from '/imports/ui/components/loadingButton';
import TextValidator from '/imports/ui/components/validators/text';
import SelectValidator from '/imports/ui/components/validators/select';
import Loader from '/imports/ui/components/icons/loader';
import { getSemesterTypeOptions } from '/imports/util';

class StudentsImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            isImporting: false,
        };
    }

    handleImport = (file) => {
        this.setState({ isImporting: true, errorMsg: '' });
        if (file && getFileExtension(file.name).toLowerCase() == 'csv') {
            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = (e) => {
                console.log(e.target.result);
                const data = csvToArray(e.target.result);
                data.splice(0, 1);
                _.remove(data, function (n) {
                    return _.compact(n).length == 0;
                });
                this.setState({
                    progressTotal: data.length,
                });
                Meteor.call('AddressMaster.import', { data, updateToken: updateToken }, (error, result) => {
                    if (!error) {
                        this.props.dispatch({ type: 'MODAL/CLOSE' });
                        this.props.dispatch({ type: 'CONTENT/FETCHABLE_TABLE_FORCE_FETCH' });
                        this.alertAfterImportSuccess();
                    } else {
                        this.setState({ isImporting: false, errorMsg: error.reason });
                    }
                });
            };
            reader.onerror = (e) => {
                this.setState({
                    isImporting: false,
                    errorMsg: 'Error reading file',
                });
            };
        } else {
            this.setState({
                isImporting: false,
                errorMsg: 'Please select a CSV file',
            });
        }
    };

	render() {
		return (
			<BaseModal
				headerText="Import Students"
				body={
					<div className="student-import-modal">
						<ValidatorForm
							id="student-form"
							instantValidate={false}
							onSubmit={() => {
								this.props.formSubmit(form);
							}}>
							<FormGroup>
								<Row form>
									<Col md={4}>
										<Label className="control-label mb-0 font-weight-bold">File (.csv)</Label>
									</Col>
									<Col md={8}>
										<Input
                                            type="file"
                                            name="file"
                                            accept=".xls"
                                            onChange={(e) => {
                                                console.log(e.target.files);
                                                this.setState({ file: e.target.files[0] })
                                            }}
                                            className="mt-1" />
									</Col>
								</Row>
							</FormGroup>
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
                        <LoadingButton color="create" size="md" type="submit" form="import-address-master-form" isLoading={this.state.isImporting}>
                            Import
                        </LoadingButton>
                    </>
                }
			/>
		);
	};
}

export default StudentsImport;