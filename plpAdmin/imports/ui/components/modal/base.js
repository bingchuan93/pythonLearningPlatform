import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

const ChildModal = (props) => {
	if (props.childModals.length - 1 > props.index) {
		const childModalIndex = props.index + 1;
		const ChildModal = props.childModals[childModalIndex];
		if (ChildModal) {
			return (
                <ChildModal.modal {...ChildModal.modalProps} index={childModalIndex} />
			);
		}
	}
	return <></>;
};

class BaseModal extends Component {
    closeModal = (afterCloseModal) => {
        if (afterCloseModal) {
            afterCloseModal();
        }
        this.props.dispatch({ type: 'MODAL/CLOSE' });
    };

    render() {
        return (
            <div className={"base-modal position-fixed w-100 h-100 webkit-overflow-scrolling " + (this.props.className ? this.props.className : "")} onClick={this.props.onClick}>
                <div className={"modal-dialog position-relative d-flex m-auto min-vh-100 align-items-center" + (" modal-" + this.props.size) + (this.props.isScrollable ? " modal-dialog-scrollable" : "")}>
                    <div className={"modal-content d-flex flex-column w-100"}>
                        {this.props.header ? (
                            <React.Fragment>
                                {this.props.header}
                            </React.Fragment>
                        ) : (
                                <div className="modal-header justify-content-between align-items-center">
                                    <h5 className="modal-header-text font-lg m-0">{this.props.headerText ? this.props.headerText : ''}</h5>
                                    <button type="button" className="close-button border-0 font-2xl" onClick={() => { this.closeModal(this.props.afterModalClose) }}><span>×</span></button>
                                </div>
                            )}
                        <div className={"modal-body " + this.props.bodyClasses} style={this.props.bodyStyles}>
                            {this.props.body}
                        </div>
                        {this.props.footer &&
                            <div className={"modal-footer d-flex align-items-center font-sm " + this.props.footerClasses}>
                                {this.props.footer}
                            </div>
                        }
                    </div>
                </div>
                <div className="modal-backdrop position-fixed w-100 h-100" onClick={() => {
                    if (this.props.closeOnBgClick) {
                        this.closeModal();
                    }
                }}></div>
                <ChildModal childModals={this.props.modalState.childModals} index={this.props.index} />
            </div>
        );
    }
}

BaseModal.defaultProps = {
    closeOnBgClick: true,
    bodyClasses: '',
    bodyStyles: {},
    header: null,
    footer: null,
    footerClasses: 'justify-content-between',
    size: 'xl',
    onClose: null,
    index: -1,
    isScrollable: false,
}

export default connect(
    ({ modalState }) => ({
        modalState
    })
)(BaseModal);