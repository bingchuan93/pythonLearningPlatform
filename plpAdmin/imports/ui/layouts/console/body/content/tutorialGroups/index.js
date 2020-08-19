import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import moment from 'moment';
import { Button, Badge, Input } from 'reactstrap';
import FetchableReactTable from '/imports/ui/components/fetchableReactTable';
import constants from '/imports/constants';

class TutorialGroups extends Component {
	handleView = (rowInfo, column) => {
		if (column.id != 'actions' && column.id != 'checkbox' && rowInfo) {
			this.props.dispatch(push('/tutorial-groups/view/' + rowInfo.original._id.valueOf()));
		}
	};

	handleArchive = (_id) => {
		this.props.dispatch({
			type: 'ALERT/OPEN',
			payload: {
				alertProps: {
					body: <div style={{ textAlign: 'center' }}>Are you sure want to ARCHIVE this tutorial group?</div>,
					closeOnBgClick: true,
					showConfirmButton: true,
					confirmButtonText: 'Yes',
					confirmButtonCallback: (e, closeAlert) => {
						e.preventDefault();
						Meteor.call('TutorialGroups.archive', _id, (error, result) => {
							closeAlert();
							if (error) {
								this.displayError(error.reason);
							} else {
								this.props.dispatch({ type: 'CONTENT/FETCHABLE_TABLE_FORCE_FETCH' });
							}
						});
					},
					showCloseButton: true,
					closeButtonText: 'No',
				},
			},
		});
	};

	handleRestore = (_id) => {
		this.props.dispatch({
			type: 'ALERT/OPEN',
			payload: {
				alertProps: {
					body: <div style={{ textAlign: 'center' }}>Are you sure want to RESTORE this tutorial group?</div>,
					closeOnBgClick: true,
					showConfirmButton: true,
					confirmButtonText: 'Yes',
					confirmButtonCallback: (e, closeAlert) => {
						e.preventDefault();
						Meteor.call('TutorialGroups.restore', _id, (error, result) => {
							closeAlert();
							if (error) {
								this.displayError(error.reason);
							} else {
								this.props.dispatch({ type: 'CONTENT/FETCHABLE_TABLE_FORCE_FETCH' });
							}
						});
					},
					showCloseButton: true,
					closeButtonText: 'No',
				},
			},
		});
	};

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

	render() {
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
				accessor: 'isArchived',
				Header: 'Is Archived',
				accessor: (data) => <Badge color={data.isArchived ? 'positive' : 'negative'}>{data.isArchived ? 'TRUE' : 'FALSE'}</Badge>,
				Filter: ({ column: { filterValue, setFilter } }) => (
					<Input type="select" bsSize="sm" onChange={event => setFilter(event.target.value || undefined)} value={filterValue ? filterValue : ''}>
						<option value="boolean-all">Show All</option>
						<option value="false">Active</option>
						<option value="true">Archived</option>
					</Input>
				),
				searchAlgorithm: 'boolean',
			},
			{
				id: 'createdAt',
				accessor: 'createdAt',
				Header: 'Created At',
				accessor: (data) => <React.Fragment>{moment(data.createdAt).format('YYYY-MM-DD h:mma')}</React.Fragment>,
				disableFilters: true,
			},
			{
				id: 'actions',
				Header: 'Actions',
				accessor: (data) => (
					<React.Fragment>
						<Button
							color="update"
							size="sm"
							className="mr-1"
							onClick={() => {
								this.props.dispatch(push('/tutorial-groups/update/' + data._id));
							}}>
							Edit
						</Button>
						{data.isArchived ? (
							<Button
								color="success"
								size="sm"
								onClick={() => {
									this.handleRestore(data._id);
								}}>
								Restore
							</Button>
						) : (
							<Button
								color="secondary"
								size="sm"
								onClick={() => {
									this.handleArchive(data._id);
								}}>
								Archive
							</Button>
						)}
					</React.Fragment>
				),
				disableFilters: true,
				disableSortBy: true,
				width: 120,
			},
		];

		return (
			<div className="content-wrapper">
				<div className="tutorial-groups">
					<div className="content-title d-flex justify-content-between">
						<div>Tutorial Groups</div>
						<div>
							<Button color="create" onClick={() => this.props.dispatch(push('/tutorial-groups/create'))}>
								Add
							</Button>
						</div>
					</div>
					<div className="content-body">
						<FetchableReactTable
							dataEndPoint={'TutorialGroups.list'}
							dataParams={{}}
							columns={columns}
							defaultFiltered={[{ id: 'isArchived', value: 'false' }]}
							getTdProps={(state, rowInfo, column) => {
								return {
									onClick: (e) => {
										this.handleView(rowInfo, column);
									},
								};
							}}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default connect()(TutorialGroups);
