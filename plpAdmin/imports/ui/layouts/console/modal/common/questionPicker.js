import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'reactstrap';
import _ from 'lodash';
import FetchableReactTable from '/imports/ui/components/fetchableReactTable';
import BaseModal from '/imports/ui/components/modal/base';
import Checkbox from '/imports/ui/components/checkbox';
import constants from '/imports/constants';

class QuestionPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedQuestions: this.props.selectedQuestions ? this.props.selectedQuestions : [],
            extraTableParams: this.props.filterParams
        };
    }

    render() {
        const columns = [
            {
                id: 'content',
                Header: 'Content',
                accessor: (data) => data.content,
            },
            {
                id: 'type',
                Header: 'Type',
                searchAlgorithm: 'string',
                accessor: (data) => _.find(constants.questionTypes, { value : data.type }).label,
				Filter: ({ column: { filterValue, setFilter } }) => (
					<Input type="select" bsSize="sm" onChange={event => setFilter(event.target.value || undefined)} value={filterValue ? filterValue : ''}>
						<option value="">Show All</option>
                        {Object.entries(constants.questionTypes).map(([key, value]) => {
                            return <option key={key} value={value.value}>{value.label}</option>;
                        })}
					</Input>
				)
            },
            {
                id: 'answers',
                Header: 'No of Answers',
                accessor: (data) => data.type != 'coding' ? data.answers.length : data.testCases.length,
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
                headerText="Select Questions"
                className="question-picker"
                size="lg"
                bodyClasses={'overflow-auto'}
                body={
                    <>
                        <FetchableReactTable
                            dataEndPoint={'Questions.list'}
                            dataParams={this.state.extraTableParams}
                            columns={columns}
                            // disabledRows={this.props.disabledProducts}
                            clickRowToSelect={true}
                            showCheckbox={true}
                            preSelectedRows={this.state.selectedQuestions}
                            shouldRetainSelectedRows={true}
                            onCheckboxChange={(selectedRows) => {
                                this.setState({ selectedQuestions: selectedRows });
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
                                this.props.dispatch({ type: 'MODAL/CLOSE' });
                            }}
                        >
                            Cancel
						</Button>
                        <Button
                            color="primary"
                            size="md"
                            onClick={() => {
                                this.props.saveSelectedQuestions(this.state.selectedQuestions);
                                this.props.dispatch({ type: 'MODAL/CLOSE' });
                            }}
                            disabled={this.state.selectedQuestions.length == 0}
                        >
                            Save {this.props.isMulti && `(${this.state.selectedQuestions.length})`}
                        </Button>
                    </>
                }
            />
        );
    }
}

QuestionPicker.defaultProps = {
    isMulti: true,
    filterParams: {}
};

export default connect(
    ({ userState }) => ({
        userState
    })
)(QuestionPicker);