import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import excelToJson from 'convert-excel-to-json';
import BaseModal from '/imports/ui/components/modal/base';
import { FormGroup, Row, Col, Label, Button, Input } from 'reactstrap';
import { ValidatorForm } from 'react-form-validator-core';
import LoadingButton from '/imports/ui/components/loadingButton';
import TextValidator from '/imports/ui/components/validators/text';
import SelectValidator from '/imports/ui/components/validators/select';
import Loader from '/imports/ui/components/icons/loader';
import { getSemesterTypeOptions, getFileExtension, xlsToArray } from '/imports/util';

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
        if (file && getFileExtension(file.name).toLowerCase() == 'xls') {
            var reader = new FileReader();
            reader.onload = (e) => {
                var data = e.target.result;
                var workbook = XLSX.read(data, {
                    type: 'binary'
                });
                const studentData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { range: 9 });
                console.log(studentData);

                Meteor.call('Students.import', studentData, (error, result) => {
                    this.setState({ isImporting: false });
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
                        this.setState({ errorMsg: error.reason });
                    }
                });
            };
            reader.onerror = (e) => {
                this.setState({ isImporting: false, errorMsg: 'Error reading file' });
            };
            reader.readAsBinaryString(file);
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
                            id="student-import-form"
                            instantValidate={false}
                            onSubmit={() => {
                                this.handleImport(this.state.file);
                            }}
                        >
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
                        <LoadingButton color="create" size="md" type="submit" form="student-import-form" isLoading={this.state.isImporting}>
                            Import
                        </LoadingButton>
                    </>
                }
            />
        );
    };
}

export default connect()(StudentsImport);