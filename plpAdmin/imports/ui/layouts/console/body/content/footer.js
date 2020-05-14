import React from 'react';
import { connect } from 'react-redux';

const Footer = props => {
	return (
		<div className={'content-footer w-100 mx-n3 py-2 position-fixed ' + props.className} style={{borderTop: '1px solid #d6d6d6', bottom: '0px'}}>
			{props.children}
		</div>
	);
};

export default connect(({ appState }) => ({
	appState
}))(Footer);
