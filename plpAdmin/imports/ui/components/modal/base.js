import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

class BaseModal extends Component {
    closeModal = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
        else {
            const { modalState } = this.props;
            if ( modalState.prevLocation ) {
                this.props.dispatch(push(modalState.prevLocation));
                // if (prevLocation.title) {
                //     document.title = prevLocation.title;
                // }
            }
            this.props.dispatch({ type: 'MODAL/RESET' });
        }
    }

    render() {
        return (
            <div className={"base-modal position-fixed w-100 h-100 webkit-overflow-scrolling " + (this.props.className ? this.props.className : "")} onClick={this.props.onClick}>
                <div className={"modal-dialog position-relative d-flex m-auto min-vh-100 align-items-center" + (" modal-"+this.props.size)}>
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
    onClose: null
}

export default connect(
    ({ modalState }) => ({
        modalState
    })
)(BaseModal);