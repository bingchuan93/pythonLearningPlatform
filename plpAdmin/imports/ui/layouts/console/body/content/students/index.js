import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import FetchableReactTable from '/imports/ui/components/fetchableReactTable';

class Students extends Component {
    render() {
        const columns = [{
            id: 'username',
            Header: 'Username',
            accessor: data => data.username
        }, {
            id: 'isArchived',
            accessor: 'isArchived',
            Header: 'Is Archived',
            accessor: data => data.isArchived,
            searchAlgorithm: 'boolean',
            filterable: false,
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
        }];

        return (
            <div className="students">
                <h1>Students</h1>
                <FetchableReactTable
                    dataEndPoint={'Students.list'}
                    columns={columns}
                    defaultFiltered={[{ id: 'isArchived', value: 'false' }]}
                    getTdProps={(state, rowInfo, column) => {
                        return {
                            // onClick: (e) => { this.handleView(rowInfo, column) }
                        };
                    }}
                />
            </div>
        );
    }
}

export default connect()(Students);