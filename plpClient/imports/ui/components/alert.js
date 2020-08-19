import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingButton from '/imports/ui/components/loadingButton';

class Alert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConfirmBtnLoading: false,
            isCloseBtnLoading: false,
        }
    }

    closeAlert = () => {
        this.props.dispatch({ type: 'ALERT/CLOSE' })
    }

    render() {
        return (
            <div className={"alert-modal position-fixed w-100 h-100 webkit-overflow-scrolling " + (this.props.className ? this.props.className : "")} onClick={this.props.onClick}>
                <div className={"alert-dialog position-relative d-flex m-auto min-vh-100 align-items-center justify-content-center " + (this.props.shakeEffectOn == "dialog" ? "error-shake" : "")}>
                    <div className={"alert-content d-flex flex-column w-auto"}>
                        <div className={"alert-body" + this.props.bodyClasses + (this.props.shakeEffectOn == "text" ? " error-shake" : "")}>
                            {this.props.body}
                        </div>
                        {(this.props.footer || this.props.showCloseButton || this.props.showConfirmButton) &&
                            <div className="alert-footer d-flex justify-content-center">
                                {this.props.footer}
                                {this.props.showConfirmButton &&
                                    <LoadingButton
                                        className={"confirm-button " + (this.props.footer ? "ml-2" : "")}
                                        isLoading={this.state.isConfirmBtnLoading}
                                        color={this.props.confirmButtonColor}
                                        onClick={(e) => {
                                            if (this.props.confirmButtonCallback) {
                                                this.setState({ isConfirmBtnLoading: true });
                                                this.props.confirmButtonCallback(e, () => { this.closeAlert(); });
                                            }
                                            else {
                                                this.closeAlert();
                                            }
                                        }}
                                        disabled={this.state.isCloseBtnLoading}
                                    >
                                        {this.props.confirmButtonText}
                                    </LoadingButton>
                                }
                                {this.props.showCloseButton &&
                                    <LoadingButton
                                        className={"close-button " + (this.props.footer || this.props.showConfirmButton ? "ml-2" : "")}
                                        color={this.props.closeButtonColor}
                                        isLoading={this.state.isCloseBtnLoading}
                                        onClick={(e) => {
                                            if (this.props.closeButtonCallback) {
                                                this.setState({ isCloseBtnLoading: true });
                                                this.props.closeButtonCallback(e, () => { this.closeAlert(); });
                                            }
                                            else {
                                                this.closeAlert();
                                            }
                                        }}
                                    >
                                        {this.props.closeButtonText}
                                    </LoadingButton>
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className="alert-backdrop position-fixed w-100 h-100" onClick={(e) => {
                    if (this.props.closeOnBgClick) {
                        if (this.props.closeButtonCallback) {
                            this.setState({ isCloseBtnLoading: true });
                            this.props.closeButtonCallback(e, () => { this.closeAlert(); });
                        }
                        else {
                            this.closeAlert();
                        }
                    }
                }} />
            </div>
        );
    }
}

Alert.defaultProps = {
    shakeEffectOn: 'none',
    closeOnBgClick: true,
    bodyClasses: '',
    showConfirmButton: false,
    confirmButtonColor: 'primary',
    confirmButtonText: 'Ok',
    confirmButtonCallback: null,
    showCloseButton: false,
    closeButtonColor: 'secondary',
    closeButtonText: 'Close',
    closeButtonCallback: null,
}

export default connect(
    ({ appState }) => ({
        appState
    })
)(Alert);