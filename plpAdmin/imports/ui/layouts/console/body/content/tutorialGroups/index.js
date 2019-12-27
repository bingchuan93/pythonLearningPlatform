import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import moment from 'moment';
import { Button } from 'reactstrap';
import FetchableReactTable from '/imports/ui/components/fetchableReactTable';

class TutorialGroups extends Component {
    render() {
        const columns = [{
            id: 'name',
            Header: 'Name',
            accessor: data => data.name
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
                            // onClick: (e) => { this.handleView(rowInfo, column) }
                        };
                    }}
                />
            </div>
        );
    }
}

export default connect()(TutorialGroups);