import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Button, Badge, Input } from 'reactstrap';
import moment from 'moment';
import FetchableReactTable from '/imports/ui/components/fetchableReactTable';
import Footer from '../footer';

class Students extends Component {
	handleView = (rowInfo, column) => {
		if (column.id != 'actions' && column.id != 'checkbox' && rowInfo) {
			this.props.dispatch(push('/students/view/' + rowInfo.original._id.valueOf()));
		}
	};

	render() {
		const columns = [
			{
				id: 'username',
				Header: 'Username',
				accessor: (data) => data.username,
			},
			{
				id: 'isArchived',
				Header: 'Is Archived',
				searchAlgorithm: 'boolean',
				accessor: (data) => <Badge color={data.isArchived ? 'secondary' : 'success'}>{data.isArchived ? 'Archived' : 'Active'}</Badge>,
				Filter: ({ column: { filterValue, setFilter } }) => (
					<Input type="select" bsSize="sm" onChange={event => setFilter(event.target.value || undefined)} value={filterValue ? filterValue : ''}>
						<option value="boolean-all">Show All</option>
						<option value="false">Active</option>
						<option value="true">Archived</option>
					</Input>
				)
			},
			{
				id: 'createdAt',
				accessor: 'createdAt',
				Header: 'Created At',
				accessor: (data) => <React.Fragment>{moment(data.createdAt).format('YYYY-MM-DD h:mma')}</React.Fragment>,
				disableFilters: true
			},
		];

		return (
			<div className="content-wrapper">
				<div className="students">
					<div className="content-title">Students</div>
					<div className="content-body">
						<FetchableReactTable
							dataEndPoint={'Students.list'}
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
					<Footer className="d-flex justify-content-end">
						<Button
							color="create"
							size="md"
							onClick={() => {
								this.props.dispatch(push('/students/import'));
							}}>
							Import
						</Button>
					</Footer>
				</div>
			</div>
		);
	}
}

export default connect()(Students);
