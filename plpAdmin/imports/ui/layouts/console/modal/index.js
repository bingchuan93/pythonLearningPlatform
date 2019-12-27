import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { matchPath } from 'react-router';
import modalRoutes from '/imports/routes/console/modal';
import contentRoute from '/imports/routes/console/content';
import { getMatchedRoute } from '/imports/util';
import _ from 'lodash';

class Modal extends Component {
    toggleModalBasedOnRoute(prevLocation = { pathname: '/' }) {
        let modalMatchedRoute = getMatchedRoute(this.props.router.location.pathname, modalRoutes);
        let contentMatchedRoute = getMatchedRoute(this.props.router.location.pathname, contentRoute);
        if (modalMatchedRoute) {
            if (!modalMatchedRoute.permissions || modalMatchedRoute.permissions) {
                if (contentMatchedRoute) {
                    prevLocation = {
                        pathname: contentMatchedRoute.path
                    }
                }
                this.props.dispatch({
                    type: 'MODAL/OPEN', payload: {
                        modal: modalMatchedRoute.component,
                        modalProps: { ...modalMatchedRoute.props, ...modalMatchedRoute.matched.params },
                        prevLocation: { ...prevLocation },
                    }
                });
            }
            else {
                this.props.dispatch({
                    type: 'MODAL/CLOSE',
                    payload: { doNotPushToPrevLocation: true }
                });
            }
        }
        else {
            this.props.dispatch({
                type: 'MODAL/CLOSE',
                payload: { doNotPushToPrevLocation: true }
            });
        }
    }

    bringForwardPrevLocationIfPrevIsModal(prevLocation, modalPrevLocation) {
        if (prevLocation) {
            for (let key in modalRoutes) {
                const prevMatch = matchPath(prevLocation.pathname, modalRoutes[key]);
                if (prevMatch) {
                    prevLocation = modalPrevLocation;
                    break;
                }
            }
        }
        return prevLocation;
    }
    componentDidMount() {
        this.toggleModalBasedOnRoute();
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.router.location, this.props.router.location)) {
            const finalPrevLocation = this.bringForwardPrevLocationIfPrevIsModal(prevProps.router.location, prevProps.modalState.prevLocation);
            this.toggleModalBasedOnRoute(finalPrevLocation);
        }
    }

    render() {
        const { appState, modalState } = this.props;
        const RenderingModal = modalState.modal;
        // let transitionProps = { timeout: 0, classNames: 'slideup' };

        // if (appState.isMobile) {
        //     transitionProps = { timeout: 250, classNames: 'slideup' };
        // }
        return (
            RenderingModal &&
                <RenderingModal {...modalState.modalProps} />
        )
    }
}

export default connect(
    ({ appState, modalState, router }) => ({
        appState,
        modalState,
        router
    })
)(Modal);