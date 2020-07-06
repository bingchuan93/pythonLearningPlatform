import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import _ from 'lodash';
import FetchableReactTable from '/imports/ui/components/fetchableReactTable';
import BaseModal from '/imports/ui/components/modal/base';
import Checkbox from '/imports/ui/components/checkbox';
import constants from '/imports/constants';

class TutorialGroupPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTutorialGroups: this.props.selectedTutorialGroups ? this.props.selectedTutorialGroups : [],
            showRelatedTutorialGroups: false,
            extraTableParams: {
                isArchived: false
            }
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.showRelatedTutorialGroups != this.state.showRelatedTutorialGroups) {
            if (this.state.showRelatedTutorialGroups) {
                this.setState({
                    extraTableParams: {
                        ...this.state.extraTableParams,
                        relatedTutorialGroupIds: this.props.userState.user.profile.relatedTutorialGroupIds
                    }
                });
            } else {
                const { isArchived } = this.state.extraTableParams;
                this.setState({ extraTableParams: { isArchived } });
            }
        }
    }

    render() {
        console.log(this.state.extraTableParams);
        console.log(this.props.userState.user);
        const columns = [
            {
                id: 'name',
                Header: 'Name',
                accessor: (data) => data.name,
            },
            {
                id: 'academicYear',
                Header: 'Academic Year',
                accessor: (data) => data.academicYear,
            },
            {
                id: 'semester',
                Header: 'Semester',
                accessor: (data) => constants.semesterTypes[data.semester],
            },
            {
                id: 'isArchived',
                show: false,
                searchAlgorithm: 'boolean'
            }
        ];

        return (
            <BaseModal
                index={this.props.index}
                headerText="Select Tutorial Groups"
                className="tutorial-group-picker"
                size="lg"
                bodyClasses={'overflow-auto'}
                body={
                    <>
                        <div className="mb-3" style={{ paddingLeft: 10 }}>
                            <Checkbox
                                checked={this.state.showRelatedTutorialGroups}
                                onChange={(e) => {
                                    this.setState({ showRelatedTutorialGroups: !this.state.showRelatedTutorialGroups });
                                }}
                                label="Show my tutorial groups only"
                            />
                        </div>
                        <FetchableReactTable
                            dataEndPoint={'TutorialGroups.list'}
                            dataParams={this.state.extraTableParams}
                            columns={columns}
                            // disabledRows={this.props.disabledProducts}
                            clickRowToSelect={true}
                            showCheckbox={true}
                            preSelectedRows={this.state.selectedTutorialGroups}
                            shouldRetainSelectedRows={true}
                            onCheckboxChange={(selectedRows) => {
                                this.setState({ selectedTutorialGroups: selectedRows });
                            }}
                            isMultiSelect={this.props.isMulti}
                            defaultFiltered={[{ id: 'isArchived', value: 'false' }]}
                            className="mb-3"
                        />
                    </>
                }
                footerClasses="justify-content-end"
                footer={
                    <>
                        <Button
                            color="secondary"
                            size="md"
                            onClick={() => {
                                console.log('test');
                                this.props.dispatch({ type: 'MODAL/CLOSE' });
                            }}
                        >
                            Cancel
						</Button>
                        <Button
                            color="primary"
                            size="md"
                            onClick={() => {
                                this.props.saveSelectedTutorialGroups(this.state.selectedTutorialGroups);
                                this.props.dispatch({ type: 'MODAL/CLOSE' });
                            }}
                            disabled={this.state.selectedTutorialGroups.length == 0}
                        >
                            Save {this.props.isMulti && `(${this.state.selectedTutorialGroups.length})`}
                        </Button>
                    </>
                }
            />
        );
    }
}

TutorialGroupPicker.defaultProps = {
    isMulti: true,
};

export default connect(
    ({ userState }) => ({
        userState
    })
)(TutorialGroupPicker);