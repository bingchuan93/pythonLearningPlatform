import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import Loader from '/imports/ui/components/icons/loader';
import TestBase from '/imports/ui/layouts/console/modal/testBase';
import { getSemOneDate } from '/imports/util';

class Dashboard extends Component {
	componentDidMount() {
		console.log(getSemOneDate('one'));
	}

	render() {
		return (
			<div className="content-wrapper">
				<div className="dashboard">
					<div className="content-title">Dashboard</div>
					<div className="content-body">
						<Loader />
						<Button
							color="primary"
							onClick={() =>
								this.props.dispatch({
									type: 'MODAL/OPEN',
									payload: {
										modal: TestBase,
										modalProps: {
											id: 123,
										},
										prevLocation: { pathname: '/' },
									},
								})
							}>
							Test modal
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default connect()(Dashboard);
