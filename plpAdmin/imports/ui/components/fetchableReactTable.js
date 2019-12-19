import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import Spinner from '/imports/ui/components/icons/spinner';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Checkbox from '/imports/ui/components/checkbox';
import { composeSubscriptionFiltersFieldsSort } from '/imports/util';
import _ from 'lodash';
import 'react-table/react-table.css';

class FetchableReactTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pages: null,
            loading: false,
            isSelectedAll: false,
            selectedRowIds: [],
        };
        this.tableRef = React.createRef();
    }

    fetchData = (tableState, instance) => {
        this.setState({ loading: true });
        const { pageSize, page, columns, filtered, sorted } = tableState;
        const { filters, fields, sort } = composeSubscriptionFiltersFieldsSort(columns, filtered, sorted);

        Meteor.call(this.props.dataEndPoint, { filters, fields, sort, pageSize, page, extraParams: this.props.dataParams }, (error, result) => {
            if (!error) {
                this.setState({
                    data: result.data,
                    pages: Math.ceil(result.count / pageSize),
                    loading: false
                });
                this.props.onDataFetched(result);
            }
            else {
                this.setState({
                    loading: false
                })
            }
        });
        if (this.props.shouldRetainSelectedIds) {
            this.setState({ isSelectedAll: false });
        }
        else {
            this.setState({ isSelectedAll: false, selectedRowIds: [] });
        }
    }

    toggleSelectAll = () => {
        if (this.state.isSelectedAll) {
            this.setState({
                selectedRowIds: [],
                isSelectedAll: false
            });
        }
        else {
            const selectedRowIds = this.state.data.map((row) => {
                return row._id.valueOf();
            })
            this.setState({
                selectedRowIds: selectedRowIds,
                isSelectedAll: true
            });
        }
    }

    toggleRow = (id) => {
        const selectedRowIds = _.cloneDeep(this.state.selectedRowIds);
        const idx = _.findIndex(this.state.selectedRowIds, (rowId) => { return rowId == id })
        if (idx != -1) {
            selectedRowIds.splice(idx, 1);
        }
        else {
            selectedRowIds.push(id);
        }
        this.setSelectedRowIds(selectedRowIds);
    }

    setSelectedRowIds = (selectedRowIds) => {
        if (selectedRowIds.length == this.state.data.length && selectedRowIds.length != 0) {
            this.setState({ selectedRowIds: [...selectedRowIds], isSelectedAll: true });
        }
        else {
            this.setState({ selectedRowIds: [...selectedRowIds], isSelectedAll: false });
        }
    }

    componentDidMount() {
        this.setSelectedRowIds(this.props.selectedRowIds);
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.dataParams, this.props.dataParams)) {
            if (this.tableRef.current) {
                this.tableRef.current.fireFetchData();
                this.tableRef.current.setState({ page: 0 });
            }
        }
        if (!_.isEqual(prevState.selectedRowIds, this.state.selectedRowIds)) {
            this.props.onCheckboxChange(this.state.selectedRowIds);
        }
        if (!_.isEqual(prevProps.contentState.fetchableTableForceFetchToggler, this.props.contentState.fetchableTableForceFetchToggler)) {
            if (this.tableRef.current) {
                this.tableRef.current.fireFetchData();
            }
        }
        if (!_.isEqual(prevProps.selectedRowIds, this.props.selectedRowIds)) {
            this.setSelectedRowIds(this.props.selectedRowIds);
        }
    }

    render() {
        const { subscription, countMethod, collection, columns, showCheckbox, onCheckboxChange, ...restProps } = this.props;

        const checkboxColumn = {
            id: 'checkbox',
            Header: () => {
                return <Checkbox
                    checked={this.state.isSelectedAll}
                    onChange={(e) => {
                        this.toggleSelectAll();
                    }}
                />
            },
            accessor: '',
            className: 'rt-checkbox',
            Filter: () => {
                return <Checkbox />
            },
            Cell: ({ original }) => {
                return (
                    <div className="non-selectable" style={{ width: '100%', height: '100%', cursor: 'pointer' }} onClick={() => { this.toggleRow(original._id.valueOf()); }}>
                        <Checkbox
                            checked={_.find(this.state.selectedRowIds, (rowId) => { return original._id.valueOf() == rowId })}
                            onClick={(e) => e.preventDefault()}
                            onChange={() => { }}
                        />
                    </div>
                );
            },
            filterable: false,
            sortable: false,
            width: 50
        }

        return (
            <ReactTable
                ref={this.tableRef}
                onFetchData={this.fetchData}
                pages={this.state.pages}
                data={this.state.data}
                loading={this.state.loading}
                filterable={true}
                sortable={true}
                noDataText={'No data found'}
                loadingText={<Spinner />}
                previousText={<FontAwesomeIcon icon={faChevronLeft} />}
                nextText={<FontAwesomeIcon icon={faChevronRight} />}
                columns={this.props.showCheckbox ? [checkboxColumn, ...columns] : columns}
                manual
                className={'-striped -highlight font-sm'}
                {...restProps}
            />
        )
    }
}

FetchableReactTable.defaultProps = {
    defaultPageSize: 10,
    resizable: false,
    showPageSizeOptions: true,
    showCheckbox: false,
    onCheckboxChange: () => { },
    onDataFetched: () => { },
    selectedRowIds: [],
    shouldRetainSelectedIds: false,
}

export default connect(
    ({ contentState }) => ({
        contentState
    })
)(FetchableReactTable);