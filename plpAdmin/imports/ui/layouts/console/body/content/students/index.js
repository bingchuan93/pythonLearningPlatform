import React, { Component } from 'react';
import { connect } from 'react-redux';
import FetchableReactTable from '/imports/ui/components/fetchableReactTable';

class Students extends Component {
    render() {
        const columns = [{
            id: 'username',
            Header: 'Username',
            accessor: data => data.username
        }, {
            id: 'profile.tutorialGroup',
            Header: 'Tutorial Group',
            accessor: data => data.profile.tutorialGroup
        }];

        return (
            <div className="students">
                <h1>Students</h1>
                <FetchableReactTable
                    dataEndPoint={'Students.list'}
                    columns={columns}
                    // defaultFiltered={[{ id: 'isArchived', value: 'false' }]}
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