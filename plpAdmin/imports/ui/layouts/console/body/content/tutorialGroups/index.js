import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import moment from 'moment';
import { Button, Badge } from 'reactstrap';
import FetchableReactTable from '/imports/ui/components/fetchableReactTable';

class TutorialGroups extends Component {
    handleView = (rowInfo, column) => {
        if (column.id != 'actions' && column.id != 'checkbox' && rowInfo) {
            this.props.dispatch(push('/tutorial-groups/view/' + rowInfo.original._id.valueOf()));
        }
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
        const columns = [{
            id: 'name',
            Header: 'Name',
            accessor: data => data.name
        }, {
            id: 'isArchived',
            accessor: 'isArchived',
            Header: 'Is Archived',
            accessor: data => (
                <Badge color={data.isArchived ? 'positive' : 'negative'}>{data.isArchived ? 'TRUE' : 'FALSE'}</Badge>
            ),
            Filter: ({ filter, onChange }) => (
                <select
                    onChange={event => onChange(event.target.value)}
                    style={{ width: '100%' }}
                    value={filter ? filter.value : 'false'}>
                    <option value="boolean-all">Show All</option>
                    <option value="false">Active</option>
                    <option value="true">Archived</option>
                </select>
            ),
            searchAlgorithm: 'boolean',
        }, {
            id: 'createdAt',
            accessor: 'createdAt',
            Header: 'Created At',
            accessor: data => (
                <React.Fragment>
                    {moment(data.createdAt).format("YYYY-MM-DD h:mma")}
                </React.Fragment>
            ),
            filterable: false,
        }, {
            id: 'actions',
            Header: 'Actions',
            accessor: data => (
                <React.Fragment>
                    <Button color="update" size="sm" className="mr-1"
                        onClick={() => {
                            this.props.dispatch(push('/tutorial-groups/update/' + data._id));
                        }}
                    >Edit</Button>
                    {data.isArchived ? (
                        <Button color="success" size="sm" onClick={() => {
                            this.handleRestore(data._id)
                        }}>Restore</Button>
                    ) : (
                            <Button color="secondary" size="sm" onClick={() => {
                                this.handleArchive(data._id)
                            }}>Archive</Button>
                        )}
                </React.Fragment>
            ),
            filterable: false,
            sortable: false,
            width: 120,
        }];

        return (
            <div className="tutorial-groups">
                <div className="d-flex justify-content-between">
                    <h1>Tutorial Groups</h1>
                    <div>
                        <Button color="create" onClick={() => this.props.dispatch(push('/tutorial-groups/create'))}>Add</Button>
                    </div>
                </div>
                <FetchableReactTable
                    dataEndPoint={'TutorialGroups.list'}
                    columns={columns}
                    defaultFiltered={[{ id: 'isArchived', value: 'false' }]}
                    getTdProps={(state, rowInfo, column) => {
                        return {
                            onClick: (e) => { this.handleView(rowInfo, column) }
                        };
                    }}
                />
            </div>
        );
    }
}

export default connect()(TutorialGroups);