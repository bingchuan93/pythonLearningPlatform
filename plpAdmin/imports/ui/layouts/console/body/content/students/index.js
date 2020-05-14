import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Button } from 'reactstrap';
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
				accessor: 'isArchived',
				Header: 'Is Archived',
				accessor: (data) => data.isArchived,
				searchAlgorithm: 'boolean',
				filterable: false,
			},
			{
				id: 'createdAt',
				accessor: 'createdAt',
				Header: 'Created At',
				accessor: (data) => <React.Fragment>{moment(data.createdAt).format('YYYY-MM-DD h:mma')}</React.Fragment>,
				filterable: false,
			},
		];

		return (
			<div className="students">
				<h1>Students</h1>
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
				<Footer className="d-flex justify-content-end">
					<Button
						color="create"
						size="md"
						onClick={() => {
							props.dispatch('/console/students/import');
						}}>
						Import
					</Button>
				</Footer>
			</div>
		);
	}
}

export default connect()(Students);
