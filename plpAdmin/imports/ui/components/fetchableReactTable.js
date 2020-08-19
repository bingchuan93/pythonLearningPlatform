import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import { useTable, useFilters, useSortBy, usePagination } from 'react-table';
import { Table, Button, Input, Row, Col } from 'reactstrap';
import Loader from '/imports/ui/components/icons/loader';
import FontAwesomeIcon from '/imports/ui/components/fontAwesomeIcon';
import Checkbox from '/imports/ui/components/checkbox';
import { usePrevious, useIsMounted, composeSubscriptionFiltersFieldsSort } from '/imports/util';
import _ from 'lodash';

const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }) => {
	return (
		<Input
			value={filterValue || ''}
			bsSize={'sm'}
			onChange={(e) => {
				setFilter(e.target.value || undefined);
			}}
		/>
	);
};

const FetchableReactTable = (props) => {
	const {
		dataEndPoint,
		columns,
		dataParams,
		contentState: { fetchableTableForceFetchToggler },
	} = props;

	const defaultColumn = useMemo(
		() => ({
			Filter: DefaultColumnFilter,
		}),
		[]
	);

	const initialState = { pageIndex: 0 };
	if (props.defaultFiltered) {
		initialState.filters = props.defaultFiltered;
	}
	if (props.defaultSorted) {
		initialState.sortBy = props.defaultSorted;
	}

	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState([]);
	const [pageCount, setPageCount] = useState(0);

	const [isSelectedAll, setIsSelectedAll] = useState(false);

	const [selectedRows, setSelectedRows] = useState(_.cloneDeep(props.preSelectedRows));
	const isMounted = useIsMounted();

	const fetchIdRef = useRef(0);
	const fetchData = useCallback(
		({ pageIndex, pageSize, filters, sortBy, dataParams }) => {
			if (props.dataEndPoint) {
				const fetchId = ++fetchIdRef.current;
				isMounted() && setIsLoading(true);
				if (fetchId === fetchIdRef.current) {
					const docParams = composeSubscriptionFiltersFieldsSort(columns, filters, sortBy);
					Meteor.call(
						dataEndPoint,
						{
							filters: docParams.filters,
							fields: docParams.fields,
							sort: docParams.sort,
							pageSize: pageSize,
							page: pageIndex,
							extraParams: dataParams,
						},
						(error, result) => {
							isMounted() && setIsLoading(false);
							if (!error && isMounted()) {
								setData(result.data);
								setPageCount(Math.ceil(result.count / pageSize));
							}
						}
					);
					if (isMounted()) {
						if (props.shouldRetainSelectedRows) {
							setIsSelectedAll(false);
						} else {
							setIsSelectedAll(false);
							setSelectedRows([]);
						}
					}
				}
			}
		},
		[props.dataEndPoint, isMounted()]
	);

	const toggleSelectAll = () => {
		if (isSelectedAll) {
			if (props.shouldRetainSelectedRows) {
				const clonedSelectedRows = _.cloneDeep(selectedRows);
				const tmpSelectedRows = clonedSelectedRows.filter((selectedRow) => !data.map((dataRow) => dataRow._id.valueOf()).includes(selectedRow._id.valueOf()));
				setSelectedRows(tmpSelectedRows);
			} else {
				setSelectedRows([]);
			}
			setIsSelectedAll(false);
		} else {
			const tmpSelectedRows = [];
			data.forEach((dataRow) => {
				if (!props.disabledRows.map((disabledRow) => disabledRow._id.valueOf()).includes(dataRow._id.valueOf())) {
					tmpSelectedRows.push(dataRow);
				}
			});
			if (props.shouldRetainSelectedRows) {
				const otherPageSelectedRows = _.cloneDeep(selectedRows).filter((selectedRow) => !data.map((dataRow) => dataRow._id.valueOf()).includes(selectedRow._id.valueOf()));
				setSelectedRows([...otherPageSelectedRows, ...tmpSelectedRows]);
			} else {
				setSelectedRows([...tmpSelectedRows]);
			}
			setIsSelectedAll(true);
		}
	};

	const toggleRow = (row) => {
		const clonedRow = _.cloneDeep(row);
		if (props.isMultiSelect) {
			const clonedSelectedRows = _.cloneDeep(selectedRows);
			const idx = _.findIndex(clonedSelectedRows, (selectedRow) => {
				return selectedRow._id.valueOf() == clonedRow._id.valueOf();
			});
			if (idx != -1) {
				clonedSelectedRows.splice(idx, 1);
			} else {
				clonedSelectedRows.push(clonedRow);
			}
			changeSelectedRows(clonedSelectedRows);
		} else {
			changeSelectedRows([clonedRow]);
		}
	};

	const changeSelectedRows = (newSelectedRows) => {
		const clonedNewSelectRows = _.cloneDeep(newSelectedRows);
		if (clonedNewSelectRows.length == data.length && clonedNewSelectRows.length != 0) {
			setSelectedRows(clonedNewSelectRows);
			setIsSelectedAll(true);
		} else {
			setSelectedRows(clonedNewSelectRows);
			setIsSelectedAll(false);
		}
	};

	if (props.showCheckbox) {
		const prevSelectedRows = usePrevious(selectedRows);
		useEffect(() => {
			if (!_.isEqual(prevSelectedRows, selectedRows)) {
				props.onCheckboxChange(_.cloneDeep(selectedRows));
			}
		}, [selectedRows]);
	}

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		pageOptions,
		setPageSize,
		canPreviousPage,
		previousPage,
		canNextPage,
		nextPage,
		gotoPage,
		state: { pageIndex, pageSize, filters, sortBy },
	} = useTable(
		{
			columns,
			data: !!props.dataEndPoint ? data : props.data,
			defaultColumn,
			initialState,
			pageCount,
			manualFilters: !!props.dataEndPoint,
			manualSortBy: !!props.dataEndPoint,
			manualPagination: !!props.dataEndPoint,
		},
		useFilters,
		useSortBy,
		usePagination,
		(hooks) => {
			hooks.visibleColumns.push((columns) => [
				{
					id: 'selection',
					Header: 'Selection',
				},
				...columns,
			]);
		}
	);

	const prevPageIndex = usePrevious(pageIndex);
	const prevPageSize = usePrevious(pageSize);
	const prevFilters = usePrevious(filters);
	const prevSortBy = usePrevious(sortBy);
	const prevDataParams = usePrevious(dataParams);
	const prevFetchableTableForceFetchToggler = usePrevious(fetchableTableForceFetchToggler);
	const [pageNumber, setPageNumber] = useState(pageIndex + 1);

	// useEffect(() => {
	// 	setData(props.data);
	// }, [props.data]);

	useEffect(() => {
		setSelectedRows(props.preSelectedRows);
	}, [props.preSelectedRows]);

	useEffect(() => {
		if (
			!_.isEqual(prevPageIndex, pageIndex) ||
			!_.isEqual(prevPageSize, pageSize) ||
			!_.isEqual(prevFilters, filters) ||
			!_.isEqual(prevSortBy, sortBy) ||
			!_.isEqual(prevDataParams, dataParams) ||
			!_.isEqual(prevFetchableTableForceFetchToggler, fetchableTableForceFetchToggler)
		) {
			if (!_.isEqual(prevDataParams, dataParams)) {
				setPageNumber(1);
				gotoPage(0);
			}
			fetchData({ pageIndex, pageSize, filters, sortBy, dataParams, fetchableTableForceFetchToggler });
		}
	}, [fetchData, pageIndex, pageSize, filters, sortBy, dataParams, fetchableTableForceFetchToggler]);

	return (
		<div className={'rt-wrapper'}>
			<div className={props.className}>
				<div className={'react-table' + (props.showFilters ? ' with-filters' : '')} style={props.maxHeight ? { maxHeight: props.maxHeight } : {}}>
					{isLoading && (
						<div className="loading-screen">
							<Loader />
						</div>
					)}
					<Table striped {...getTableProps()}>
						<thead>
							{headerGroups.map((headerGroup) => (
								<tr {...headerGroup.getHeaderGroupProps()} className="rt-header">
									{headerGroup.headers.map((column) => {
										if ('show' in column && column.show == false) {
											return;
										}
										if (column.id != 'selection' || props.showCheckbox) {
											return (
												<th
													className={`${column.isSorted ? (column.isSortedDesc ? 'sort-desc' : 'sort-asc') : ''} ${
														column.headerClassName ? column.headerClassName : ''
													} text-nowrap`}
													{...column.getHeaderProps(
														column.getSortByToggleProps({
															title: `Sort by ${column.Header}`,
														})
													)}
												>
													{column.id == 'selection' && props.showCheckbox ? (
														<React.Fragment>
															{props.isMultiSelect && (
																<div
																	className="mr-3"
																	onClick={(e) => {
																		e.stopPropagation();
																		e.preventDefault();
																		toggleSelectAll();
																	}}
																>
																	<Checkbox checked={isSelectedAll} onChange={() => {}} />
																</div>
															)}
														</React.Fragment>
													) : (
														column.render('Header')
													)}
												</th>
											);
										}
									})}
								</tr>
							))}
							{props.showFilters &&
								headerGroups.map((headerGroup) => (
									<tr {...headerGroup.getHeaderGroupProps()} className="rt-filter">
										{headerGroup.headers.map((column) => {
											if ('show' in column && column.show == false) {
												return;
											}
											if (column.id != 'selection' || props.showCheckbox) {
												return <th {...column.getHeaderProps()}>{column.canFilter ? column.render('Filter') : null}</th>;
											}
										})}
									</tr>
								))}
						</thead>
						<tbody {...getTableBodyProps()}>
							{rows.length > 0 ? (
								<React.Fragment>
									{rows.map((row, i) => {
										prepareRow(row);
										let isDisabledRow = false;
										let onRowClick = props.onRowClick;
										if (props.clickRowToSelect) {
											isDisabledRow = props.disabledRows.some((disabledRow) => disabledRow._id.valueOf() == row.original._id.valueOf());
											if (!isDisabledRow) {
												onRowClick = (e) => {
													e.stopPropagation();
													e.preventDefault();
													toggleRow(row.original);
												};
											} else {
												onRowClick = null;
											}
										}
										return (
											<tr {...row.getRowProps()} className={isDisabledRow ? 'disabled' : ''}>
												{row.cells.map((cell) => {
													if ('show' in cell.column && cell.column.show == false) {
														return;
													}
													let onCellClick = onRowClick;
													let classNames = cell.column.className;
													if (('clickable' in cell.column && !cell.column.clickable) || !props.isRowsClickable) {
														classNames += ' not-clickable';
														onCellClick = null;
													}
													if (cell.column.id != 'selection') {
														const extraProps = cell.column.getProps ? cell.column.getProps(cell.row) : {};
														return (
															<td
																{...cell.getCellProps()}
																{...extraProps}
																onClick={(e) => {
																	if (onCellClick) {
																		if (props.clickRowToSelect) {
																			onCellClick(e);
																		} else {
																			onCellClick(row, cell.column);
																		}
																	}
																}}
																className={classNames}
															>
																{cell.render('Cell')}
															</td>
														);
													} else {
														if (props.showCheckbox) {
															return (
																<td
																	{...cell.getCellProps()}
																	onClick={(e) => {
																		e.stopPropagation();
																		e.preventDefault();
																		toggleRow(cell.row.original);
																	}}
																>
																	<div className="mr-3">
																		<Checkbox
																			checked={
																				_.find(selectedRows, (selectedRow) => {
																					return cell.row.original._id.valueOf() == selectedRow._id.valueOf();
																				})
																					? true
																					: false
																			}
																			onClick={(e) => e.preventDefault()}
																			onChange={() => {}}
																		/>
																	</div>
																</td>
															);
														}
													}
												})}
											</tr>
										);
									})}
								</React.Fragment>
							) : (
								<React.Fragment>
									<tr>
										<td
											className="not-clickable"
											style={{ padding: 0 }}
											colSpan={props.showCheckbox ? columns.filter((c) => !('show' in c) || c.show).length + 1 : columns.filter((c) => !('show' in c) || c.show).length}
										>
											<div className="rt-no-data">
												<div>{props.noDataText}</div>
											</div>
										</td>
									</tr>
								</React.Fragment>
							)}
						</tbody>
					</Table>
				</div>
				{props.showPagination && (
					<Row form className="rt-pagination justify-content-center align-items-center">
						<Col xs={'auto'}>
							<Button
								className="btn-previous"
								size="sm"
								color="default"
								outline
								disabled={!canPreviousPage}
								onClick={() => {
									previousPage();
									setPageNumber(pageNumber - 1);
								}}
							>
								<FontAwesomeIcon name={'chevron-left'} />
							</Button>
						</Col>
						<Col xs={'auto'} className="hide-in-mobile">
							Page
						</Col>
						<Col xs={'auto'} className="hide-in-mobile">
							<Input
								type="number"
								className="page-number"
								bsSize="sm"
								value={pageNumber}
								onChange={(e) => {
									setPageNumber(e.target.value);
								}}
								onBlur={(e) => {
									try {
										const tmpPage = e.target.value ? Number(e.target.value) - 1 : 0;
										page = tmpPage < 0 ? 0 : tmpPage > pageCount - 1 ? pageCount - 1 : tmpPage;
										setPageNumber(page + 1);
										gotoPage(page);
									} catch (err) {
										setPageNumber(1);
										gotoPage(0);
									}
								}}
							/>
						</Col>
						<Col xs={'auto'} className="hide-in-mobile">
							of {pageOptions.length}
						</Col>
						<Col xs={'auto'}>
							<Input
								type="select"
								className="page-size"
								value={pageSize}
								bsSize="sm"
								onChange={(e) => {
									setPageSize(Number(e.target.value));
								}}
							>
								{[5, 10, 20, 25, 50, 100].map((pageSize) => (
									<option key={pageSize} value={pageSize}>
										Show {pageSize}
									</option>
								))}
							</Input>
						</Col>
						<Col xs={'auto'}>
							<Button
								className="btn-next"
								size="sm"
								color="default"
								outline
								disabled={!canNextPage}
								onClick={() => {
									nextPage();
									setPageNumber(pageNumber + 1);
								}}
							>
								<FontAwesomeIcon name={'chevron-right'} />
							</Button>
						</Col>
					</Row>
				)}
			</div>
		</div>
	);
};

FetchableReactTable.defaultProps = {
	dataEndPoint: null,
	data: [],
	columns: [],
	isRowsClickable: true,
	showFilters: true,
	showPagination: true,
	defaultFiltered: null,
	defaultSorted: null,
	onRowClick: () => {},
	showCheckbox: false,
	onCheckboxChange: () => {},
	preSelectedRows: [],
	shouldRetainSelectedRows: false,
	clickRowToSelect: false,
	disabledRows: [],
	isMultiSelect: true,
	noDataText: 'No Data Found',
};

export default connect(({ contentState }) => ({
	contentState,
}))(FetchableReactTable);
